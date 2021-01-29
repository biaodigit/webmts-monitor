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
      // [native code]
    }
  },
  consoleHook: function () {
    let _console = Object.assign({}, window.console)
    for (let key in _console) {
      window.console[key] = (...args: any[]) => {
        _console[key](...args)
        // [native code]
      }
    }
  },
  promptHook: function (...args: any[]) {
    let _prompt = window.prompt
    window.prompt = (...args: any[]): string | null => {
      // [native code]
      return _prompt(...args)
    }
  },
  confirmHook: function (...args: any[]) {
    let _confirm = window.confirm
    window.confirm = (...args: any[]): boolean => {
      // [native code]
      return _confirm(...args)
    }
  },
}
