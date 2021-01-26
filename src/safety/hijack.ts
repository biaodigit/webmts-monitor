type Fn = (...args: any[]) => void

export default {
  checkHook: function (fn: Fn) {
    if (fn.toString().indexOf('[native code]') > 0) {
    } else {
    }
  },
  alertHook: function () {
    let _alert = window.alert
    window.alert = (...args: any[]) => {
      _alert(...args)
      // console.log('safety')
      // [native code]
    }
  },
  consoleHook: function () {
    let _console = Object.assign({}, window.console)
    for (let key in _console) {
      window.console[key] = (...args: any[]) => {
        _console[key](...args)
        alert('safety')
        // [native code]
      }
    }
  },
  promptHook: function (...args: any[]) {},
  confirmHook: function (...args: any[]) {},
}
