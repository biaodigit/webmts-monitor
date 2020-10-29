class TTI {
  private ob?: PerformanceObserver
  private resolveFn: ((val: number) => void) | null
  private longtask: Array<{ start: number; end: number }>
  private networkRequests: Array<{ start: number; end: number }>
  private navEntry: PerformanceTiming = performance.timing
  private timer: ReturnType<typeof setTimeout> | null
  private uniqueId: number
  private completeRequest: any
  constructor() {
    this.resolveFn = null
    this.longtask = []
    this.timer = null
    this.uniqueId = 0
    this.networkRequests = []
    this.completeRequest = new Map()
    this.registerListener()
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

  private registerListener () {
    this.patchXMLHTTPRequest(
      this.beforeInitRequestCb.bind(this),
      this.afterInitRequestCb.bind(this)
    )
    this.patchFetch(
      this.beforeInitRequestCb.bind(this),
      this.afterInitRequestCb.bind(this)
    )

    this.registerPerformanceObserver()
  }

  private registerPerformanceObserver() {
    this.ob = new PerformanceObserver(
      (entryList: PerformanceObserverEntryList) => {
        let entries = entryList.getEntries()
        for (let entry of entries) {
          if (entry.entryType === 'longtask') {
            this.longTaskFinishedCallback(entry)
          } else if (entry.entryType === 'resource') {
            this.networkFinishedCallback(entry as PerformanceResourceTiming)
          }
        }
      }
    )

    this.ob.observe({ entryTypes: ['longtask', 'resource'] })
  }

  private startSchedulingTimerTasks() {
    // todo
    console.log('_incompleteRequestStarts', this.completeRequest)
    console.log('_networkRequests', this.networkRequests)
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

  private networkFinishedCallback (performanceEntry: PerformanceResourceTiming) {
    this.networkRequests.push({
      start: performanceEntry.fetchStart,
      end: performanceEntry.responseEnd
    })
  }

  private patchXMLHTTPRequest(
    beforeRequestCb: (id: number) => void,
    afterRequestCb: (id: number) => void
  ) {
    const send = XMLHttpRequest.prototype.send
    const requestId = this.uniqueId++

    console.log('xhr request', requestId)
    XMLHttpRequest.prototype.send = function (...args) {
      beforeRequestCb(requestId)
      this.addEventListener('onreadystate', () => {
        if (this.readyState === 4) afterRequestCb(requestId)
      })
      return send.apply(this, args)
    }
  }

  private patchFetch(
    beforeRequestCb: (id: number) => void,
    afterRequestCb: (id: number) => void
  ) {
    const originalFetch = fetch
    const requestId = this.uniqueId++

    window.fetch = (...args) => {
      return new Promise((resolve, reject) => {
        beforeRequestCb(requestId)
        console.log('fetch request', requestId)
        originalFetch(...args)
          .then((res) => {
            afterRequestCb(requestId)
            resolve(res)
          })
          .catch((err) => {
            afterRequestCb(requestId)
            reject(err)
          })
      })
    }
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

  private beforeInitRequestCb(id: number) {
    this.completeRequest.set(id, performance.now())
  }

  private afterInitRequestCb(id: number) {
    this.completeRequest.delete(id)
  }
}

export default (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const tti = new TTI()
    resolve(tti.getFirstConsistentlyInteractive())
  })
}
