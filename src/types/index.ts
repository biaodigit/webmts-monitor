import { PerformanceConfig } from './performance'
import { SecurityConfig } from './security'

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

export interface MonitorPromise extends Promise<MetricsData> {}

export interface PerformanceEntryPolyfill extends PerformanceEntry {
  readonly processingStart?: DOMHighResTimeStamp
  readonly responseEnd?: number
}

export type MonitorConfig = PerformanceConfig &
  SecurityConfig & {
    projectName: string
    version?: number | string
    log?: boolean
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
