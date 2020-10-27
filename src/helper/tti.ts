interface TTIConfig {
  entries: PerformanceEntryList
}

export class TTI {
  private resolveFn: ((val: number) => void) | null
  private longtask: Array<{ start: number; end: number }>
  private navEntry: PerformanceTiming = performance.timing
  constructor(config: TTIConfig) {
    this.resolveFn = null
    this.longtask = config.entries.map((entry) => ({
      start: entry.startTime,
      end: entry.startTime + entry.duration
    }))
  }

  public getFirstConsistentlyInteractive(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.resolveFn = resolve

      if (document.readyState === 'complete') {
        this.checkTTI()
      } else {
        window.addEventListener('load', () => {
          this.checkTTI()
        })
      }
    })
  }

  private checkTTI() {
    const navigationStart = performance.timing.navigationStart
    let minValue = this.getMinValue()
    let searchStart = performance.timing.domContentLoadedEventEnd - navigationStart
    console.log('search ', searchStart)
    console.log('minval',minValue)
    let fciVal: number = this.computedFirstConsistentInteractive(
      searchStart,
      minValue
    )
    console.log('ficVal', fciVal)
    if (fciVal) {
      this.resolveFn!(fciVal)
    }
  }

  private computedFirstConsistentInteractive(
    searchStart: number,
    minValue: number
  ): number {
    let fciVal =
      this.longtask.length === 0
        ? searchStart
        : this.longtask[this.longtask.length - 1].end

    return Math.max(minValue, fciVal)
  }

  private getMinValue(): number {
    // if (performance?.timing?.domContentLoadedEventEnd) {
    const { domContentLoadedEventEnd, navigationStart } = this.navEntry
    return domContentLoadedEventEnd - navigationStart
    // }
    // return null
  }
}

export default (entries: PerformanceEntryList):Promise<number> => {
  return new Promise((resolve, reject) => {
    const tti = new TTI({ entries })
    resolve(tti.getFirstConsistentlyInteractive())
  })
}
