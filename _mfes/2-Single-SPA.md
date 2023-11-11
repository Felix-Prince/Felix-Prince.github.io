---
title: 微前端 Micro-Frontends - Single-SPA
date: 2021-01-17
---

single-spa 包含两部分， 1. Applications ，每个应用都是一个完整的 SPA，每个应用需要知道怎么从 DOM 上 bootstrap(引导), mount(安装), and unmount(卸载)（这三个可以理解为 single-spa 的生命周期） 2. 一个配置文件 `single-spa-config ` ，可以理解为 HTML 页面和 single-spa 注册应用程序的 js 配置文件，注册应用需要的参数： 1. 一个应用的名字，不能重复 2. 一个加载应用代码的函数 3. 一个决定什么时候激活/灭活应用的函数 4. 自定义参数

Single-SPA 提供了自己的一个脚手架 `create-single-spa`
使用这个脚手架创建项目的时候可以附加参数

```bash
# --dir 声明生成的项目文件名
npx create-single-spa my-dir
npx create-single-spa --dir my-dir

# --moduleType 指定生成哪一种类型的 single-spa ，参考下面三种类型
create-single-spa --moduleType root-config
create-single-spa --moduleType app-parcel
create-single-spa --moduleType util-module

# --framework 指定使用何种框架的，例如 react vue
create-single-spa --framework react
create-single-spa --framework vue
create-single-spa --framework angular
```

在 single-spa 中，有以下三种微前端类型： 1. [single-spa applications](https://zh-hans.single-spa.js.org/docs/building-applications) :为一组特定路由渲染组件的微前端。 - 有多个路由 - 声明式 API ———— `registerApplication` - 渲染 UI - single-spa 管理生命周期:负责管理 regist 注册后的应用 - 核心构建模块 2. [single-spa parcels](https://zh-hans.single-spa.js.org/docs/parcels-overview) : 不受路由控制，渲染组件的微前端。

> 它们的存在主要是允许您在多个框架中编写应用程序时在应用程序之间重用 UI

    	- 无路由
    	- 命令式 API
    	- 渲染 UI
    	- 自定义生命周期：`mountParcel` `mountRootParcel` `unmount` 等方法来控制 parcels，[参考API](https://single-spa.js.org/docs/parcels-api)
    	- 仅在多个框架中需要
    4.  [utility modules](https://zh-hans.single-spa.js.org/docs/recommended-setup#utility-modules-styleguide-api-etc) : 非渲染组件，用于暴露共享javascript逻辑的微前端。
    	- 无路由
    	- 暴露接口
    	- 可能渲染 UI
    	- 外部模块：没有直接的单spa生命周期
    	- 共享通用逻辑或创建服务很有用

## Single-SPA Config

配置文件包含两部分： 1. 一个所有应用共享的 html 文件 2. 一个调用了 singleSpa.registerApplication() 的 js 文件

> singleSpa.registerApplication() 参数说明

1. application name，一个字符串，用于描述应用的名称
2. 加载函数或者应用
    - 参数是应用时：一个实现了生命周期方法的对象

```js
const application = {
    bootstrap: () => Promise.resolve(), //bootstrap function
    mount: () => Promise.resolve(), //mount function
    unmount: () => Promise.resolve(), //unmount function
}
registerApplication("applicationName", application, activityFunction)
```

    - 参数是加载函数时：一个返回值时 Promise 或者 async Function 的函数，通常的实现方式 `() => import('/path/to/application.js')`

3. 激活方法
    - 一个纯函数，window.location 作为第一个参数，返回 true 表示激活当前应用，如果 false 就不激活
    - 在以下情况下 single-spa 会调用每个应用的激活函数
        - `hashchange` `popstate` 事件触发
        - `pushState` `replaceState` 方法被调用
        - `triggerAppChange` api 被调用
        - `checkActivityFunction` 方法被调用
4. 自定义属性
   自定义属性时传递给应用的生命周期方法的，自定义属性可以时一个对象，或者是一个以应用名 name 和 window.location 作为参数，返回对象的函数`(name, location) => {}`

使用配置对象的方式

```js
singleSpa.registerApplication({
    name: "myApp",
    app: () => import("src/myApp/main.js"),
    activeWhen: [
        "/myApp",
        (location) => location.pathname.startsWith("/some/other/path"),
    ],
    customProps: {
        some: "value",
    },
})

singleSpa.registerApplication({
    name: "myApp",
    app: () => import("src/myApp/main.js"),
    activeWhen: [
        "/myApp",
        (location) => location.pathname.startsWith("/some/other/path"),
    ],
    customProps: (name, location) => ({
        some: "value",
    }),
})
```

config.name: 应用的名字
Config.app: 声明你的应用，可以是包含 bootstrap、mount、unmount 这些生命周期的对象，或者是一个加载函数，与上面第二个参数一样
Config.activeWhen：激活函数，类似于上面第三个参数，可以是一个路径的前缀或者是一个包含两者数组
config.customProps: 自定义参数

> single.Start()

Single-spa 配置必须调用 start（）API，以便实际安装应用程序。在调用 start 之前，将加载应用程序，但不会引导/安装/卸载应用程序。开始的原因是让您控制性能。例如，您可能想立即注册应用程序（以开始下载活动代码的代码），但是在初始 AJAX 请求（可能要获取有关登录用户的信息）完成之前才真正安装应用程序。在这种情况下，立即调用 registerApplication 即可获得最佳性能，但是在 AJAX 请求完成后调用 start。

## Application lifecycle

### Load

当应用的 activity function 返回 true 的时候就会立即执行，最好不要在 load 中执行任何操作，如果您需要在加载期间执行某些操作，只需将代码放入已注册应用程序的主入口点，而不是放在导出函数的内部。

```js
console.log("The registered application has been loaded!");

export async function bootstrap(props) {...}
export async function mount(props) {...}
export async function unmount(props) {...}
```

### Bootstrap

该生命周期函数将在首次安装已注册的应用程序之前被调用一次。

```js
export function bootstrap(props) {
    return Promise.resolve().then(() => {
        // One-time initialization code goes here
        console.log("bootstrapped!")
    })
}
```

### Mount

每当未安装已注册的应用程序时，都会调用此生命周期函数，但是其活动函数将返回真实值。调用此函数时，该函数应查看 URL 以确定活动路由，然后创建 DOM 元素，DOM 事件侦听器等以将内容呈现给用户。任何后续的路由事件（例如 hashchange 和 popstate）都不会触发更多的装载请求，而应由应用程序本身处理。

```js
export function mount(props) {
    return Promise.resolve().then(() => {
        // Do framework UI rendering here
        console.log("mounted!")
    })
}
```

### Unmount

Activity function 返回 false 时，每当安装已注册的应用程序，都会调用此生命周期函数。调用此函数时，应清除所有在挂载已注册应用程序时创建的 DOM 元素，DOM 事件侦听器，内存泄漏，全局变量，可观察的订阅等。

```js
export function unmount(props) {
    return Promise.resolve().then(() => {
        // Do framework UI unrendering here
        console.log("unmounted!")
    })
}
```

### Unload

卸载生命周期是一个可选实现的生命周期功能。每当应卸载应用程序时，它将被调用。除非有人调用 unloadApplication API，否则这永远不会发生。如果已注册的应用程序未实现卸载生命周期，则假定卸载该应用程序为无操作。
