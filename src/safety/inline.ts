import { generateHash } from '../helpers/utils'

type callback = (code: string) => void

const eventList = [
  'onclick',
  'onchange',
  // 'onfocus',
  'ontouchstart',
  'onblur',
  'ondrag',
]

const contentRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/gim

function scan(ele: Element | null, eventName: string, cb: callback) {
  if (!ele) return

  if (ele.nodeType !== 1) return

  let hash = ele.getAttribute('data-scanhash')

  if (hash) return

  ele.setAttribute('data-scanhash', generateHash())

  const isClick = eventName === 'onclick'
  const code = ele.getAttribute(eventName)
  if (code && contentRegex.test(code)) {
    ele.setAttribute(eventName, '')
    cb(code)
  }

  if (
    isClick &&
    ele.tagName === 'a' &&
    (ele as HTMLAnchorElement).protocol === 'javascript:'
  ) {
    const code = (ele as HTMLAnchorElement).href.substr(11)
    console.log(code)
    ;(ele as HTMLAnchorElement).href = 'javascript:void(0)'
    cb(code)
  }

  scan(ele.parentNode as Element, eventName, cb)
}

function eventHook(eventName: string, cb: callback) {
  document.addEventListener(
    eventName.substr(2),
    (e) => {
      // console.log(e)
      if (e.target) {
        // console.log(e.target)
        scan(e.target as Element, eventName, cb)
      }
    },
    true,
  )
}

export default function (cb: callback) {
  for (let k in document) {
    if (/^on./.test(k)) {
      // eventHook(k, cb)
      // console.log(k)
    }
  }
  for (let k of eventList) {
    eventHook(k, cb)
  }
  // eventHook('onclick', cb)
}
