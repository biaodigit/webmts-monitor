import IntegratedController from './integratedController'
import Performance from './performance'
import IdleQueue from './idleQueue'
import { trackerMetrics, logMetrics } from '../helpers/logPerf'
import { flatObjectInArr } from '../helpers/utils'
import { MonitorConfig, MetricsData } from '../types'

export default class {
  private integratedController: IntegratedController<MetricsData>
  private idleQueue: IdleQueue
  constructor() {
    if (!Performance.supportPerformance)
      throw Error("browser doesn't support performance api")
    // const perf = new Performance()
    this.integratedController = new IntegratedController<MetricsData>()
    this.idleQueue = new IdleQueue()
  }

  public async integratedConfig(config: MonitorConfig): Promise<MetricsData | void> {
    if (!Performance.supportPerformanceObserver())
      throw Error("browser doesn't support performanceObserver api")

    const {
      firstPaint,
      firstContentfulPaint,
      firstInputDelay,
      timeToInteractive,
      timeToFirstByte,
      navigationTiming,
      trackerHooks
    } = config

    let collectMetrics = []
    if (firstPaint || firstContentfulPaint) {
      collectMetrics.push(this.integratedController.getFirstPaint())
    }

    if (firstInputDelay) {
      collectMetrics.push(this.integratedController.getFirstInputDelay())
    }

    if (timeToInteractive) {
      collectMetrics.push(this.integratedController.getTimeToInteractive())
    }

    if (timeToFirstByte) {
      collectMetrics.push(this.integratedController.getTimeToFirstByte())
    }

    if (navigationTiming) {
      collectMetrics.push(this.integratedController.getNavigationTiming())
    }

    let data = await Promise.all(collectMetrics)
    if (trackerHooks) {
      trackerMetrics({ data: flatObjectInArr(data) }, trackerHooks)
    } else {
      return flatObjectInArr(data)
    }
  }

  public getFCP(): Promise<MetricsData> {
    return this.integratedController.getFirstPaint()
  }

  public getFID(): Promise<MetricsData> {
    return this.integratedController.getFirstInputDelay()
  }

  public getTTI(): Promise<MetricsData> {
    return this.integratedController.getTimeToInteractive()
  }

  public getTTFB(): Promise<MetricsData> {
    return Promise.resolve(this.integratedController.getTimeToFirstByte())
  }

  public getNavTiming(): Promise<MetricsData> {
    return Promise.resolve(this.integratedController.getNavigationTiming())
  }

  private pushTask(cb: any) {
    if (this.idleQueue && this.idleQueue.pushTask) {
      this.idleQueue.pushTask(() => {
        cb()
      })
    } else {
      cb()
    }
  }
}
