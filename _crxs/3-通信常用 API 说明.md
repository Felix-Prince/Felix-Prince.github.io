# 通信常用 API 说明

1. [chrome.runtime.sendMessage](https://crxdoc-zh.appspot.com/extensions/runtime#method-sendMessage)

```js
/**
 * 向您的扩展程序/应用或另一个扩展程序/应用中的其他事件监听者发送单个消息。
 * @param {string} extensionId 发送消息的扩展程序或应用的标识符，扩展的 id，省略就是当前扩展内部通信
 * @param {any} message
 * @param {object} options
 * @param {function} callback (response: any) => {} 响应
 */
chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)
```

2. [chrome.runtime.onMessage](https://crxdoc-zh.appspot.com/extensions/runtime#event-onMessage)

> 如果您在同一个文档中有一个以上的 onMessage 事件处理函数，只有其中一个可以发送响应。当事件处理函数返回时，该函数将失效，除非您在事件处理函数中返回 true，表示您希望通过异步方式发送响应（这样，与另一端之间的消息通道将会保持打开状态，直到调用了 sendResponse）。  

```js
/**
 * 当消息从扩展程序进程或者内容脚本中发送时产生，其实就是监听发送过来的消息
 * @param {function} callback (message: any, MessageSender: sender, sendResponse: function) => {}
 * @return {boolean} 如果您需要在事件监听器返回后再调用 sendResponse 请在事件监听器中返回 true
 */
chrome.runtime.onMessage.addListener(function callback(
    message,
    MessageSender,
    sendResponse
) {
    // message 调用脚本发送的消息
    // sendResponse (response: any) => {} 当您产生响应时调用（最多一次）的函数，参数可以是任何可转化为 JSON 的对象。
});
```

3. [chrome.runtime.onMessageExternal](https://crxdoc-zh.appspot.com/extensions/runtime#event-onMessageExternal)

```js
/**
 * 当消息从另一个扩展程序/应用发送时产生。不能在内容脚本中使用。
 * @param {function} callback (message: any, MessageSender: sender, sendResponse: function) => {}
 * @return {boolean} 如果您需要在事件监听器返回后再调用 sendResponse 请在事件监听器中返回 true
 */
chrome.runtime.onMessageExternal.addListener(function callback(
    message,
    MessageSender,
    sendResponse
) {
    // message 调用脚本发送的消息
    // sendResponse (response: any) => {} 当您产生响应时调用（最多一次）的函数，参数可以是任何可转化为 JSON 的对象。
});
```

4. [chrome.runtime.getBackgroundPage](https://crxdoc-zh.appspot.com/extensions/runtime#method-getBackgroundPage)

> [chrome.extension.getBackgroundPage](https://crxdoc-zh.appspot.com/extensions/extension#method-getBackgroundPage)  

```js
/**
 * 获取当前扩展程序/应用中正在运行的后台网页的 JavaScript window 对象。
 * 如果后台网页是事件页面，系统会确保在调用回调函数前它已经加载。如果没有后台网页，将会设置错误信息。
 * @params {function} callback (backgroundPage: Window) => {}
 */
 chrome.runtime.getBackgroundPage(function callback(backgroundPage){
    // backgroundPage 后台页面的 JavaScript window 对象。
 })

 // 返回运行在当前扩展程序中的后台网页的 JavaScript window 对象。如果扩展程序没有后台网页则返回 null。
 chrome.extension.getBackgroundPage(): window
```

```javascript
// 两者的使用方式有差别
chrome.runtime.getBackgroundPage(function callback(backgroundPage){
    backgroundPage.sayHello(“Felix”)
})

const page = chrome.extension.getBackgroundPage()
page.sayHello(“Felix”)
```

5. [chrome.runtime.connect](https://crxdoc-zh.appspot.com/extensions/runtime#method-connect)

```js
/**
 * 尝试连接到扩展程序/应用中的连接监听者（例如后台网页）或其他扩展程序/应用，该方法可用于内容脚本连接到所属扩展程序进程、应用/扩展程序之间的通信以及与网页通信。
 * @params {stirng} extensionId 扩展程序或应用的标识符， 扩展 id
 * @params {object} connectInfo {name: string, includeTlsChannelId: boolean} name: 将传递给监听连接事件的扩展程序进程的 onConnect 事件
 * @return 返回一个 port 对象
 */
chrome.runtime.connect(string extensionId, object connectInfo)
```

6. [chrome.runtime.onConnectExternal](https://crxdoc-zh.appspot.com/extensions/runtime#event-onConnectExternal)

```js
/**
 * 当连接从另一个扩展程序发起时产生。
 * @params {function} callback (port: Port) => {}
 */
chrome.runtime.onConnectExternal.addListener(function callback)
```

7. [chrome.runtime.onConnect](https://crxdoc-zh.appspot.com/extensions/runtime#event-onConnect)

```js
/**
 * 当连接从扩展程序进程或内容脚本中发起时产生。
 * @params {function} callback (port: Port) => {}
 */
 chrome.runtime.onConnect.addListener(function callback)
```

8. runtime.Port.disconnect

9. runtime.Port.onDisconnect

10. [chrome.tabs.query](https://crxdoc-zh.appspot.com/extensions/tabs#method-query)

```js
/**
 * 获取具有指定属性的所有标签页，如果没有指定任何属性的话则获取所有标签页。
 * @params {object} queryInfo
 * @params {function} callback ( tab: []) => {}
 */
chrome.tabs.query(object queryInfo, function callback)

queryInfo = {
    active: boolean, // 标签页在窗口中是否为活动标签页。
    pinned: boolean, // 标签页是否固定。
    highlighted: boolean, // 标签页是否高亮突出。
    currentWindow: boolean, // 标签页是否在当前窗口中。
    lastFocusedWindow: boolean, // 标签页是否在前一个具有焦点的窗口中。
    status: enum['loading','complete'], // 标签页是否已经加载完成。
    title: string, // 匹配页面标题的表达式。
    url: string, // 匹配标签页的 URL 表达式。注意：片段标识符不会匹配
    windowId: integer, // 父窗口标识符，或者为 windows.WINDOW_ID_CURRENT，表示当前窗口。
    windowType: enum['normal','popup','panel','app'],  // 标签页所在窗口的类型。
    index: integer, // 标签页在窗口中的位置
}

```

11. [chrome.tabs.sendMessage](https://crxdoc-zh.appspot.com/extensions/tabs#method-sendMessage)

```js
/**
 * 向指定标签页中的内容脚本发送一个消息，当发回响应时执行一个可选的回调函数。当前扩展程序在指定标签页中的每一个内容脚本都会收到 runtime.onMessage 事件。
 * @params {integer} tabId tab 标签的 id
 * @params {any} message
 * @params {function} responseCallback (response: any) => {}
 */
chrome.tabs.sendMessage(integer tabId, any message, function responseCallback(response){
    // response 请求处理程序发出的 JSON 响应对象。如果连接到指定标签页的过程中发生错误，将不传递参数调用回调函数，并将 runtime.lastError 设置为错误消息。
})
```

12. [chrome.extension.getViews](https://crxdoc-zh.appspot.com/extensions/extension#method-getViews)

```js
/**
 * 返回一个数组，含有每一个在当前扩展程序中运行的页面的JavaScript window 对象。
 * @params {object} fetchProperties { type: enum['tab', 'infobar', 'notification', 'popup'], windowId: integer}
 * type 要获取的视图类型。如果省略，返回所有视图（包括后台页面和标签页）。有效值为："tab"（标签页）、"infobar"（信息栏）、"notification"（通知）、"popup"（弹出窗口）。
 * windowId 将搜索限制在指定窗口中。如果省略，返回所有视图。
 * @return {array of window}
 */
chrome.extension.getViews(object fetchProperties)
```

13. [chrome.webRequest](https://crxdoc-zh.appspot.com/extensions/webRequest)

这个就直接看文档了

14. [chrome.window](https://crxdoc-zh.appspot.com/extensions/windows)

```js
Window = {
    id: integer, // 窗口标识符，在浏览器会话中唯一。在某些情况下，例如当您使用 sessions API 查询窗口时，窗口可能没有标识符，此时存在会话标识符。
    focused: boolean, // 是否为当前具有焦点的窗口
    top: integer, // 窗口与屏幕顶部的距离，以像素为单位。在某些情况下，例如当您使用 sessions API 查询关闭的窗口时，窗口可能没有 top 属性。
    left: integer, // 窗口与屏幕左侧的距离，以像素为单位。在某些情况下，例如当您使用 sessions API 查询关闭的窗口时，窗口可能没有 left 属性。
    width: integer, // 窗口的宽度（包含边框），以像素为单位。在某些情况下，例如当您使用 sessions API 查询关闭的窗口时，窗口可能没有 width 属性。
    height: integer, // 窗口的高度（包含边框），以像素为单位。在某些情况下，例如当您使用 sessions API 查询关闭的窗口时，窗口可能没有 height 属性。
    tabs: Ayyay[tabs.Tab], // 表示窗口中所有标签页的 tabs.Tab 对象数组。
    incognito: boolean, //  是否为隐身窗口。
    type: enum[("normal", "popup", "panel", "app")], // 浏览器窗口的类型。在某些情况下，例如当您使用 sessions 查询关闭的窗口时，窗口可能没有 type 属性。
    state: enum[("normal", "minimized", "maximized", "fullscreen")], // 浏览器窗口的状态。在某些情况下，例如当您使用 sessions 查询关闭的窗口时，窗口可能没有 state 属性。
    alwaysOnTop: boolean, // 窗口是否设置为前端显示
    sessionId: string, // 会话标识符，用于唯一标识由 sessions API 获取的窗口
};
```

15. [chrome.storage](https://crxdoc-zh.appspot.com/apps/storage)

这一 API 为扩展程序的存储需要而特别优化，它提供了与 localStorage API 相同的能力，但是具有如下几个重要的区别：

* 用户数据可以通过 Chrome 浏览器的同步功能自动同步（使用 storage.sync）。
* 您的应用的内容脚本可以直接访问用户数据，而不需要后台页面。
* 即使使用分离式隐身行为，用户的扩展程序设置也会保留。
* 它是异步的，并且能够进行大量的读写操作，因此比阻塞和串行化的 localStorage API 更快。
* 用户数据可以存储为对象（localStorage API 以字符串方式存储数据）。
* 可以读取管理员为扩展程序配置的企业策略（使用 storage.managed 和架构）。

如果要为您的应用储存用户数据，您可以使用 storage.sync 或 storage.local。使用 storage.sync 时，储存的数据将会自动在用户启用同步功能并已经登录的所有 Chrome 浏览器间同步。

当 Chrome 浏览器处于离线状态时，Chrome 浏览器将数据储存在本地。下一次浏览器在线时，Chrome 浏览器将会同步数据。即使用户关闭了同步，storage.sync 仍然有效，只是此时它与 storage.local 的行为相同。

storage.managed 存储区是只读的。

StorageArea:

1. chrome.storage.sync
2. chrome.storage.local
3. chrome.storage.managed

```js
/**
 * @params {string | Array<Stirng> | object} keys 要获得的单个键、多个键的列表或者指定默认值的词典（参见对象的描述），空的列表或对象将会返回空的结果对象。要获得存储的所有内容，请传递 null。
 */
StorageArea.get(string or array of string or object keys, function callback)
```

```js
/**
 * 当一个或多个项目的存储更改时产生。
 * @params {function} callback
 */
chrome.storage.onChanged.addListener(function callback(changes: object, areaName: string){
    // changes 一个对象，将更改的每一个键映射到该项目对应的 StorageChange 对象。
    // areaName.这一更改对应的存储区（"sync"（同步）、"local"（本机）或 "managed"））。
})

/**
 * 设置多个项目。
 * @params {object} items 包含要更新的键/值对的对象，存储中的其他键/值对不会受到影响。
 * 像数值之类的原生值会以预期的方式序列化，除了Array（按照预期的方式序列化）、Date 和 RegExp（以字符串表示形式序列化）以外，typeof 为 "object" 和 "function" 的值通常序列化为 {}。
 */
StorageArea.set(object items, function callback)

/**
 * 从存储中移除一个或多个项目。
 * @params {string | Array<String> } keys 单个键或多个键的列表，表示要移除的内容。
 */
StorageArea.remove(string or array of string keys, function callback)

/**
 * 从存储中删除所有值
 */
StorageArea.clear(function callback)
```

## Port
| 属性          |
| ------------- |
| name          | string |  |
| disconnect    | function |  |
| onDisconnect  | event |  |
| onMessage     | event |  |
| postMessage   | function |  |
| MessageSender | sender | 只有当端口传递给 onConnect/onConnectExternal 监听器时才会存在该属性。 |

## MessageSender
| 属性     |
| -------- |
| tabs.Tab | （可选）tab | 打开连接的 tabs.Tab（标签页），如果有的话。只有当连接从标签页或内容脚本中打开，并且接收方是扩展程序而不是应用时才会存在这一属性。 |
| string   | （可选）id | 打开连接的扩展程序或应用的标识符（如果有的话）。 |
| string   | （可选）url | 从 Chrome 28 开始支持。打开连接的页面或框架 URL（如果有的话），只有当连接从标签页或内容脚本打开时才会存在这一属性。 |
| string   | （可选）tlsChannelId | 从 Chrome 32 开始支持。如果扩展程序或应用请求该属性并且可用，则为打开连接的网页的 TLS 通道标识符。 |