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
 * 元素是否在第一视觉外
 * @param target 
 */
export const inViewPort = (target: Element): boolean => {
  const winW = window.innerWidth,
    winH = window.innerHeight
  const { left, top } = target.getBoundingClientRect()
  return top > 0 && top < winH && left > 0 && left < winW
}
