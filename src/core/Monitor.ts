import IntegratedController from '../performance/integratedController'
import SafetyObserve from '../safety/observe'
import IdleQueue from './idleQueue'
import { logMetrics } from '../helpers/logPerf'
import {
  supportPerformance,
  supportPerformanceObserver,
  flatObjectInArr,
} from '../helpers/utils'
import globalListener from '../helpers/globalListener'
import { MonitorConfig } from '../types'
import { MetricsData } from '../types/performance'

export default class {
  private integratedController: IntegratedController<MetricsData>
  private safetyInstance?: SafetyObserve
  private idleQueue: IdleQueue
  private defaultResult?: { projectName: string; version: number | string }
  constructor() {
    if (!supportPerformance())
      throw Error("browser doesn't support performance api")

    this.integratedController = new IntegratedController<MetricsData>()
    this.idleQueue = new IdleQueue()
  }

  public async integratedConfig(
    config: MonitorConfig,
  ): Promise<MetricsData | void> {
    if (!supportPerformanceObserver())
      throw Error("browser doesn't support performanceObserver api")

    const {
      projectName,
      version,
      firstPaint,
      firstContentfulPaint,
      firstInputDelay,
      timeToInteractive,
      firstMeaningfulPaint,
      largestContentfulPaint,
      timeToFirstByte,
      navigationTiming,
      perfTracker,
      safetyTracker,
    } = config

    this.defaultResult = {
      projectName,
      version: version || '',
    }

    if (safetyTracker) {
      this.safetyInstance = new SafetyObserve({
        xss: true,
        trackerCb: safetyTracker,
      })
    }

    const collectMetrics = []

    if (firstPaint || firstContentfulPaint) {
      collectMetrics.push(this.integratedController.getFirstPaint())
    }

    if (firstInputDelay) {
      collectMetrics.push(this.integratedController.getFirstInputDelay())
    }

    if (firstMeaningfulPaint) {
      collectMetrics.push(this.integratedController.getFirstMeaningFulPaint())
    }

    if (timeToInteractive) {
      collectMetrics.push(this.integratedController.getTimeToInteractive())
    }

    if (largestContentfulPaint) {
      collectMetrics.push(this.integratedController.getLargestContentFulPaint())
    }

    if (timeToFirstByte) {
      collectMetrics.push(this.integratedController.getTimeToFirstByte())
    }

    if (navigationTiming) {
      collectMetrics.push(this.integratedController.getNavigationTiming())
    }

    let data = await Promise.all(collectMetrics)

    if (perfTracker) {
      const trackerCb = () => {
        logMetrics(
          Object.assign({}, this.defaultResult, {
            data: flatObjectInArr(data),
          }),
          perfTracker,
        )
      }
      this.pushTask(() => {
        trackerCb()
      })

      globalListener(trackerCb)
    } else {
      return flatObjectInArr(data)
    }
  }

  public getFCP(): Promise<MetricsData> {
    return this.transformResult(this.integratedController.getFirstPaint)
  }

  public getFID(): Promise<MetricsData> {
    return this.transformResult(this.integratedController.getFirstInputDelay)
  }

  public getFMP(): Promise<MetricsData> {
    return this.transformResult(
      this.integratedController.getFirstMeaningFulPaint,
    )
  }

  public getTTI(): Promise<MetricsData> {
    return this.transformResult(this.integratedController.getTimeToInteractive)
  }

  public getTTFB(): Promise<MetricsData> {
    return this.transformResult(this.integratedController.getTimeToFirstByte)
  }

  public getLCP(): Promise<MetricsData> {
    return this.transformResult(
      this.integratedController.getLargestContentFulPaint,
    )
  }

  public getNavTiming(): Promise<MetricsData> {
    return this.transformResult(this.integratedController.getNavigationTiming)
  }

  public safteyTracker() {}

  private async transformResult(fn: () => MetricsData | Promise<MetricsData>) {
    let data = await fn.call(this.integratedController)
    return Object.assign({}, this.defaultResult, data)
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
