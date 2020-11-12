export default function (cb:() => void) {
  const transformEvent = function (type: 'pushState' | 'replaceState') {
    let origin = window.history[type]
    return function () {
      const data = arguments[0],
        title = arguments[1],
        url = arguments[2]
      var rv = origin.apply(window.history, [data, title, url])
      var e = new Event(type)
      ;(e as any).arguments = arguments
      window.dispatchEvent(e)
      return rv
    }
  }
  window.history.pushState = transformEvent('pushState')
  window.history.replaceState = transformEvent('replaceState')

  window.addEventListener('replaceState', function (e) {
    cb()
  })
  window.addEventListener('pushState', function (e) {
    cb()
  })
}
