import { TrackerConfig } from '../types'

export const trackerMetrics = (
  config: TrackerConfig,
  trackerCb: (config: TrackerConfig) => void
) => {
  const { metricName = '', duration = 0, data = {} } = config
  if (trackerCb) {
    trackerCb({ metricName, duration, data })
  }
}
