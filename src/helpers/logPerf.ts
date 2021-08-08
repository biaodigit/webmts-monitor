import { PerformanceReport } from '../types/performance'
import { MetricsData, Metrics } from '../types/performance'

export const trackerMetrics = (
  config: PerformanceReport,
  trackerCb: (config: PerformanceReport) => void,
) => {
  const { projectName, version = 0, data = {} } = config
  if (trackerCb) {
    trackerCb({ projectName, version, data })
  }
}

export const logMetrics = (
  config: PerformanceReport,
  cb: (config: PerformanceReport) => void,
) => {
  const { data } = config
  trackerMetrics(config, cb)
  log(data!)
}

export const log = (data: MetricsData) => {
  for (let key in data) {
    console.log(`monitor ${key}: ${data[key as Metrics]}ms`)
  }
}
