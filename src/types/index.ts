export interface Monitor {
  getFCP(): number
  // getFID(): number
  getTTI(): number
}

export interface PerformanceInstance {
  performanceObserver(
    entryTypes: Array<string>
  ): Promise<{ observer: PerformanceObserver; entries: PerformanceEntryList }>
}

export interface PerformanceObserver {
  observer(): void
  disconnect(): void
}

export interface PerformanceEntryPolyfill extends PerformanceEntry {
  readonly processingStart?: DOMHighResTimeStamp
}

export interface MonitorConfig {
  projectName: string
  version?: number | string
  firstPaint?: boolean
  firstContentfulPaint?: boolean
  firstInputDelay?: boolean
  timeToInteractive?: boolean
  firstMeaningfulPaint?: boolean
  largestContentfulPaint?: boolean
  timeToFirstByte?: boolean
  navigationTiming?: boolean
  analyticsHooks?(config: AnalyticsHooksConfig): void
}

export interface MonitorIntance extends Monitor {
  (config: MonitorConfig): Promise<MetricsRes>
}

export interface PerfObserves {
  [metricName: string]: any
}

interface AnalyticsHooksConfig {
  metricName: string
  duration: number | null
  data: Metrics
}

export interface LogOptions {
  metricName: string
  duration: number
}


export type Metrics = 'first-paint' | 'first-contentful-paint' | 'mousedown' | 'time-to-interactive'

export type MetricsRes = {[key in Metrics]?:number}