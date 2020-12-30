import { supportMutationObserver, calculateAreaPrecent } from '../helpers/utils'
import { PerformanceEntryPolyfill } from '../types'

interface TagElement {
  element: Element
  weightScore: number
  childList: Array<TagElement>
  elementList: Array<Els>
}

interface Els {
  weight: number
  weightScore: number
  element: Element
}

const tagWeightMap = new Map([
  ['VIDEO', 5],
  ['CANVAS', 5],
  ['IMG', 2],
  ['SVG', 2]
])

const IGNORE_TAG_LIST = ['SCRIPT', 'STYLE', 'META', 'HEAD', 'LINK']
const FMP_TAG = 'fmp_tag'

class FMP {
  private observe?: MutationObserver
  private markCount: number = 0
  private resolveFn: ((val: number) => void) | null
  private statusObserve: Array<{ time: number }> = []
  private entries: { [key: string]: any } = {}
  constructor() {
    this.resolveFn = null
    // 是否有标记元素
    if (this.checkMarkStatus(document.body)) {
      this.activeMark()
    } else {
      this.passiveMark()
    }
  }

  public getFirstMeaningFulPaint(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.resolveFn = resolve

      if (document.readyState === 'complete') {
        this.getCoreElement()
      } else {
        window.addEventListener('load', () => {
          this.getCoreElement()
        })
      }
    })
  }

  private checkMarkStatus(element: Element): boolean {
    if (element.getAttribute(FMP_TAG)) return true
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (this.checkMarkStatus(child)) return true
    }
    return false
  }

  private getCoreElement() {
    if (!supportMutationObserver())
      throw new Error("browser doesn't support mutationObserver api")

    this.observe!.disconnect()

    performance.getEntries().forEach((entry: PerformanceEntryPolyfill) => {
      this.entries[entry.name] = entry.responseEnd
    })
    const tagEle = this.getTreeWeight(document.body)
    let maxWeightEle: TagElement | null = null

    tagEle!.childList.forEach((child) => {
      if (maxWeightEle && maxWeightEle.weightScore) {
        if (child.weightScore > maxWeightEle.weightScore) {
          maxWeightEle = child
        }
      } else {
        maxWeightEle = child
      }
    })

    if (!maxWeightEle) {
      this.resolveFn!(0)
      return
    }

    let els = this.filterEls(maxWeightEle!.elementList)

    this.resolveFn!(this.getElementTiming(els))
  }

  private activeMark() { }

  private passiveMark() {
    this.getFirstSnapShot()
    this.observe = new MutationObserver(() => {
      let time = performance.now()
      this.markCount++
      this.statusObserve.push({ time })
      this.setTag(document.body, this.markCount)
    })

    this.observe.observe(document, {
      childList: true,
      subtree: true
    })
  }

  private getFirstSnapShot() {
    let time = performance.now()
    this.setTag(document.body, this.markCount)
    this.statusObserve.push({ time })
  }

  private getTreeWeight(element: Element): TagElement | null {
    if (!element) return null
    const list: Array<TagElement> = [],
      children = element.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (!child.getAttribute(FMP_TAG)) continue

      const elementList = this.getTreeWeight(child)
      if (elementList!.weightScore) list.push(elementList!)
    }
    return this.calculateScore(element, list)
  }

  private setTag(element: Element, count: number) {
    const tagName = element.tagName
    if (IGNORE_TAG_LIST.indexOf(tagName) > -1) return
    const children = element.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (!child.getAttribute(FMP_TAG)) {
        if (!calculateAreaPrecent(child)) continue
        child.setAttribute(FMP_TAG, `${count}`)
      }
      this.setTag(child, count)
    }
  }

  private getElementTiming(els: Array<Els>): number {
    let result = 0
    els.forEach((el) => {
      let time = 0
      if (el.weight === 1) {
        let index = parseInt(el.element.getAttribute(FMP_TAG)!, 10)
        time = this.statusObserve[index].time
      } else if (el.weight === 2) {
        if (el.element.tagName === 'IMG') {
          time = this.entries[(el.element as HTMLImageElement).src]
        } else if (el.element.tagName === 'SVG') {
          let index = parseInt(el.element.getAttribute(FMP_TAG)!, 10)
          time = this.statusObserve[index].time

        }
      } else if (el.weight === 5) {
        if (el.element.tagName === 'VIDEO') {
          time = this.entries[(el.element as HTMLVideoElement).src]
        } else if (el.element.tagName === 'CANVAS') {
          let index = parseInt(el.element.getAttribute(FMP_TAG)!, 10)
          time = this.statusObserve[index].time
        }
      }
      result = Math.max(result, time)
    })
    return result
  }

  private filterEls(els: Array<Els>) {
    if (els.length === 1) return els

    let sum = 0
    els.forEach((el) => {
      sum += el.weightScore
    })

    let avg = sum / els.length
    return els.filter((el) => el.weightScore > avg)
  }

  private calculateScore(
    element: Element,
    list: Array<TagElement>
  ): TagElement {
    const { width, height } = element.getBoundingClientRect()

    let weight = tagWeightMap.get(element.tagName) || 1,
      childScore = 0

    // 子节点总得分
    list.forEach((el) => {
      childScore += el.weightScore
    })

    // 节点得分 (宽 * 高 * 权重 * 视图面积比例)
    let weightScore = calculateAreaPrecent(element) ? width * height * weight * calculateAreaPrecent(element) : 0

    let elementList = [{ element, weight, weightScore }]

    // 如果子节点总分大于节点得分，核心节点在子节点中
    if (
      weightScore < childScore ||
      weightScore === 0
    ) {
      weightScore = childScore
      elementList = []
      list.forEach((el) => {
        elementList = elementList.concat(el.elementList)
      })
    }

    element.setAttribute('fmp_weight', `${weightScore}`)
    return {
      weightScore,
      elementList,
      childList: list,
      element
    }
  }
}

export default async (): Promise<number> => {
  const instance = new FMP()
  return Promise.resolve(instance.getFirstMeaningFulPaint())
}
