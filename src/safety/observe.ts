import inlineScan from './inline'
import hijack from './hijack'
import { SafetyConfig } from '../types/safety'

export default class {
  private whiteList: Array<string>
  constructor(config: SafetyConfig) {
    this.whiteList = config.whiteList || []

    this.registerListener()

    hijack.alertHook()

    hijack.consoleHook()
  }

  registerListener() {
    inlineScan((code) => {
      console.log(code)
    })
  }

  hijack() {}
}
