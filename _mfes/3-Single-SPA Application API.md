---
title: Single-SPA Application API
date: 2021-01-17
---

> [Application API](https://single-spa.js.org/docs/api)

```js
import { registerApplication, start } from "single-spa"
// or
import * as singleSpa from "single-spa"
```

## registerApplication

> 使用在 root config 中，用于注册应用  
> Simple arguments

```js
singleSpa.registerApplication(
    "app-name",
    () => System.import("appName"),
    (location) => location.pathname.startsWith("app")
)
```

Arguments - appName: string 应用的名称 - applicationOrLoadingFn：() => <Function | Promise> 一个返回应用或 Promise 的函数 - activeFn: (location) => boolean 纯函数，以 window.location 为参数，返回 true 表示激活该应用，false 表示卸载该应用 - customProps?: Object | () => Object 可选，需要传递给应用生命周期钩子的自定义参数

Configuration Object

```js
singleSpa.registerApplication({
    name: "app-name",
    app: () => System.import("appName"),
    activeWhen: "/app",
    customProps: {
        authToken: "xxxxx",
    },
})
```

Arguments - name: string 应用的名称 - app: Application | () => Application | Promise<Application> 应用 - activeWhen: string | (location) => boolean | (string | (location) => boolean)[] 什么时候激活应用与上面的一样 - customProps?: Object | () => Object 可选，需要传递给应用生命周期钩子的自定义参数

## start

> 让 single-spa 对应用进行控制，让您可以控制单页应用程序的性能

```js
singleSpa.start()

singleSpa.start({
    urlRerouteOnly: true,
})
```

Arguments
一个可选的对象，这个对象有 urlRerouteOnly 属性
urlRerouteOnly：一个默认为 false 的布尔值。如果设置为 true，则除非更改了客户端路由，否则对 history.pushState（）和 history.replaceState（）的调用将不会触发单 spa 重新路由。在某些情况下，将此值设置为 true 可能会更好。

## triggerAppChange

> 手动触发 single-spa 加载应用

```js
singleSpa.triggerAppChange()
```

## navigatToUrl

> 在已注册的应用之间执行 url 导航，而不需要处理 event.preventDefault() pushState triggerAppChange

```js
// Three ways of using navigateToUrl
singleSpa.navigateToUrl("/new-url")
singleSpa.navigateToUrl(document.querySelector("a"))
document.querySelector("a").addEventListener(singleSpa.navigateToUrl)
```

Arguments
navigationObj: string | context | DOMEvent - url 字符串 - 带有 href 属性的标签，例如 a 标签 - 一个具有 href 属性的 DOMElement 上的 click 事件的 DOMEvent 对象；

## getMountedApps

> 获取挂载（MOUNTED）应用的名字，返回一个字符串数组

```js
const mountedAppNames = singleSpa.getMountedApps()
console.log(mountedAppNames) // ['app1', 'app2', 'navbar']
```

## getAppNames

> 获取所有注册的应用，与应用的状态无关

```js
const appNames = singleSpa.getAppNames()
console.log(appNames) // ['app1', 'app2', 'app3', 'navbar']
```

## getAppStatus

> 获取指定应用的状态

```js
const status = singleSpa.getAppStatus("app1")
console.log(status) // one of many statuses (see list below). e.g. MOUNTED
```

Arguments
appName: string 注册应用的名字

Returns
appStatus: string | null , null 表示应用不存在 - NOT_LOADEDapp ：应用已经注册，但是还没有加载好 - LOADING_SOURCE_CODE：已经获取到源代码 - NOT_BOOTSTRAPPED： 应用已经加载好，但是还没开始初始化 - BOOTSTRAPPING：已经调用 bootstrap 生命周期钩子，但是还没执行完 - NOT_MOUNTED：已经执行好 bootstrap ，但是还没挂载 - MOUNTING：正在执行 mount 钩子 - MOUNTED：应用已经挂载在 DOM 上了 - UNMOUNTING：正在执行 unmount - UNLOADING：正在执行 unloading - SKIP_BECAUSE_BROKEN：应用在加载，引导，安装或卸载期间引发了错误，并且由于行为不当而被跳过，因此已被隔离。其他应用将继续正常运行。 - LOAD_ERROR：应用在 loading 方法中返回了 reject 的 Promise，这通常是由于尝试下载应用程序的 JavaScript 软件包的网络错误。

## unloadApplication

> 卸载已注册的应用程序的目的是将其设置回 NOT_LOADED 状态，这意味着它将在下次需要安装时重新引导。这样做的主要用例是允许热重载整个已注册的应用程序，但是无论何时您要重新引导应用程序，unloadApplication 都会很有用。

```js
// Unload the application right now, without waiting for it to naturally unmount.
singleSpa.unloadApplication("app1")

// Unload the application only after it naturally unmounts due to a route change.
singleSpa.unloadApplication("app1", { waitForUnmount: true })
```

当调用 unloadApplication 后 Single-spa 会执行如下几步 1. 在要卸载的注册应用程序上调用卸载生命周期。 2. 设置 App 状态为 NOT_LOADED 3. 触发重新路由，在这期间 single-spa 会挂载刚卸载的应用
因为调用 unloadApplication 时可能会挂载已注册的应用程序，所以您可以指定是要立即卸载还是要等待直到不再挂载该应用程序。这是通过 waitForUnmount 选项完成的。

Arguments
appName: string 应用名称
Options?: { waitForUnmoun: boolean = false} 可选对象参数，默认 single-spa 会立即卸载指定应用，如果设置为 true，single-spa 会等应用不处于 MOUNTED 状态的时候进行卸载。

## unregisterApplication

> unregisterApplication 函数将卸载，卸载和注销应用程序,一旦调用，应用不会再挂载

```js
import { unregisterApplication } from "single-spa"

unregisterApplication("app1").then(() => {
    console.log("app1 is now unmounted, unloaded, and no longer registered!")
})
```

    - Unregistering 应用程序不会将其从SystemJS模块注册表中删除。
    - Unregistering 应用程序不会从浏览器内存中删除其代码或javascript框架。
    - Unregistering 应用程序的另一种方法是在应用程序的活动功能内执行权限检查。这具有防止应用程序挂载的类似效果。

Arguments
appName: string 应用名称

## checkActivityFunctions

> 将使用模拟窗口位置调用每个应用程序的活动函数，并提供应在该位置挂载哪些应用程序的列表。

```js
const appsThatShouldBeActive = singleSpa.checkActivityFunctions()
console.log(appsThatShouldBeActive) // ['app1']

const appsForACertainRoute = singleSpa.checkActivityFunctions({
    pathname: "/app2",
})
console.log(appsForACertainRoute) // ['app2']
```

Arguments
mockWindowLocation: string 表示 window.location 的字符串，将在调用每个应用程序的活动函数以测试它们是否返回 true 时使用。

Returns
appNames: string[] 返回符合的应用名称的数组

## addErrorHandler

> 在生命周期函数或者激活函数中报错的时候会执行该方法，如果没有这个处理函数，就会直接抛出到窗口

```js
singleSpa.addErrorHandler((err) => {
    console.log(err)
    console.log(err.appOrParcelName)
    console.log(singleSpa.getAppStatus(err.appOrParcelName))
})
```

Arguments
errorHandler: Function(error: Error) 将通过 Error 对象调用，该对象还具有 message 和 appOrParcelName 属性。

## removeErrorHandler

> 移除错误处理函数

```js
singleSpa.addErrorHandler(handleErr)
singleSpa.removeErrorHandler(handleErr)

function handleErr(err) {
    console.log(err)
}
```

Arguments
errorHandler: Function 函数名称

Returns
Boolean :true 表示移除成功

## mountRootParcel

> 创建并挂载一个 singel-spa parcel

```js
// Synchronous mounting
const parcel = singleSpa.mountRootParcel(parcelConfig, {
    prop1: "value1",
    domElement: document.getElementById("a-div"),
})
parcel.mountPromise.then(() => {
    console.log("finished mounting the parcel!")
})

// Asynchronous mounting. Feel free to use webpack code splits or SystemJS dynamic loading
const parcel2 = singleSpa.mountRootParcel(() => import("./some-parcel.js"), {
    prop1: "value1",
    domElement: document.getElementById("a-div"),
})
```

Arguments
parcelConfig: object | loading Function
parcelProps: object 具有 DOM 元素属性的对象

returns
Parcel object

## pathToActiveWhen

> pathToActiveWhen 函数将字符串 URL 路径转换为活动函数。字符串路径可能包含 single-spa 匹配任何字符的路由参数。假定提供的字符串是前缀。  
> 当在注册应用的时候给 ativeWhen 传递一个字符串时会被调用
> Arguments
> Path: string url 的前缀
> returns: (location: location) => boolean
> Examples

```js
let activeWhen = singleSpa.pathToActiveWhen("/settings")
activewhen(new URL("http://localhost/settings")) // true
activewhen(new URL("http://localhost/settings/password")) // true
activeWhen(new URL("http://localhost/")) // false

activeWhen = singleSpa.pathToActiveWhen("/users/:id/settings")
activewhen(new URL("http://localhost/users/6f7dsdf8g9df8g9dfg/settings")) // true
activewhen(new URL("http://localhost/users/1324/settings")) // true
activewhen(new URL("http://localhost/users/1324/settings/password")) // true
activewhen(new URL("http://localhost/users/1/settings")) // true
activewhen(new URL("http://localhost/users/1")) // false
activewhen(new URL("http://localhost/settings")) // false
activeWhen(new URL("http://localhost/")) // false

activeWhen = singleSpa.pathToActiveWhen("/page#/hash")
activeWhen(new URL("http://localhost/page#/hash")) // true
activeWhen(new URL("http://localhost/#/hash")) // false
activeWhen(new URL("http://localhost/page")) // false
```

## ensureJQuerySupport

> 用于保障不同版本的 jQuery 的 event delegation

Arguments
jQuery? : JQueryFn = window.jQuery 对 jQuery 已绑定到的全局变量的引用

## setBootstrapMaxTime

> 设置全局 bootstrap 的超时时间

```js
// After three seconds, show a console warning while continuing to wait.
singleSpa.setBootstrapMaxTime(3000)

// After three seconds, move the application to SKIP_BECAUSE_BROKEN status.
singleSpa.setBootstrapMaxTime(3000, true)

// don't do a console warning for slow lifecycles until 10 seconds have elapsed
singleSpa.setBootstrapMaxTime(3000, true, 10000)
```

Arguments
Mills: number 超时之前等待 bootstrap 完成的毫秒数。
dieOnTimeout: boolean = false 如果为 false，则已注册的应用程序会使速度降低，直到达到 mills 之前，只会在控制台中引起一些警告。如果为 true，则使已注册应用程序将被置为 SKIP_BECAUSE_BROKEN 状态，在此状态下，它们将再也没有机会改变内容。
warningMillis: number = 1000 在最终超时之前发生的控制台警告之间等待的毫秒数。

## setMountMaxTime

> 设置全局 mount 的超时时间

```js
// After three seconds, show a console warning while continuing to wait.
singleSpa.setMountMaxTime(3000)

// After three seconds, move the application to SKIP_BECAUSE_BROKEN status.
singleSpa.setMountMaxTime(3000, true)

// don't do a console warning for slow lifecycles until 10 seconds have elapsed
singleSpa.setMountMaxTime(3000, true, 10000)
```

Arguments
同上

## setUnmountMaxTime

> 设置全局 unmount 的超时时间

```js
// After three seconds, show a console warning while continuing to wait.
singleSpa.setUnmountMaxTime(3000)

// After three seconds, move the application to SKIP_BECAUSE_BROKEN status.
singleSpa.setUnmountMaxTime(3000, true)

// don't do a console warning for slow lifecycles until 10 seconds have elapsed
singleSpa.setUnmountMaxTime(3000, true, 10000)
```

Arguments
同上

## setUnloadMaxTime

> 设置 unload 的超时时间

```js
// After three seconds, show a console warning while continuing to wait.
singleSpa.setUnloadMaxTime(3000)

// After three seconds, move the application to SKIP_BECAUSE_BROKEN status.
singleSpa.setUnloadMaxTime(3000, true)

// don't do a console warning for slow lifecycles until 10 seconds have elapsed
singleSpa.setUnloadMaxTime(3000, true, 10000)
```

Arguments
同上

## Event

> single-spa 将事件触发到窗口，作为您的代码挂接到 URL 过渡的一种方式

### PopStateEvent

> 当 single-spa 想要所有激活的应用重新渲染时，通过该事件触发。当一个应用程序调用 history.pushState，history.replaceState 或 triggerAppChange 时，就会发生这种情况。

```js
window.addEventListener("popstate", (evt) => {
    if (evt.singleSpa) {
        console.log(
            "This event was fired by single-spa to forcibly trigger a re-render"
        )
        console.log(evt.singleSpaTrigger) // pushState | replaceState
    } else {
        console.log("This event was fired by native browser behavior")
    }
})
```

### Canceling navigation

> 取消导航是指更改 URL，然后立即将其更改回之前的状态。这个发生在 mounting 、unmounting 或者 loading 之前完成。可以与 Vue 路由器和 Angular 路由器的内置导航保护功能结合使用，这些功能可以取消导航事件。

```js
// 监听 single-spa:before-routing-event 事件
window.addEventListener(
    "single-spa:before-routing-event",
    ({ detail: { oldUrl, newUrl, cancelNavigation } }) => {
        if (
            new URL(oldUrl).pathname === "/route1" &&
            new URL(newUrl).pathname === "/route2"
        ) {
            cancelNavigation()
        }
    }
)
```

### Custom Events

> 每当重新路由时，single-spa 都会触发一系列自定义事件。每当浏览器 URL 发生任何更改或调用 triggerAppChange 时，都会发生重新路由

```js
window.addEventListener("single-spa:before-routing-event", (evt) => {
    const {
        originalEvent,
        newAppStatuses,
        appsByNewStatus,
        totalAppChanges,
        oldUrl,
        newUrl,
        navigationIsCanceled,
        cancelNavigation,
    } = evt.detail
    console.log(
        "original event that triggered this single-spa event",
        originalEvent
    ) // PopStateEvent | HashChangeEvent | undefined
    console.log(
        "the new status for all applications after the reroute finishes",
        newAppStatuses
    ) // { app1: MOUNTED, app2: NOT_MOUNTED }
    console.log(
        "the applications that changed, grouped by their status",
        appsByNewStatus
    ) // { MOUNTED: ['app1'], NOT_MOUNTED: ['app2'] }
    console.log(
        "number of applications that changed status so far during this reroute",
        totalAppChanges
    ) // 2
    console.log("the URL before the navigationEvent", oldUrl) // http://localhost:8080/old-route
    console.log("the URL after the navigationEvent", newUrl) // http://localhost:8080/new-route
    console.log("has the navigation been canceled", navigationIsCanceled) // false

    // The cancelNavigation function is only defined in the before-routing-event
    evt.detail.cancelNavigation()
})
```

### before-app-change event

> 当至少一个应用程序更改状态，在重新路由之前会触发 single-spa：before-app-change 事件。

```js
window.addEventListener("single-spa:before-app-change", (evt) => {
    console.log("single-spa is about to mount/unmount applications!")
    console.log(evt.detail.originalEvent) // PopStateEvent
    console.log(evt.detail.newAppStatuses) // { app1: MOUNTED }
    console.log(evt.detail.appsByNewStatus) // { MOUNTED: ['app1'], NOT_MOUNTED: [] }
    console.log(evt.detail.totalAppChanges) // 1
})
```

### before-no-app-change

> 当零个应用程序更改状态,在重新路由之前会触发 single-spa：before-no-app-change 事件。

```js
window.addEventListener("single-spa:before-no-app-change", (evt) => {
    console.log("single-spa is about to do a no-op reroute")
    console.log(evt.detail.originalEvent) // PopStateEvent
    console.log(evt.detail.newAppStatuses) // { }
    console.log(evt.detail.appsByNewStatus) // { MOUNTED: [], NOT_MOUNTED: [] }
    console.log(evt.detail.totalAppChanges) // 0
})
```

### before-routing-event

> 在每个路由事件发生之前（即在每个 hashchange，popstate 或 triggerAppChange 之后）都会触发 single-spa：before-routing-event 事件，即使不需要更改已注册的应用程序也是如此。

```js
window.addEventListener("single-spa:before-routing-event", (evt) => {
    console.log("single-spa is about to mount/unmount applications!")
    console.log(evt.detail.originalEvent) // PopStateEvent
    console.log(evt.detail.newAppStatuses) // { }
    console.log(evt.detail.appsByNewStatus) // { MOUNTED: [], NOT_MOUNTED: [] }
    console.log(evt.detail.totalAppChanges) // 0
})
```

### before-mount-routing-event

> 在 routing-event 之前，在 before-routing-event 之后，保证在所有应用 unmounted 之后，所有新应用 mounted 之前触发

```js
window.addEventListener("single-spa:before-mount-routing-event", (evt) => {
    console.log("single-spa is about to mount/unmount applications!")
    console.log(evt.detail)
    console.log(evt.detail.originalEvent) // PopStateEvent
    console.log(evt.detail.newAppStatuses) // { app1: MOUNTED }
    console.log(evt.detail.appsByNewStatus) // { MOUNTED: ['app1'], NOT_MOUNTED: [] }
    console.log(evt.detail.totalAppChanges) // 1
})
```

### before-first-mount

> 在任何一个应用第一次挂载之前触发，因此只触发一次，这在应用已经加载好但是还没 mounting 之后。

```js
window.addEventListener("single-spa:before-first-mount", () => {
    console.log(
        "single-spa is about to mount the very first application for the first time"
    )
})
```

### first-mount

> 在任何一个应用第一次挂载之前触发，因此只触发一次

```js
window.addEventListener("single-spa:first-mount", () => {
    console.log("single-spa just mounted the very first application")
})
```

### app-change event

> 至少一个应用 loaded、bootstrap、mounted、unmounted 或者 unloaded 触发，hashchange，popstate 或 triggerAppChange 不会导致触发事件。

```js
window.addEventListener("single-spa:app-change", (evt) => {
    console.log(
        "A routing event occurred where at least one application was mounted/unmounted"
    )
    console.log(evt.detail.originalEvent) // PopStateEvent
    console.log(evt.detail.newAppStatuses) // { app1: MOUNTED, app2: NOT_MOUNTED }
    console.log(evt.detail.appsByNewStatus) // { MOUNTED: ['app1'], NOT_MOUNTED: ['app2'] }
    console.log(evt.detail.totalAppChanges) // 2
})
```

### no-app-change event

> 当没有应用 loaded、boostrapped 、mounted、unmounted 或者 unloaded 时触发。每个路由事件只会触发一个。

```js
window.addEventListener("single-spa:no-app-change", (evt) => {
    console.log(
        "A routing event occurred where zero applications were mounted/unmounted"
    )
    console.log(evt.detail.originalEvent) // PopStateEvent
    console.log(evt.detail.newAppStatuses) // { }
    console.log(evt.detail.appsByNewStatus) // { MOUNTED: [], NOT_MOUNTED: [] }
    console.log(evt.detail.totalAppChanges) // 0
})
```

### routing-event

> 每次发生路由事件时（在每个 hashchange，popstate 或 triggerAppChange 之后），都 ​​ 会触发 single-spa：routing-event 事件，即使无需更改已注册的应用程序；之后 single-spa 会验证所有应用正确 loaded、bootstrapped、mounted、unmounted

```js
window.addEventListener("single-spa:routing-event", (evt) => {
    console.log("single-spa finished mounting/unmounting applications!")
    console.log(evt.detail.originalEvent) // PopStateEvent
    console.log(evt.detail.newAppStatuses) // { app1: MOUNTED, app2: NOT_MOUNTED }
    console.log(evt.detail.appsByNewStatus) // { MOUNTED: ['app1'], NOT_MOUNTED: ['app2'] }
    console.log(evt.detail.totalAppChanges) // 2
})
```
