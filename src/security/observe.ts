import inlineScan from './inline'
import { SecurityConfig } from '../types/security'

export default class {
  private whiteList: Array<string>
  constructor(config: SecurityConfig) {
    this.whiteList = config.whiteList || []

    this.registerListener()
  }

  registerListener() {
    inlineScan((code) => {
      console.log(code)
    })
  }
}
