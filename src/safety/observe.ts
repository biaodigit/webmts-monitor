import inlineScan from './inline'
import hijack from './hijack'
import { SafetyConfig, SafetyReport } from '../types/safety'

export default class {
  private whiteList: Array<string>
  constructor(config: SafetyConfig) {
    const { xss, whiteList, trackerCb } = config
    this.whiteList = config.whiteList || []

    this.registerListener(trackerCb)

    hijack.alertHook()
    hijack.consoleHook()
  }

  registerListener(trackerCb: (config: SafetyReport) => void) {
    inlineScan(trackerCb)
  }

  hijack() {}
}
