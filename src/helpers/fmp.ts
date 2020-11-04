import { inViewPort } from '../helpers/utils'

interface NodeList {
  element: Element
  weightScore: number
  childList: Array<NodeList>
  elementList: Array<{weight:number,weightScore:number,element:Element}>
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
  constructor() {
    this.resolveFn = null

    this.register()
  }

  public getCoreElement(): Promise<number> {
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
      this.setTag(document.body, this.markCount)
    })

    this.observe.observe(document, {
      childList: true,
      subtree: true
    })
  }

  private getTreeWeight(element: Element): NodeList | null {
    if (element) {
      const children = element.children
      const list: Array<NodeList> = []
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        if (!child.getAttribute('fmp_w')) continue

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
    for (let i = children.length - 1; i >= 0; i++) {
      const child = children[i],
        hasTag = child.getAttribute('fmp_w')
      if (!hasTag) {
        if (!inViewPort(child)) continue
        child.setAttribute('fmp_w', `${count}`)
      }
      this.setTag(child, count)
    }
  }

  private calculateAreaPrecent (element:Element) {
    
  }

  private calculateScore(element: Element, list: Array<NodeList>): NodeList {
    const { width, height } = element.getBoundingClientRect()

    let weight = tagWeightMap.get(element.tagName) || 1,
      childScore = 0
    list.forEach((item) => {
      childScore += item.weightScore
    })

    let weightScore = inViewPort(element) ? width * height * weight! : 0 

    let elementList = [{element,weight,weightScore}]
    if (weightScore < childScore || weightScore === 0) {
      weightScore = childScore
      elementList = []
      list.forEach(item => {
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
  const fmp = new FMP()
  const element = fmp.getCoreElement()
  return Promise.resolve(fmp.getCoreElement())
}
