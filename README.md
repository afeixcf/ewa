EWA (微信小程序增强开发工具)
=========================

Enhanced Wechat App Development Toolkit (微信小程序增强开发工具)

## 为什么开发这个工具？

厌倦了不停的对比 [wepy](https://github.com/Tencent/wepy) 或者 [mpvue](https://github.com/Meituan-Dianping/mpvue) 的特性，间歇性的踩雷，以及 `code once, run everywhere` 的幻想。只想给小程序开发插上效率的翅膀 ~

## 功能特性

1. Async/Await 支持
2. Javascript ES2017+ 语法
3. 原生小程序所有功能，无需学习，极易上手
4. 微信接口 Promise 化
5. 支持安装 NPM 包
6. 支持 SCSS(或 LESS) 以及 小于 16k 的 background-image
7. 支持 source map, 方便调试
8. 添加新页面或新组件无需重启编译
9. 允许自定义编译流程
10. 自动兼容旧版本手机中的显示样式
11. 支持 WXSS 和 SCSS(或 LESS) 混用
12. 代码混淆及高度压缩，节省包大小
13. Typescript 支持
14. 支持转换成 百度 / 字节跳动 / 支付宝 小程序
15. 多种小程序开发插件，为小程序开发减负，解放生产力

更多特性正在赶来 ... 敬请期待 👇

+ 可跨项目复用的小程序组件或页面（通过NPM包管理）
+ Redux 支持
+ Mixin 支持

## 安装

***需要 node 版本 >= 10.13***

```bash
npm i -g ewa-cli 或者 yarn global add ewa-cli
```

## 如何使用

### 创建新项目

```bash
ewa new your_project_name
```

### 集成到现有小程序项目，仅支持小程序原生开发项目转换

***注意：使用此方法，请务必对项目代码做好备份！！！***

```bash
cd your_project_dir && ewa init
```

### 启动

运行 `npm start` 即可启动实时编译

运行 `npm run build` 即可编译线上版本（相比实时编译而言，去除了 source map 并增加了代码压缩混淆等，体积更小）

上述命令运行成功后，可以看到本地多了个 `dist` 目录，这个目录里就是生成的小程序相关代码。

使用[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html)选择 `dist` 目录打开，即可预览项目

### 目录结构

```
├── .ewa                         特殊占位目录，用于检查是否为 ewa 项目
├── dist                         小程序运行代码目录（该目录由ewa的start 或者 build指令自动编译生成，请不要直接修改该目录下的文件）
├── node_modules                 外部依赖库
├── src                          代码编写的目录（该目录为使用ewa后的开发目录）
│   ├── components               小程序组件目录
│   ├── pages                    小程序页面目录
│   │   ├── index
│   │   │   ├── index.js
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   └── logs
│   │       ├── logs.js
│   │       ├── logs.json
│   │       ├── logs.wxml
│   │       └── logs.wxss
│   ├── templates                小程序模版目录
│   ├── utils
│   │   └── util.js
│   ├── app.js                   小程序入口文件
│   ├── app.json                 小程序全局配置文件
│   ├── app.wxss                 小程序全局样式文件
│   └── project.config.json      微信开发者工具小程序项目配置文件
├── ewa.config.js                ewa 配置文件
├── .gitignore
├── .eslintrc.js                 eslint 配置
└── package.json
```

### 命令行

```
# 命令行概览👇

ewa <cmd> [args]

命令：
  ewa new <projectName>       创建新的微信小程序项目           [别名: create]
  ewa init                    在现有的小程序项目中初始化 EWA
  ewa start                   启动 EWA 小程序项目实时编译         [别名: dev]
  ewa build                   编译小程序静态文件
  ewa clean                   清理小程序静态文件
  ewa upgrade                 升级 EWA 工具
  ewa generate <type> <name>  快速生成模版                          [别名: g]

选项：
  -v, --version  当前版本号                                               [布尔]
  -h, --help     获取使用帮助                                             [布尔]


# 多平台编译支持, 默认为 weapp (微信小程序)

# 实时编译命令 👇
ewa start

启动 EWA 小程序项目实时编译

选项：
  -v, --version  当前版本号                                               [布尔]
  -h, --help     获取使用帮助                                             [布尔]
  -t, --type     构建目标 `weapp` 或 `swan` 或 `alipay` 或 `tt`
            [字符串] [可选值: "weapp", "swan", "alipay", "tt"] [默认值: "weapp"]

# 构建命令 👇
ewa build

编译小程序静态文件

选项：
  -v, --version  当前版本号                                               [布尔]
  -h, --help     获取使用帮助                                             [布尔]
  -t, --type     构建目标 `weapp` 或 `swan` 或 `alipay` 或 `tt`
            [字符串] [可选值: "weapp", "swan", "alipay", "tt"] [默认值: "weapp"]
```

## 功能插件

### 微信接口 Promise 化

```javascript
// 引入
const { api } = require('ewa');

// 例：
Page({
  async onLoad() {
    let { data } = await api.request({ url: 'http://your_api_endpoint' });
  }
})
```

### enableState 插件

```javascript
// 在 app.js 中引入插件，并初始化
require('ewa').enableState();

// 上述插件会引入 this.setState 方法，在 Page 和 Component 中均可调用
// setState 方法会自动 diff 并仅提交数据变更
// 例：
Page({
  data: { a: 1, b: 1, c: { d: 1, e: 1 } }
  async onLoad() {
    // 自动 diff 变化
    // 相当于 this.setData({ b: 2, 'c.d': 2 });
    this.setState({ a: 1, b: 2, c: { d: 2, e: 1 } });
  }
})
```

### createStore 插件

使用方法： 👇

1. 创建 store:对任意纯对象调用 createStore 使其响应式化（以 app.js 中 globalData 为例）

```javascript
// app.js 中引入
const { createStore } = require('ewa');

App({
  ...
  globalData: createStore ({
    a: 'old1',
    b: {
      c: 'old2'
    }
  })
})
```

2. 改变globalData，globalData以及全局状态更新（支持嵌套属性和数组下标修改）

```javascript
// pageA.js
Page({
  data: {
    a: '',
    b: {
      c: ''
    }
  }
})

onLoad() {
  App().globalData.a = 'new1'
  console.log(this.data.a === 'new1')  // true

  App().globalData.b.c = 'new2'
  console.log(this.data.b.c === 'new2') // true
}
```

3. 注入全局方法 使用示例:

```javascript
this.$on('test', (val) => { console.log(val) })

this.$emit('test', 'value') // 'value'

this.$once // 使用方法同this.$on 只会触发一次

this.$off('test') // 解绑当前实例通过this.$on(...)注册的事件
```

以上方法适用于
1. 页面与页面
2. 页面与组件
3. 组件与组件

* 注: 所有页面或组件销毁时会自动解绑所有的事件(无需使用 `this.$off(...)`) *

`this.$set('coinName', '金币')` 更新所有页面和组件 data 中 'coinName' 的值为 '金币'（支持嵌套属性和数组下标修改）

2020/07 更新

$watch 监听页面或组件 data 中属性 支持监听属性路径形式如 'a[1].b'

使用示例：
```
data: {
  prop: '',
  obj: {
    key: ''
  }
},
...
$watch: {
  // 方式一
  'prop': function(newVal, oldVal) {
    ...
  },
  // 方式二
  'obj': {
    handler: function(newVal, oldVal) {
      ...
    },
    deep: Boolean, // 深度遍历
    immediate: Boolean // 立即触发
  }
}
```

## 配置

ewa 通过 `ewa.config.js` 来支持个性化配置。如下所示：

``` javascript
// ewa.config.js

module.exports = {
  // 公用代码库 (node_modules 打包生成的文件)名称，默认为 vendors.js
  commonModuleName: 'vendors.js',

  // 通用模块匹配模式，默认为 /[\\/](node_modules|utils|vendor)[\\/].+\.js/
  // 如需添加多个文件夹，可自定义正则，如 /[\\/](node_modules|utils|custom_dirname)[\\/].+\.js/
  commonModulePattern: /[\\/](node_modules|utils|vendor)[\\/].+\.js/,

  // 是否简化路径，作用于 page 和 component，如 index/index.wxml=> index.wxml，默认为 false
  simplifyPath: false,

  // 文件夹快捷引用
  aliasDirs: [
    'apis',
    'assets',
    'constants',
    'utils'
  ],

  // 需要拷贝的文件类型
  copyFileTypes: [
    'png',
    'jpeg',
    'jpg',
    'gif',
    'svg',
    'ico'
  ],

  // webpack loader 规则
  rules: [],

  // webpack 插件
  plugins: [],

  // 开发环境下是否自动清理无用文件，默认为 true
  autoCleanUnusedFiles: true,

  // css 解析器，sass 或者 less，默认为 sass
  cssParser: 'sass',

  // 是否开启 hashed module id
  hashedModuleIds: true,

  // 是否开启缓存，默认为 true
  cache: true,

  // 嫌不够灵活？直接修改 webpack 配置
  webpack: function(config) {
    return config;
  }
};
```

## 常见问题 & Tips

1. 可以使用 `@` 来代替 **源代码根目录** 来引入代码或样式，如 `const utils = require('@/utils/util')`
2. WXSS 中可以直接编写 SCSS 样式代码
3. WXSS 或 SCSS 中引用绝对路径需要在路径前加 `~` 符号，如：`@import "~@/assets/styles/common.scss";`，具体原因参见: [sass-loader](https://github.com/webpack-contrib/sass-loader#imports)
4. `ewa build` 后如果无法正常运行小程序，可检查下是否关闭了微信开发者工具中的 `ES6 转 ES5` 和 `增强编译` 选项。原因是：ewa 打包时会将 ES6 转换为 ES5 并混淆压缩，此功能和微信开发者工具自带的 `ES6 转 ES5` 和 `增强编译` 功能有部分重复，多次转换会导致代码无法运行，所以只要关闭即可。
