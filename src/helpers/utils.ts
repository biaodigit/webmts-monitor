/**
 * 支持Performance对象
 */
export const supportPerformance =
  window.performance && !!performance.getEntriesByType && !!performance.mark

/**
 * 支持PerformanceObsever
 */
export const supportPerformanceObserver =
  (window as any).chrome && typeof PerformanceObserver === 'function'

/**
 * 支持MutationObserver
 */
export const supportMutationObserver = typeof MutationObserver === 'function'

/**
 * @return {number} The current date timestamp
 */
export const now = (): number => {
  return +new Date()
}

/**
 *
 * @param arr
 */
export const flatObjectInArr = (arr: any): { [key: string]: any } => {
  let kvObj = Object.create(null)
  if (Array.isArray(arr)) {
    for (let item of arr) {
      kvObj = Object.assign(kvObj, item)
    }
  }
  return kvObj
}

/**
 *
 * @param to
 * @param from
 */
export const extend = <T, U>(to: T, from: U): T & U => {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * 可视区域节点显示面积比例
 * @param target
 */
export const calculateAreaPrecent = (target: Element): number => {
  const {
    left,
    right,
    top,
    bottom,
    width,
    height
  } = target.getBoundingClientRect()

  if (!width || !height) return 0

  const winL = 0,
    winT = 0,
    winR = window.innerWidth,
    winB = window.innerHeight

  const viewWidth = Math.min(right, winR) - Math.max(left, winL)
  const viewHeight = Math.min(bottom, winB) - Math.max(top, winT)

  return Math.max(((viewWidth * viewHeight) / (width * height)), 0)
}
