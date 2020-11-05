import { supportMutationObserver, inViewPort } from '../helpers/utils'
import { PerformanceEntryPolyfill } from '../types'

interface TagElement {
  element: Element
  weightScore: number
  childList: Array<TagElement>
  elementList: Array<Els>
}

interface Els {
  weight: number;
  weightScore: number;
  element: Element
}

const tagWeightMap = new Map([
  ['VIDEO', 5],
  ['CANVAS', 5],
  ['IMG', 2],
  ['SVG', 2]
])

const IGNORE_TAG_LIST = ['SCRIPT', 'STYLE', 'META', 'HEAD', 'LINK']

class FMP {
  private observe?: MutationObserver
  private markCount: number = 0
  private resolveFn: ((val: number) => void) | null
  private statusObserve: Array<{ time: number }> = []
  private entries: { [key: string]: any } = {}
  constructor() {
    this.resolveFn = null
    this.register()
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

  private getCoreElement() {
    if (!supportMutationObserver)
      throw new Error("browser doesn't support mutationObserver api")

    this.observe?.disconnect()

    performance.getEntries().forEach((entry: PerformanceEntryPolyfill) => {
      this.entries[entry.name] = entry.responseEnd
    })
    const tagEle = this.getTreeWeight(document.body)

    console.log(tagEle)
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
    }

    let els = this.filterEls(maxWeightEle!.elementList)
 
  }

  private register() {
    this.observe = new MutationObserver(() => {
      this.markCount++
      this.statusObserve.push({ time: performance.now() })
      this.setTag(document.body, this.markCount)
    })

    this.observe.observe(document, {
      childList: true,
      subtree: true
    })
  }

  private getTreeWeight(element: Element): TagElement | null {
    if (element) {
      const children = element.children
      const list: Array<TagElement> = []
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        if (!child.getAttribute('fmp_tag')) continue

        let elementList = this.getTreeWeight(child)
        if (elementList!.weightScore) {
          list.push(elementList!)
        }
      }
      return this.calculateScore(element, list)
    }
    return null
  }

  private setTag(element: Element, count: number) {
    const tagName = element.tagName
    if (IGNORE_TAG_LIST.indexOf(tagName) > -1) return
    const children = element.children
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i],
        hasTag = child.getAttribute('fmp_tag')
      if (!hasTag) {
        if (!inViewPort(child)) continue
        child.setAttribute('fmp_tag', `${count}`)
      }
      this.setTag(child, count)
    }
  }

  private getElementTiming () {
    
  }

  private calculateAreaPrecent(element: Element): number {
    const {
      left,
      right,
      top,
      bottom,
      width,
      height
    } = element.getBoundingClientRect()

    return 0
  }

  private filterEls (els:Array<Els>) {
    if (els.length === 1) return els
    
    let sum = 0;
    els.forEach(el => {
      sum += el.weightScore
    })

    let avg = sum / els.length
    return els.filter(el => el.weightScore > avg)
  }

  private calculateScore(
    element: Element,
    list: Array<TagElement>
  ): TagElement {
    const { width, height } = element.getBoundingClientRect()

    let weight = tagWeightMap.get(element.tagName) || 1,
      childScore = 0

    // 子节点总得分
    list.forEach((item) => {
      childScore += item.weightScore
    })

    // 节点得分
    let weightScore = inViewPort(element) ? width * height * weight! : 0

    let elementList = [{ element, weight, weightScore }]

    // 如果子节点总分大于节点得分，核心节点在子节点中
    if (
      weightScore * this.calculateAreaPrecent(element) < childScore ||
      weightScore === 0
    ) {
      weightScore = childScore
      elementList = []
      list.forEach((item) => {
        elementList = elementList.concat(item.elementList)
      })
    }
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
  // const element = instance.getFirstMeaningFulPaint()
  return Promise.resolve(instance.getFirstMeaningFulPaint())
}
