interface TTIConfig {
  entries: PerformanceEntryList
}

export class TTI {
  private ob?: PerformanceObserver
  private resolveFn: ((val: number) => void) | null
  private longtask: Array<{ start: number; end: number }>
  private navEntry: PerformanceTiming = performance.timing
  private timer: ReturnType<typeof setTimeout> | null
  constructor() {
    this.resolveFn = null
    this.longtask = []
    this.timer = null
    this.registerPerformanceObserver()
  }

  public getFirstConsistentlyInteractive(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.resolveFn = resolve

      if (document.readyState === 'complete') {
        this.startSchedulingTimerTasks()
      } else {
        window.addEventListener('load', () => {
          this.startSchedulingTimerTasks()
        })
      }
    })
  }

  private registerPerformanceObserver() {
    this.ob = new PerformanceObserver(
      (entryList: PerformanceObserverEntryList) => {
        let entries = entryList.getEntries()
        for (let entry of entries) {
          if (entry.entryType === 'longtask') {
            this.longTaskFinishedCallback(entry)
          }
        }
      }
    )

    this.ob.observe({ entryTypes: ['longtask', 'resource'] })
  }

  private startSchedulingTimerTasks() {
    // todo
    this.recheduleTimer(5000)
  }

  private recheduleTimer(earliestTime: number) {
    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.checkTTI()
    }, earliestTime - performance.now())
  }

  private checkTTI() {
    const navigationStart = performance.timing.navigationStart
    let minValue = this.getMinValue()
    let searchStart =
      performance.timing.domContentLoadedEventEnd - navigationStart
    let fciVal: number = this.computedFirstConsistentInteractive(
      searchStart,
      minValue
    )

    if (fciVal) {
      this.resolveFn!(fciVal)
    }
  }

  private longTaskFinishedCallback(performanceEntry: PerformanceEntry) {
    const taskEndTime = performanceEntry.startTime + performanceEntry.duration
    this.longtask.push({
      start: performanceEntry.startTime,
      end: taskEndTime
    })
    this.recheduleTimer(taskEndTime + 5000)
  }

  private computedFirstConsistentInteractive(
    searchStart: number,
    minValue: number
  ): number {
    let fciVal =
      this.longtask.length === 0
        ? searchStart
        : this.longtask[this.longtask.length - 1].end

    return Math.max(minValue, fciVal)
  }

  private getMinValue(): number {
    const { domContentLoadedEventEnd, navigationStart } = this.navEntry
    return domContentLoadedEventEnd - navigationStart
  }
}

export default (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const tti = new TTI()
    resolve(tti.getFirstConsistentlyInteractive())
  })
}
