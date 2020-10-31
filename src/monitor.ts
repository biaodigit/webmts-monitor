import Monitor from './core/Monitor'
import { extend } from './helpers/utils'
import { MonitorIntance } from './types'

const createInstance = (): MonitorIntance => {
  const context = new Monitor()
  const instance = Monitor.prototype.integratedConfig.bind(context)

  extend(instance, context)
  return instance as MonitorIntance
}

const monitor = createInstance()

export default monitor

// import Performance from './core/performance'
// import IdleQueue from './idle-queue'
// import ttiInstance from './utils/tti'
// import {
//   MonitorConfig,
//   PerfObserves,
//   PerformanceEntryPolyfill,
//   LogOptions,
//   Metrics
// } from './types'

// const GET_PAINT = 'paint'
// const GET_RESOURCE = 'resource'
// const GET_FIRSTINPUT = 'first-input'
// const GET_LONGTASK = 'longtask'

// class Monitor {
//   private perf: Performance
//   private idleQueue: IdleQueue
//   private config: MonitorConfig = {
//     projectName: '',
//     version: 0,
//     firstPaint: false,
//     firstContentfulPaint: false,
//     firstInputDelay: false,
//     firstMeaningfulPaint: false,
//     largestContentfulPaint: false,
//     timeToInteractive: false,
//     timeToFirstByte: false,
//     navigationTiming: false
//   }
//   private perfObserves: PerfObserves = {}
//   private collectMetrics: { [key: string]: number } = Object.create(null)
//   constructor(config: MonitorConfig) {
//     // if (!Performance.supportPerformance)
//     //   throw Error("browser doesn't support performance api")
//     this.perf = new Performance()
//     this.config = Object.assign({}, this.config, config)

//     // if (Performance.supportPerformanceObserver())
//     this.initPerformanceObserve()

//     this.collectMetrics = Object.assign(
//       this.collectMetrics,
//       this.perf.getDefaultTiming()
//     )

//     this.idleQueue = new IdleQueue()
//     if (this.config.navigationTiming) this.logNavigationTiming()

//     this.pushTask(() => {
//       this.logMetricsSync(this.collectMetrics)
//     })
//   }



//   private log(options: LogOptions) {
//     const { metricName, duration } = options
//     console.log(`${metricName}: ${duration}ms`)
//   }

//   private logNavigationTiming() {
//     this.pushTask(() => {
//       this.logMetricsSync(this.perf.getNavigationTiming(false))
//     })

//     window.addEventListener('load', () => {
//       this.pushTask(() => {
//         const data = this.perf.getNavigationTiming(true)
//         this.logMetricsSync(data)
//       })
//     })
//   }

//   private logMetricsSync(data: Metrics) {
//     for (const metricName in data) {
//       const formatDuration = parseFloat(data[metricName].toFixed(2))
//       this.log({ metricName, duration: formatDuration })
//     }
//     this.sendMetrics({ data })
//   }

//   private logMetrics(options: { metricName: string; duration: number }) {
//     const { metricName, duration } = options
//     const formatDuration = parseFloat(duration.toFixed(2))
//     this.log({ metricName, duration: formatDuration })
//     this.sendMetrics({ metricName, duration: formatDuration })
//   }

//   private logWarn(message: string) {
//     console.warn(message)
//   }

//   private sendMetrics(options: {
//     metricName?: string
//     duration?: number
//     data?: Metrics
//   }) {
//     const { metricName = '', duration = null, data = {} } = options
//     if (this.config.trackerHooks) {
//       this.config.trackerHooks({ metricName, duration, data })
//     }
//   }
// }

// export default Monitor