export interface PerformanceConfig {
  firstPaint?: boolean
  firstContentfulPaint?: boolean
  firstInputDelay?: boolean
  timeToInteractive?: boolean
  firstMeaningfulPaint?: boolean
  largestContentfulPaint?: boolean
  timeToFirstByte?: boolean
  navigationTiming?: boolean
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
