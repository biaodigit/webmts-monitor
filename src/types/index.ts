export interface Monitor {
  config: MonitorConfig
  getFCP: () => void
}

export interface PerformanceObserver {
  observer: () => void;
  disconnect: () => void;
}

export interface PerformanceEntryPolyfill extends PerformanceEntry {
  readonly processingStart?: DOMHighResTimeStamp;
}

export interface MonitorConfig {
  projectName: string
  version?: number | string
  firstPaint?: boolean
  firstContentfulPaint?: boolean
  firstInputDelay?: boolean
  timeToInteractive?: boolean,
  firstMeaningfulPaint?: boolean
  largestContentfulPaint?: boolean
  longTask?: boolean
  navigationTiming?: boolean
  analyticsHooks?: (config: AnalyticsHooksConfig) => void
}

export interface PerfObserves {
  [metricName: string]: any
}

export interface Metrics {
  [key: string]: number
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
