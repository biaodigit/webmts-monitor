import observe from './observe'
import ttiInstance from '../helpers/tti'
import { PerformanceEntryPolyfill } from '../types'

const GET_PAINT = 'paint'
const GET_FIRSTINPUT = 'first-input'

export default class<T> {
  public async getFirstPaint(): Promise<T> {
    const { entries, ob } = await observe([GET_PAINT])
    let result = Object.create(null)
    entries.forEach((entry: PerformanceEntry) => {
      result[entry.name] = entry.startTime
    })
    ob.disconnect()
    return result as T
  }

  public async getFirstInputDelay(): Promise<T> {
    const { entries, ob } = await observe([GET_FIRSTINPUT])
    let result = Object.create(null)
    entries.forEach((entry: PerformanceEntryPolyfill) => {
      result[entry.name] = entry.processingStart! - entry.startTime
    })
    ob.disconnect()
    return result as T
  }

  public async getTimeToInteractive(): Promise<T> {
    let result = Object.create(null)
    let value = await ttiInstance()
    result['time-to-interactive'] = value
    return result as T
  }
}
