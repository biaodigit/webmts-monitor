import Performance, {
    PerformanceEntryList
} from './performance'

const GET_PAINT = 'paint'
const GET_RESOURCE = 'resource'
const GET_FIRSTINPUT = 'first-input'

interface MonitorOptions {
    firstPaint?: boolean
    firstContentfulPaint?: boolean
    firstInputDelay?: boolean
    timeToInteractive?: boolean,
    analyticsHooks?: (options: AnalyticsHooksOptions) => void
}

interface MonitorConfig extends MonitorOptions {

}

interface PerfObservers {
    [metricName: string]: any
}

interface AnalyticsHooksOptions {
    metricName: string
    duration: number
}

class Monitor {
    private perf: Performance
    private config: MonitorConfig
    private perfObservers: PerfObservers = {}
    constructor(options: MonitorOptions) {
        if (!Performance.supportedPerformance) return
        this.perf = new Performance()
        this.config = Object.assign({}, this.config, options)

        if (Performance.supportedPerformanceObserver) this.initPerformanceObserver()
    }

    private initPerformanceObserver(): void {
        if (this.config.firstPaint || this.config.firstContentfulPaint) {
            this.initFirstPaint()
        }

        if (this.config.firstInputDelay) {
            // todo
            // this.initFirstInputDelay()
        }

        if (this.config.timeToInteractive) {
            // todo
        }
    }

    private initFirstPaint() {
        try {
            this.perfObservers.firstContentfulPaint = this.perf.performanceObserver(
                GET_PAINT, this.digestFirstPaintEntries.bind(this)
            )
        } catch (err) {
            // todo
            // console.error('initFirstPaint failed')
        }
    }

    private digestFirstPaintEntries(entries: PerformanceEntry[]) {
        this.perfObserverCb({
            entries,
            entryName: 'first-paint',
            metricName: 'firstPaint',
            metricLog: 'First Paint',
            valueLog: 'startTime'
        })
        this.perfObserverCb({
            entries,
            entryName: 'first-contentful-paint',
            metricName: 'firstContentfulPaint',
            metricLog: 'First Contentful Paint',
            valueLog: 'startTime'
        })
    }

    private perfObserverCb(options: {
        entries: PerformanceEntry[],
        entryName: string,
        metricName: string,
        metricLog: string,
        valueLog: 'duration' | 'startTime'
    }) {
        const { entries, entryName, metricName, metricLog, valueLog } = options
        entries.forEach((entry) => {
            if (this.config[metricName] && entry.name === entryName) {
                this.logMetrics({ metricName, metricLog, duration: entry[valueLog] })
            }

            if (entry.name === 'first-contentful-paint' &&
                this.perfObservers.firstContentfulPaint
            ) {
                this.perfObservers.firstContentfulPaint.disconnect()
            }
        })
    }

    private logMetrics(options: {
        metricName: string,
        metricLog: string,
        duration: number
    }) {
        const { metricName, metricLog, duration } = options
        this.sendMetrics({ metricName, duration })
    }

    private sendMetrics(options: {
        metricName: string,
        duration: number
    }) {
        const { metricName, duration } = options
        if (this.config.analyticsHooks) {
            this.config.analyticsHooks({ metricName, duration })
        }
    }
}

export default Monitor