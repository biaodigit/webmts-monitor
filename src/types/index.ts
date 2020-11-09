export interface Monitor {
  integratedConfig(config: MonitorConfig): MonitorPromise

  getFCP(): MonitorPromise

  getFID(): MonitorPromise

  getTTI(): MonitorPromise

  getFMP(): MonitorPromise

  getLCP(): MonitorPromise

  getTTFB(): MonitorPromise

  getNavTiming(): MonitorPromise
}

export interface MonitorPromise extends Promise<MetricsData> { }

export interface PerformanceEntryPolyfill extends PerformanceEntry {
  readonly processingStart?: DOMHighResTimeStamp
  readonly responseEnd?: number
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
  log?:boolean
  trackerHooks?(config: TrackerConfig): void
}

export interface MonitorIntance extends Monitor {
  (config: MonitorConfig): Promise<MetricsData>
}

export interface TrackerConfig {
  projectName: string
  version?: string | number
  data?: MetricsData
}

export interface LogOptions {
  metricName: string
  duration: number
}

export type Metrics =
  | 'firstPaint'
  | 'firstContentFulPaint'
  | 'firstInputDelay'
  | 'firstMeaningFulPaint'
  | 'timeToInteractive'
  | 'largestContentFulPaint'
  | 'timeToFirstByte'
  | 'tcpConnectTime'
  | 'dnsLookupTime'
  | 'whiteScreenTime'

export type MetricsData = { [key in Metrics]?: number }
