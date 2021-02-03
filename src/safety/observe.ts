import inlineScan from './inline'
import hijack from './hijack'
import { SafetyConfig, SafetyReport } from '../types/safety'

export default class {
  private whiteList: Array<string>
  constructor(config: SafetyConfig) {
    const { xss, whiteList = [], safetyTracker } = config
    this.whiteList = whiteList

    this.registerListener(safetyTracker!)

    // hijack.alertHook()
    // hijack.consoleHook()
  }

  registerListener(trackerCb: (config: SafetyReport) => void) {
    inlineScan(this.whiteList, trackerCb)
  }

  hijack() {}
}
