/**
 * 支持Performance对象
 */
export const supportPerformance = () =>
  window.performance &&
  !!window.performance.getEntriesByType &&
  !!window.performance.mark

/**
 * 支持PerformanceObsever
 */
export const supportPerformanceObserver = () =>
  (window as any).chrome && 'Performance' in window

/**
 * 支持MutationObserver
 */
export const supportMutationObserver = () => 'MutationObserver' in window

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
    height,
  } = target.getBoundingClientRect()

  if (!width || !height) return 0

  const  winR = window.innerWidth,
    winB = window.innerHeight

  const viewWidth =
    left >= 0 && right >= 0
      ? width
      : left < 0 && right >= 0
      ? winR - right
      : left >= 0 && right < 0
      ? winR - left
      : width
  const viewHeight =
    top >= 0 && bottom >= 0
      ? height
      : top < 0 && bottom >= 0
      ? winB - bottom
      : top >= 0 && bottom < 0
      ? winB - top
      : height

  return Math.max((viewWidth * viewHeight) / (width * height), 0)
}
