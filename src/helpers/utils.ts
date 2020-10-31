export const supportPerformance = (): boolean => {
  return window.performance && !!performance.getEntriesByType && !!performance.mark
}

export const supportPerformanceObserver = (): boolean => {
  return (window as any).chrome && 'PerformanceObserver' in window
}
/**
 * @private
 * @return {number} The current date timestamp
 */
export const now = (): number => {
  return +new Date()
}

export const flatObjectInArr = (arr: any): { [key: string]: any } => {
  let kvObj = Object.create(null)
  if (Array.isArray(arr)) {
    for (let item of arr) {
      kvObj = Object.assign(kvObj, item)
    }
  }
  return kvObj
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ; (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
