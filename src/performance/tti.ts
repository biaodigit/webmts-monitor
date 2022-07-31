import observe from './observe'

type Task = Array<{ start: number; end: number }>

class TTI {
  private ob?: PerformanceObserver
  private resolveFn: ((val: number) => void) | null
  private longtask: Task
  private networkRequests: Task
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

  private startSchedulingTimerTasks() {
    // todo
    console.log('_incompleteRequestStarts', this.completeRequest)
    console.log('_networkRequests', this.networkRequests)

    const longTaskEnd = this.longtask.length  ? this.longtask[this.longtask.length - 1].end : 0

    const lastKnownNetworkEnd = this.computedLastKnownNetWorks([...this.completeRequest.values()], this.networkRequests)

    this.recheduleTimer(Math.max(lastKnownNetworkEnd + 5000, longTaskEnd))
  }

  private registerListener() {
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

  private async registerPerformanceObserver() {
    const { entries } = await observe(['longtask', 'resource'])
    for (let entry of entries) {
      if (entry.entryType === 'longtask') {
        this.longTaskFinishedCallback(entry)
      } else if (entry.entryType === 'resource') {
        this.networkFinishedCallback(entry as PerformanceResourceTiming)
      }
    }
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
    // this.recheduleTimer(taskEndTime + 5000)
  }

  private networkFinishedCallback(performanceEntry: PerformanceResourceTiming) {
    this.networkRequests.push({
      start: performanceEntry.fetchStart,
      end: performanceEntry.responseEnd
    })
    // this.recheduleTimer(this.computedLastKnownNetWorks([...this.completeRequest.values()], this.networkRequests) + 5000)
  }

  private patchXMLHTTPRequest(
    beforeRequestCb: (id: number) => void,
    afterRequestCb: (id: number) => void
  ) {
    const send = XMLHttpRequest.prototype.send
    const requestId = this.uniqueId++

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

  private computedLastKnownNetWorks(completeRequestValues: Array<number>, networkRequests: Task): number {
    if(completeRequestValues.length > 2) return performance.now()
    let queue = []
    for (let request of networkRequests) {
      queue.push({
        time: request.start,
        type: 'requestStart'
      })
      queue.push({
        time: request.end,
        type: 'responseEnd'
      })
    }

    for (let value of completeRequestValues) {
      queue.push({
        time: value,
        type: 'requestStart'
      })
    }

    queue.sort((a, b) => a.time - b.time)

    let currentActive = completeRequestValues.length
    for (let i = queue.length - 1; i >= 0; i--) {
      const item = queue[i]
      switch (item.type) {
        case 'requestStart':
          currentActive--
          break;
        case 'requestEnd':
          currentActive++
          if (currentActive > 2) return item.time
          break;
      }
    }
    return 0
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
  const instance = new TTI()
  return Promise.resolve(instance.getFirstConsistentlyInteractive())
}
