import { PerformanceConfig, MetricsData } from './performance'

type MonitorPromise = Promise<MetricsData>

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

export interface PerformanceEntryPolyfill extends PerformanceEntry {
  readonly processingStart?: DOMHighResTimeStamp
  readonly responseEnd?: number
}

export type MonitorConfig = PerformanceConfig & {
    projectName: string
    version?: number | string
    log?: boolean
  }

export interface MonitorIntance extends Monitor {
  (config: MonitorConfig): Promise<MetricsData>
}

export interface LogOptions {
  metricName: string
  duration: number
}
