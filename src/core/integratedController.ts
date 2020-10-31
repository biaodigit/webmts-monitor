import observe from './observe'
import ttiInstance from '../helpers/tti'
import { PerformanceEntryPolyfill, MetricsData } from '../types'

interface PerformanceNavigationEntry extends PerformanceEntry {
  loadEventStart: number
  fetchStart: number
  domainLookupEnd: number
  domainLookupStart: number
  connectEnd: number
  connectStart: number
  responseStart: number
  responseEnd: number
  requestStart: number
}

const GET_PAINT = 'paint'
const GET_FIRSTINPUT = 'first-input'

export default class <T> {
  private navEntry = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationEntry
  public async getFirstPaint(): Promise<T> {
    const { entries, ob } = await observe([GET_PAINT])
    let result = Object.create(null)
    entries.forEach((entry: PerformanceEntry) => {
      result[entry.name] = entry.startTime
    })
    ob.disconnect()
    return result
  }

  public async getFirstInputDelay(): Promise<T> {
    const { entries, ob } = await observe([GET_FIRSTINPUT])
    let result = Object.create(null)
    entries.forEach((entry: PerformanceEntryPolyfill) => {
      result[entry.name] = entry.processingStart! - entry.startTime
    })
    ob.disconnect()
    return result
  }

  public async getTimeToInteractive(): Promise<T> {
    let result = Object.create(null)
    let value = await ttiInstance()
    result['time-to-interactive'] = value
    return result
  }

  public getTimeToFirstByte(): MetricsData {
    let result = Object.create(null)
    let value = this.navEntry.responseStart - this.navEntry.requestStart
    result['time-to-first-byte'] = value
    return result
  }

  public getNavigationTiming(): T {
    let result = Object.create(null)
    result = Object.assign(result, {
      dnsLookupTime: this.navEntry.domainLookupEnd - this.navEntry.domainLookupStart, // dns解析时间
      tcpConnectTime: this.navEntry.connectEnd - this.navEntry.connectStart, // tcp连接时间
      whiteScreenTime: this.navEntry.responseEnd - this.navEntry.fetchStart // 白屏时间
    })
    return result
  }
}
