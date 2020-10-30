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
