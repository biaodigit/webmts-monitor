import { PerformanceConfig, MetricsData } from './performance'
import { SafetyConfig, SafetyReport } from './safety'

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
  SafetyConfig & {
    projectName: string
    version?: number | string
    log?: boolean
    perfTracker?(config: PerformanceReport): void
    safetyTracker?(config: SafetyReport): void
  }

export interface MonitorIntance extends Monitor {
  (config: MonitorConfig): Promise<MetricsData>
}

export interface PerformanceReport {
  projectName: string
  version?: string | number
  data?: MetricsData
}

export interface LogOptions {
  metricName: string
  duration: number
}
