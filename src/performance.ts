// import { PerformanceObserver } from "perf_hooks"

export interface PerformanceEntryList {
    getEntries: any;
    getEntriesByName: any;
    getEntriesByType: any;
}

interface PerformanceObserver {
    observer: () => void;
    disconnect: () => void;
}

interface NavigationOptions {
    domainLookupEnd: number
    domainLookupStart: number
    domComplete: number
}


class Performance {
    private observer: any
    private navEntry: any = performance.getEntriesByType('navigation')[0]
    private defaultTiming: { [key: string]: any } = Object.create(null)
    private navigationTiming: { [key: string]: any } = Object.create(null)

    static supportedPerformance(): boolean {
        return (
            window.performance &&
            !!performance.getEntriesByType &&
            !!performance.mark
        )
    }

    static supportedPerformanceObserver(): boolean {
        return (window as any).chrome && 'PerformanceObserver' in window
    }

    public getNavigationTiming(pageEndLoad) {
        if (!this.navEntry) return this.navigationTiming

        if (pageEndLoad) return {
            pageLoadTime: this.navEntry.loadEventStart - this.navEntry.fetchStart
        }

        this.navigationTiming = Object.assign(this.navigationTiming, {
            dnsLookupTime: this.navEntry.domainLookupEnd - this.navEntry.domainLookupStart, // dns解析时间
            tcpConnectTime: this.navEntry.connectEnd - this.navEntry.connectStart,          // tcp连接时间
            domComplete: this.navEntry.domComplete,                                         // dom树解析时间
            resourceLoadTime: this.navEntry.loadEventStart - this.navEntry.domContentLoadedEventEnd  // 资源加载时间
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
        cb: (entries: PerformanceEntry[]) => void
    ): PerformanceObserver {
        this.observer = new PerformanceObserver((entryList: PerformanceEntryList) => {
            const entries = entryList.getEntries()
            cb(entries)
        })
        this.observer.observe({ type: entryType, buffered: true })
        return this.observer
    }
}

export default Performance
