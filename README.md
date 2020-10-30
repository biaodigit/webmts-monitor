# webmts-monitor
web指标监控

# 如何使用
```
npm i webmts-monitor --save
```

```js
// ESModule
import Monitor from 'webmts-monitor'

new Monitor({
    ...
})

// CommonJs

const Monitor = require('webmts-monitor')

new Monitor({
    ...
})
```

# 示例
```js
new Monitor({
    firstPaint: true,   // 首屏渲染
    firstContentfulPaint: true,  // 首屏内容渲染
    navigationTiming: true,   // 导航指标(dns解析时间 | 首字节时间 | 白屏时间 | 页面加载时间 | 资源加载时间)
    trackerHooks: ({ metricName, duration, data }) => {   // 钩子方法
        // ...
    }
})
```