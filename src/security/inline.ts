import { generateHash } from '../helpers/utils'

type callback = (code: string) => void

function scan(ele: Element | null, eventName: string, cb: callback) {
  if (!ele) return

  if (ele.nodeType !== 1) return

  let hash = ele.getAttribute('data-scanhash')

  if (hash) return

  ele.setAttribute('data-scanhash', generateHash())

  const isClick = eventName === 'onclick'
  const code = ele.getAttribute(eventName)
  if (code && /xss/.test(code)) {
    ele.setAttribute(eventName, '')
    cb(code)
  }
  if (
    isClick &&
    ele.tagName === 'a' &&
    (ele as HTMLAnchorElement).protocol === 'javascript:'
  ) {
    const code = (ele as HTMLAnchorElement).href.substr(11)
    ;(ele as HTMLAnchorElement).href = 'javascript:void(0)'
    cb(code)
  }

  scan(ele.parentNode as Element, eventName, cb)
}

function eventHook(eventName: string, cb: callback) {
  document.addEventListener(eventName.substr(2), (e) => {
    if (e.target) {
      scan(e.target as Element, eventName, cb)
    }
  })
}

export default function (cb: callback) {
  for (let k in document) {
    if (/^on./.test(k)) {
      eventHook(k, cb)
    }
  }
}
