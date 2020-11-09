import { TrackerConfig, MetricsData, Metrics } from '../types'

export const trackerMetrics = (
  config: TrackerConfig,
  trackerCb: (config: TrackerConfig) => void
) => {
  const { projectName, version = 0, data = {} } = config
  if (trackerCb) {
    trackerCb({ projectName, version, data })
  }
}

export const logMetrics = (
  config: TrackerConfig,
  cb: (config: TrackerConfig) => void
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
