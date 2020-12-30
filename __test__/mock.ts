

export default {
  target: {
    getBoundingClientRect: () => ({
      top:100,
      left: 100,
      bottom: 500,
      right: 500,
      height: 100,
      width: 100
    })
  },
  performance() {
    delete (window as any).performance
    const performance = {
      getEntriesByType() {
      
      },
      mark: () => 1
    }

    Object.defineProperty(window,'performance',{
      configurable:true,
      value: performance,
      enumerable:true,
      writable:true
    })
  },
  now: new Date(),
  PerformanceObserver: () => {},
  MutationObserver: () => {}
};