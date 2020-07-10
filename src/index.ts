import Performance, {
    PerformanceEntryList
} from './performance'
import IdleQueue from './idle-queue'

const GET_PAINT = 'paint'
const GET_RESOURCE = 'resource'
const GET_FIRSTINPUT = 'first-input'

export interface MonitorOptions {
    firstPaint?: boolean
    firstContentfulPaint?: boolean
    firstInputDelay?: boolean
    timeToInteractive?: boolean,
    navigationTiming?: boolean
    analyticsHooks?: (options: AnalyticsHooksOptions) => void
}

interface MonitorConfig extends MonitorOptions { }

interface PerfObservers {
    [metricName: string]: any
}

interface Metrics {
    [key: string]: number
}

export interface AnalyticsHooksOptions {
    metricName: string
    duration: number | null
    data: Metrics
}

interface LogOptions {
    metricName: string
    duration: number
}

class Monitor {
    private perf: Performance
    private idleQueue: IdleQueue
    private config: MonitorConfig = {
        firstPaint: false,
        firstContentfulPaint: false,
        firstInputDelay: false,
        timeToInteractive: false,
        navigationTiming: false
    }
    private perfObservers: PerfObservers = {}
    private collectMetrics: { [key: string]: number } = Object.create(null)
    constructor(options: MonitorOptions) {
        if (!Performance.supportPerformance) throw Error("browser doesn't support performance api")
        this.perf = new Performance()
        this.config = Object.assign({}, this.config, options)

        if (Performance.supportPerformanceObserver()) this.initPerformanceObserver()

        this.collectMetrics = Object.assign(this.collectMetrics, this.perf.getDefaultTiming())

        this.idleQueue = new IdleQueue()
        if (this.config.navigationTiming) this.logNavigationTiming()

        this.pushTask(() => {
            this.logMetricsSync(this.collectMetrics)
        })
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
            if (this.config.hasOwnProperty(metricName) && entry.name === entryName) {
                this.pushTask(() => {
                    this.logMetrics({ metricName, duration: entry[valueLog] })
                })
            }

            if (entry.name === 'first-contentful-paint' &&
                this.perfObservers.firstContentfulPaint
            ) {
                this.perfObservers.firstContentfulPaint.disconnect()
            }
        })
    }

    private log(options: LogOptions) {
        const { metricName, duration } = options
        console.log(`${metricName}: ${duration}ms`)
    }

    private logNavigationTiming() {
        this.pushTask(() => {
            this.logMetricsSync(this.perf.getNavigationTiming(false))
        })

        window.addEventListener('load', () => {
            this.pushTask(() => {
                const data = this.perf.getNavigationTiming(true)
                this.logMetricsSync(data)
            })
        })
    }

    private logMetricsSync(data: Metrics) {
        for (const metricName in data) {
            const formatDuration = parseFloat(data[metricName].toFixed(2))
            this.log({ metricName, duration: formatDuration })
        }
        this.sendMetrics({ data })
    }

    private logMetrics(options: {
        metricName: string
        duration: number
    }) {
        const { metricName, duration } = options
        const formatDuration = parseFloat(duration.toFixed(2))
        this.log({ metricName, duration: formatDuration })
        this.sendMetrics({ metricName, duration: formatDuration })
    }

    private sendMetrics(options: {
        metricName?: string
        duration?: number
        data?: Metrics
    }) {
        const { metricName = '', duration = null, data = {} } = options
        if (this.config.analyticsHooks) {
            this.config.analyticsHooks({ metricName, duration, data })
        }
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

export default Monitor