import IntegratedController from './integratedController'
import Performance from './performance'
import { flatPromiseAll } from '../helpers/utils'
import { MonitorConfig, PerformanceInstance, MetricsRes } from '../types'

// 1
// monitor({
//   ...
// })

// monitor.getFCP(...)

export default class {
  private integratedController: IntegratedController<MetricsRes>
  constructor() {
    if (!Performance.supportPerformance)
      throw Error("browser doesn't support performance api")
    // const perf = new Performance()
    this.integratedController = new IntegratedController<MetricsRes>()
  }

  async integratedConfig(config: MonitorConfig): Promise<MetricsRes> {
    if (Performance.supportPerformanceObserver())
      throw Error("browser doesn't support performanceObserver api")

    let promiseArr = []
    if (config.firstPaint || config.firstContentfulPaint) {
      promiseArr.push(this.integratedController.getFirstPaint())
    }

    if (config.timeToInteractive) {
      promiseArr.push(this.integratedController.getTimeToInteractive())
    }

    let results = await Promise.all(promiseArr)
    if (config.analyticsHooks) {
      return {}
    } else {
      return flatPromiseAll(results)
    }
  }

  getFCP(): Promise<MetricsRes> {
    return this.integratedController.getFirstPaint()
  }

  getFID(): Promise<MetricsRes> {
    return this.integratedController.getFirstInputDelay()
  }

  getTTI(): Promise<MetricsRes> {
    return this.integratedController.getTimeToInteractive()
  }
}
