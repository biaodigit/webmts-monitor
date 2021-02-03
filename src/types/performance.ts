export interface PerformanceConfig {
  firstPaint?: boolean
  firstContentfulPaint?: boolean
  firstInputDelay?: boolean
  timeToInteractive?: boolean
  firstMeaningfulPaint?: boolean
  largestContentfulPaint?: boolean
  timeToFirstByte?: boolean
  navigationTiming?: boolean
  perfTracker?(config: PerformanceReport): void
}

export interface PerformanceReport {
  projectName: string
  version?: string | number
  data?: MetricsData
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
