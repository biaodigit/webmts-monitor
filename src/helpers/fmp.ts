const tagWeightMap = new Map([
  ['img', 5],
  ['video', 5],
  ['svg', 2],
  ['canvas', 5]
])

const IGNORELIST = ['']

class FMP {
  private observe?: MutationObserver
  private markCount: number = 0
  private resolveFn: ((val: number) => void) | null
  constructor() {
    this.resolveFn = null

    this.register()
  }

  public getFirstMeaningFulPaint(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.resolveFn = resolve

      if (document.readyState === 'complete') {
      } else {
        window.addEventListener('load', () => {})
      }
    })
  }

  private register() {
    this.observe = new MutationObserver((mutation) => {
      this.markCount++
    })

    this.observe.observe(document, {
      childList: true,
      subtree: true
    })
  }

  private setTag(node: HTMLElement, count: number) {
    const tagName = node.tagName
    if (IGNORELIST.indexOf(tagName) > -1) return
    const children = node.children
    for (let i = children.length - 1; i >= 0; i++) {}
  }

  private calculateScore() {}
}

export default (): Promise<number> => {
  const fmp = new FMP()
  return Promise.resolve(fmp.getFirstMeaningFulPaint())
}
