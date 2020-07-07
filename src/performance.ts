export interface PerformanceEntryList {
    getEntries: any;
    getEntriesByName: any;
    getEntriesByType: any;
}

interface PerformanceObserver {
    observer: () => void;
    disconnect: () => void;
}


class Performance {
    private observer: any
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

    public performanceObserver(
        entryType: string,
        cb: (entries: any[]) => void
    ): PerformanceObserver {
        this.observer = new PerformanceObserver((entryList: PerformanceEntryList) => {
            const entries = entryList.getEntries()
            cb(entries)
        })
        this.observer.observe({ type: entryType, buffered: true })
        return this.observer
    }

    // private performanceObserverCb(
    //     cb: (entries: PerformanceEntry[]) => void,
    //     entryList: PerformanceEntryList
    // ): void {
    //     const entries = entryList.getEntries()
    //     cb(entries)
    // }
}

export default Performance
