import { generateHash } from '../helpers/utils'
import { SafetyReport } from '../types/safety'

type callback = (config: SafetyReport) => void

const eventList = [
  'onclick',
  // 'onmouseover',
  'onchange',
  'ontouchstart',
  'onblur',
  'ondrag',
]

const contentRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/gim

function scan(
  ele: Element | null,
  eventName: string,
  whiteList: string[],
  cb: callback,
) {
  if (!ele) return

  if (ele.nodeType !== 1) return

  let hash = ele.getAttribute('data-scanhash')

  if (hash) return

  ele.setAttribute('data-scanhash', generateHash())

  const isClick = eventName === 'onclick'
  const code = ele.getAttribute(eventName)

  if (
    code &&
    contentRegex.test(code) &&
    code.match(contentRegex) &&
    !whiteList.includes(code.match(contentRegex)![0])
  ) {
    ele.setAttribute(eventName, '')
    cb({
      id: generateHash(),
      url: location.href,
      code,
      type: 'xss',
      ua: '',
      cookies: document.cookie,
      time: new Date(),
    })
  }

  if (
    isClick &&
    ele.tagName.toLowerCase() === 'a' &&
    (ele as HTMLAnchorElement).protocol === 'javascript:'
  ) {
    const code = (ele as HTMLAnchorElement).href.substr(11)
      ; (ele as HTMLAnchorElement).href = 'javascript:void(0)'
    cb({
      id: generateHash(),
      url: location.href,
      code,
      type: 'xss',
      ua: '',
      cookies: document.cookie,
      time: new Date(),
    })
  }

  scan(ele.parentNode as Element, eventName, whiteList, cb)
}

function eventHook(eventName: string, whiteList: string[], cb: callback) {
  document.addEventListener(
    eventName.substr(2),
    (e) => {
      if (e.target) {
        scan(e.target as Element, eventName, whiteList, cb)
      }
    },
    true,
  )
}

export default function (whiteList: string[], cb: callback) {
  for (let k of eventList) {
    eventHook(k, whiteList, cb)
  }
}
