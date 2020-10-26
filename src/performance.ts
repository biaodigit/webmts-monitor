interface PerformanceNavigationEntry extends PerformanceEntry{
  loadEventStart: number
  fetchStart: number
  domainLookupEnd: number
  domainLookupStart: number
  connectEnd: number
  connectStart:number
  responseStart: number
  responseEnd: number
  requestStart:number
}
class Performance {
    private observer?: PerformanceObserver
    private navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationEntry
    private defaultTiming: { [key: string]: any } = Object.create(null)
    private navigationTiming: { [key: string]: any } = Object.create(null)

    static supportPerformance(): boolean {
        return (
            window.performance &&
            !!performance.getEntriesByType &&
            !!performance.mark
        )
    }

    static supportPerformanceObserver(): boolean {
        return (window as any).chrome && 'PerformanceObserver' in window
    }

    public getNavigationTiming(pageEndLoad:boolean) {
        if (!this.navEntry) return this.navigationTiming

        if (pageEndLoad) return {
            pageLoadTime: this.navEntry.loadEventStart - this.navEntry.fetchStart
        }

        this.navigationTiming = Object.assign(this.navigationTiming, {
            dnsLookupTime: this.navEntry.domainLookupEnd - this.navEntry.domainLookupStart, // dns解析时间
            tcpConnectTime: this.navEntry.connectEnd - this.navEntry.connectStart          // tcp连接时间
        })

        return this.navigationTiming
    }

    public getDefaultTiming() {
        if (!this.navEntry) return this.defaultTiming

        this.defaultTiming = Object.assign(this.defaultTiming, {
            timeToFirstByte: this.navEntry.responseStart - this.navEntry.requestStart,    // 首字节时间 
            whiteScreenTime: this.navEntry.responseEnd - this.navEntry.fetchStart       // 白屏时间
        })

        return this.defaultTiming
    }

    public performanceObserver(
        entryType: string,
        cb: (entries: PerformanceEntryList) => void
    ): PerformanceObserver {
        this.observer = new PerformanceObserver((entryList: PerformanceObserverEntryList) => {
            const entries = entryList.getEntries() 
            cb(entries)
        })
        this.observer.observe({ type: entryType, buffered: true })
        return this.observer
    }
}

export default Performance
