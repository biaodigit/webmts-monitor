import { TrackerConfig, MetricsData } from '../types'

export const trackerMetrics = (
  config: TrackerConfig,
  trackerCb: (config: TrackerConfig) => void
) => {
  const { data = {} } = config
  if (trackerCb) {
    trackerCb({ data })
  }
}

export const logMetrics = () => {

}

export const log = () => {

}