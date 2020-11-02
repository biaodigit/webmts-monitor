import { TrackerConfig, MetricsData } from '../types'

const formatNum2Str = (value: number): string => `${parseInt(value.toFixed(2))}ms`

export const trackerMetrics = (
  config: TrackerConfig,
  trackerCb: (config: TrackerConfig) => void
) => {
  const { data = {} } = config
  if (trackerCb) {
    trackerCb({ data })
  }
}

export const logMetrics = (data:MetricsData) => {
  for (let key in data) {
     
   }
}

export const log = (name: string, value: number) => {
   
}