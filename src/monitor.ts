import Monitor from './core/Monitor'
import { extend } from './helpers/utils'
import { MonitorIntance } from './types'

const createInstance = (): MonitorIntance => {
  const context = new Monitor()
  const instance = Monitor.prototype.integratedConfig.bind(context)

  extend(instance, context)
  return instance as MonitorIntance
}

const monitor = createInstance()

export default monitor
