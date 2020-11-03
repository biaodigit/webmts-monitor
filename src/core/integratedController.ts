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

const GET_FCP = 'paint'
const GET_FID = 'first-input'
const GET_LCP = 'largest-contentful-paint'

const entryNameMap = new Map([
  ['first-paint', 'firstPaint'],
  ['first-contentful-paint', 'firstContentFulPaint'],
  ['mousedown', 'firstInputDelay'],
  ['largest-contentful-paint', 'largestContentFulPaint']
])

export default class<T> {
  private navEntry = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationEntry
  public async getFirstPaint(): Promise<T> {
    return this.perfTypeWithData(GET_FCP)
  }

  public async getFirstInputDelay(): Promise<T> {
    const { entries, ob } = await observe([GET_FID])
    let result = Object.create(null)
    entries.forEach((entry: PerformanceEntryPolyfill) => {
      const entryName = entryNameMap.get(entry.name)
      if (entryName)
        result[entryName] = entry.processingStart! - entry.startTime
    })
    ob.disconnect()
    return result
  }

  public getFirstMeaningfulPaint(): T {
    let result = Object.create(null)
    return result
  }

  public async getTimeToInteractive(): Promise<T> {
    let result = Object.create(null)
    let value = await ttiInstance()
    result['timeToInteractive'] = value
    return result
  }

  public async getLargestContentFulPaint(): Promise<T> {
    return this.perfTypeWithData(GET_LCP)
  }

  public getTimeToFirstByte(): MetricsData {
    let result = Object.create(null)
    let value = this.navEntry.responseStart - this.navEntry.requestStart
    result['timeToFirstByte'] = value
    return result
  }

  public getNavigationTiming(): T {
    let result = Object.create(null)
    result = Object.assign(result, {
      dnsLookupTime:
        this.navEntry.domainLookupEnd - this.navEntry.domainLookupStart, // dns解析时间
      tcpConnectTime: this.navEntry.connectEnd - this.navEntry.connectStart, // tcp连接时间
      whiteScreenTime: this.navEntry.responseEnd - this.navEntry.fetchStart // 白屏时间
    })
    return result
  }

  private async perfTypeWithData(type: string): Promise<T> {
    const { entries, ob } = await observe([type])
    let result = Object.create(null)
    entries.forEach((entry: PerformanceEntry) => {
      const entryName = entryNameMap.get(entry.name)
      if (entryName) result[entryName] = entry.startTime
    })
    ob.disconnect()
    return result
  }
}
