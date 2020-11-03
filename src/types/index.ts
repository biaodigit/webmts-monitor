export interface Monitor {
  getFCP(): MonitorPromise

  getFID(): MonitorPromise

  getTTI(): MonitorPromise

  getLCP(): MonitorPromise

  getTTFB(): MonitorPromise

  getNavTiming(): MonitorPromise
}

export interface MonitorPromise extends Promise<MetricsData> {}

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
  markDom?:boolean
  trackerHooks?(config: TrackerConfig): void
}

export interface MonitorIntance extends Monitor {
  (config: MonitorConfig): Promise<MetricsData>
}

export interface TrackerConfig {
  metricName?: string
  duration?: number
  data?: MetricsData
}

export interface LogOptions {
  metricName: string
  duration: number
}

export type Metrics =
  | 'first-paint'
  | 'first-contentful-paint'
  | 'mousedown'
  | 'time-to-interactive'

export type MetricsData = { [key in Metrics]?: number }
