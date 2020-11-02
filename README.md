# webmts-monitor

web 指标监控

## 如何使用

```
npm i webmts-monitor --save
```

```js
// ESModule
import monitor from 'webmts-monitor'

monitor({
    ....
})

// CommonJs

const monitor = require('webmts-monitor')

monitor({
    ....
})
```

## API

**monitor(config)**

```js
monitor({
  firstContentfulPaint: true
  trackerHooks: ({data}) => {
    console.log(data)
  }
});
```

或

```js
monitor({
  firstContentfulPaint: true,
}).then(console.log);
```

**开放式 api**

- monitor.getFCP
- monitor.getFID
- monitor.getTTI
- monitor.getTTFB
- monitor.getNavTiming

```js
monitor.getFCP().then(console.log);
```

## 请求参数

```js
{
  // 首屏渲染时长
  firstPaint: true,

  // 首屏内容渲染时长
  firstContentfulPaint: true,

  // 首次输入时长
  firstInputDelay: false

  // 首次可交互时长
  timeToInteractive: false

  // 首字节等待时长
  timeToFirstByte: false

  // 导航指标(dns解析时间 | 首字节时间 | 白屏时间 | 页面加载时间 | 资源加载时间)
  navigationTiming: false,

  // 追踪钩子
  trackerHooks: ({data}) => {
    // ...
  }
}
```
