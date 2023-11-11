# Chrome Extension 第一篇 — manifest
## 简介
Chrome 浏览器给我们提供了很多插件，比如：React Developer tools 、划词翻译、Octotree等，可以让我们在某些页面或者所有页面中能使用一些特定的功能。这是给 Chrome 浏览器增加功能。
Chrome 浏览器扩展使用的技术还是HTML、CSS 和 JavaScript ，所以对前端开发来说是非常友好很容易上手的。扩展程序本质上是网页

## 概念及基础
每一个扩展程序包含以下文件：
* 一个**清单文件**
* 一个或多个 **HTML 文件**（除非扩展程序是一个主题背景）
* *可选：*一个或多个 **JavaScript 文件**
* *可选：*您的扩展程序需要的任何其他文件，例如图片

### 清单文件 manifest.json
这是一个Chrome插件最重要也是必不可少的文件，用来配置所有和插件相关的配置，必须放在根目录。其中，manifest_version、name、version 3个是必不可少的，description 和 icons 是推荐的。[完整配置](https://developer.chrome.com/extensions/manifest)
```js
{
	// 必填的 3 个
	"manifest_version": 2, // 清单文件的版本，这个必须写，而且必须是2，在低于 chrome 17 的版本中使用 1，否则使用 2
	"name": "demo", // 插件的名称
	"version": "1.0.0", // 插件的版本

	// 推荐增加的
	"default_locale": "en", // 这个是指定你的扩展的默认显示的语言，涉及国际化内容 i18n
  "description": "A plain text description", // 插件的描述
  "icons": { // 最好可以提供三个不同大小的图标，推荐使用 png 格式文件
		"16": "icon16.png", // 用于展示在浏览器的右上角那个扩展图标
      "48": "icon48.png", // 用于在扩展管理界面展示
      "128": "icon128.png" // 在安装过程中和Chrome网上应用店都使用它
	},

	// 用一个或者都不用
	"browser_action": { // 浏览器右上角图标设置
		"default_icon": "images/icon32.png", // 可以是这样的一个字符串，也可以如上面的 icon 一样是个对象，可以是静态图或者是 canvas
		"default_title": "Google Mail", // 鼠标移入图标时展示 ，即tooltip
		"default_popup": "popup.html"  // 当点击 icon 的时候会弹出一个页面，
	},
  "page_action": {...}, // 当某些特定页面打开才显示的图标，配置与 browser_action 相同

	// 可选配置
	"background": { // 会一直常驻的后台JS或后台页面
    "persistent": false,  // 定义了常驻后台的方式——当其值为true时，表示扩展将一直在后台运行，无论其是否正在工作；当其值为false时，表示扩展在后台按需运行，这就是Chrome后来提出的Event Page
		"scripts": ["js/background.js"], Chrome会在扩展启动时自动创建一个包含所有指定脚本的页面；
		"page": "background.html" // Chrome会将指定的HTML文件作为后台页面运行。通常我们只需要使用scripts属性即可，除非在后台页面中需要构建特殊的HTML——但一般情况下后台页面的HTML我们是看不到的。
  },
	"content_scripts": [ // 需要直接注入页面的JS
		{
			"matches": ["<all_urls>"],// "matches": ["http://*/*", "https://*/*"], "<all_urls>" 表示匹配所有地址
			"js": ["js/jquery-1.8.3.js", "js/content-script.js"],// 多个JS按顺序注入
			"css": ["css/custom.css"],// JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
			"run_at": "document_start" // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
		}
	],
	// 权限申请 
	"permissions":[
		"contextMenus", // 右键菜单
		"tabs", // 标签
		"notifications", // 通知
		"webRequest", // web请求
		"webRequestBlocking",
		"storage", // 插件本地存储
		"http://*/*", // 可以通过executeScript或者insertCSS访问的网站
		"https://*/*" // 可以通过executeScript或者insertCSS访问的网站
	],
	// 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
	"web_accessible_resources": ["js/inject.js"],
	// 插件主页，这个很重要，不要浪费了这个免费广告位
	"homepage_url": "https://www.baidu.com",
	// 快捷键设置
    "commands": {
        "toggle-feature-foo": {
            "suggested_key": {
                "default": "Ctrl+Shift+Y",
                "mac": "Command+Shift+Y" // mac 下需要特殊指定
            },
            "description": "Toggle feature foo",
				"global": true // 是否全局的快捷命令,true 表示全局快捷键， false 表示浏览器获取焦点时才会起作用
        },
			// “ _execute_browser_action”和“ _execute_page_action”命令保留用于打开扩展程序的弹出窗口。
        "_execute_browser_action": { 
            "suggested_key": {
                "windows": "Ctrl+Shift+Y",
                "mac": "Command+Shift+Y",
                "chromeos": "Ctrl+Shift+U",
                "linux": "Ctrl+Shift+J"
            }
        },
        "_execute_page_action": {
            "suggested_key": {
                "default": "Ctrl+Shift+E",
                "windows": "Alt+Shift+P",
                "mac": "Alt+Shift+P"
            }
        }
    }
}
```

### browser_action & page_action API
> [chrome.browserAction](https://developer.chrome.com/extensions/browserAction#method-setIcon))  

1. 设置图标 等同于 default_icon
```js
/**
 * 设置图标
 * @param {obejct} detail 图标信息
 * @param {function} callback 回调函数 （说明这是一个异步操作）
 */
chrome.browserAction.setIcon(object details, function callback)
```

2. 设置title 等同于 default_title
```js
/**
 * 设置标题
 * @param {obejct} detail 标题信息
 * @param {function} callback 回调函数 （说明这是一个异步操作）
 */
chrome.browserAction.setTitle(object details, function callback)
/**
 * 获取标题
 * @param {obejct} detail 
 * @param {function} callback 回调函数 （说明这是一个异步操作），接收一个 result 参数 （reulst：string） => {}
 */
chrome.browserAction.getTitle(object details, function callback)
```

3. 设置 popup 等同于 default_popup
```js
/**
 * 设置 Popup
 * @param {obejct} detail 对应 html 页面信息
 * @param {function} callback 回调函数 （说明这是一个异步操作）
 */
chrome.browserAction.setPopup(object details, function callback)
/**
 * 获取 Popup 页面
 * @param {obejct} detail 
 * @param {function} callback 回调函数 （说明这是一个异步操作），接收一个 result 参数 （reulst：string） => {}
 */
chrome.browserAction.getPopup(object details, function callback)
```

4. 设置徽标 badge
```js
/**
 * 设置徽标文本（最多 4 个字符）
 * @param {obejct} detail 徽标文本
 * @param {function} callback 回调函数 （说明这是一个异步操作）
 */
chrome.browserAction.setBadgeText(object details, function callback)
/**
 * 获取徽标文本
 * @param {obejct} detail 
 * @param {function} callback 回调函数 （说明这是一个异步操作），接收一个 result 参数 （reulst：string） => {}
 */
chrome.browserAction.getBadgeText(object details, function callback)
/**
 * 设置徽标文本背景色
 * @param {obejct} detail 颜色
 * @param {function} callback 回调函数 （说明这是一个异步操作）
 */
chrome.browserAction.setBadgeBackgroundColor(object details, function callback)
/**
 * 获取徽标颜色
 * @param {obejct} detail 
 * @param {function} callback 回调函数 （说明这是一个异步操作），接收一个 result 参数 （reulst：colorArray） => {}
 */
chrome.browserAction.getBadgeBackgroundColor(object details, function callback)
```

5. 禁用和启用
```js
// 启用 browser action
chrome.browserAction.enable(integer tabId, function callback)
// 禁用 browser action
chrome.browserAction.disable(integer tabId, function callback)
```

> [chrome.pageAction](https://developer.chrome.com/extensions/pageAction#method-hide)  
只有下面这个事区别于 browser_action 的，别的和上面都一样
1. 展示和隐藏
```js
chrome.pageAction.show(integer tabId, function callback)
chrome.pageAction.hide(integer tabId, function callback)
```


### background
> [background](https://developer.chrome.com/extensions/background_pages)  
Background 是一个常驻的页面，它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以`通常把需要一直运行的、启动就运行的、全局的代码`放在 background 里面。
Background的权限非常高，几乎可以调用所有的Chrome扩展API（除了devtools），而且它可以无限制跨域，也就是可以跨域访问任何网站而无需要求对方设置CORS。
### content scripts 
>  [content-scripts](https://developer.chrome.com/extensions/content_scripts)   
所谓 content-scripts ，其实就是Chrome插件中向页面注入脚本的一种形式（虽然名为script，其实还可以包括css的），借助content-scripts我们可以实现通过配置的方式轻松向指定页面注入JS和CSS（如果需要动态注入，可以参考下文），最常见的比如：广告屏蔽、页面CSS定制，等等。
Content-script 与 原始页面共享 DOM ，但是不共享 JS，可以修改页面信息

content-scripts不能访问绝大部分chrome.xxx.api，除了下面这4种：
* chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
* chrome.i18n
* chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
* chrome.storage

非要调用其它API的话，你还可以通过通信来实现让background来帮你调用

Content-scripts 运行在一个独立的环境中，允许 content-scripts 对其 JavaScript 环境进行更改，而不会与页面或其他 content-scripts 发生冲突。
因为 content-scripts 运行在一个独立的环境中，所以就解释了上面为什么无法获取原始页面的 JS，以及其他扩展的变量和方法，这同样的带来一个好处就是可以在 content-scripts 中调用一些页面不能访问的权限功能。

Content-scripts 有两种注入方式，一种是编程式的，一种是声明式的（在manifest中声明）
1. 编程式
需要配置相应的 activeTab 权限，这将授予对活动站点主机的安全访问权限以及对选项卡权限的临时访问权限，从而使 content-scripts 可以在当前活动选项卡上运行，而无需指定跨域权限。
```js
{
	// ...
	"permissions": [
      "activeTab"
   ],
}
```
2. 声明式
在 manifest 的 content-scripts 字段中指定，指定的 script 会自动在指定的页面执行。
配置字段
	- matches：必填字段，字符串数组，指定哪些页面将会注入 content scripts
	- css：可选字段，字符串数组，在页面构造完成或者显示出来前，按数组的顺行把 css 文件注入到匹配的页面中去
	- js：可选字段，字符串数组，把 js 文件注入到匹配的页面中去
	- match_about_blank：可选字段，boolean ，是否注入到与 matches pattern 匹配的 `about:blank` 中去
	- exclude_matches：可选字段，字符串数组，排除此内容脚本将被注入的页面
	- include_globs：可选字段，字符串数组，匹配后应用，以仅包括也匹配此glob的那些URL。模拟 @include
	- exclude_globs：可选字段，字符串数组，在匹配之后应用，以排除与此全局匹配的URL。模拟 @exclude

例子：
**匹配表达式和范围**
如果页面的 URL 匹配任何 matches 指定的表达式以及任何 include_globs 指定的表达式，并且不匹配 exclude_matches 和 exclude_globs 指定的表达式，则会在页面中插入内容脚本。因为 matches 属性是必需的，exclude_matches、include_globs 和 exclude_globs 只能用来限制受到影响的页面。
例如，假设 matches 为 [“http://*.nytimes.com/*”]：
* 如果 exclude_matches 为 [“*://*/*business*”]，那么内容脚本会插入`http://www.nytimes.com/health`，但不会插入`http://www.nytimes.com/business`。
* 如果 include_globs 为 [“*nytimes.com/???s/*”]，那么内容脚本会插入`http://www.nytimes.com/arts/index.html`和`http://www.nytimes.com/jobs/index.html`，但不会插入`http://www.nytimes.com/sports/index.html`。
* 如果 exclude_globs 为 [“*science*”]，那么内容脚本会插入`http://www.nytimes.com`，但不会插入`http://science.nytimes.com`或`http://www.nytimes.com/science`。

范围（glob）属性与 [匹配表达式](https://crxdoc-zh.appspot.com/extensions/match_patterns) 相比遵循不同并且更灵活的语法。所有含有“通配符”星号和问号的 URL 都是可接受的范围字符串，星号（*）匹配任意长度的字符串（包括空字符串），问号（?）匹配任意单个字符。
例如，范围 `http://???.example.com/foo/*` 匹配以下任一 URL：
`http://www.example.com/foo/bar`
`http://the.example.com/foo/`
但是*不匹配*如下 URL：
`http://my.example.com/foo/bar`
`http://example.com/foo/`
`http://www.example.com/foo`

配置 run_at ：string
	- document_idle：如果是 “document_idle”，浏览器将在 “document_end” 和刚发生 window.onload 事件这两个时刻之间选择合适的时候插入，具体的插入时间取决于文档的复杂程度以及加载文档所花的时间，并且浏览器会尽可能地为加快页面加载速度而优化。
**注意：**如果使用 “document_idle”，内容脚本不一定会收到 window.onload 事件，因为它们可能在这一事件已经发生后再执行。在大多数情况下，在 “document_idle” 时运行的内容脚本没有必要监听 onload 事件，因为它们保证在 DOM 完成后运行。如果您的脚本确实需要在 window.onload 之后运行，您可以检查  [document.readyState](http://www.whatwg.org/specs/web-apps/current-work/#dom-document-readystate)  属性确定 onload 事件是否已经发生。
	- document_start：如果是 “document_start”，这些文件将在 css 中指定的文件之后，但是在所有其他 DOM 构造或脚本运行之前插入
	- document_end：如果是 “document_end”，文件将在 DOM 完成之后立即插入，但是在加载子资源（如图像与框架）之前插入。

配置 all_frames ： boolean  ，all_frames 字段允许扩展程序指定是将JavaScript和CSS文件注入到符合指定URL要求的所有框架中，还是仅注入到选项卡中最顶部的框架中。

### Permission
> [Declare Permissions](https://developer.chrome.com/extensions/declare_permissions)  
要使用大多数chrome。* API，您的扩展程序或应用必须在清单的“权限”字段中声明其意图。每个权限可以是已知字符串列表（例如“ geolocation”）中的一个，也可以是允许访问一个或多个主机的匹配模式。如果您的扩展程序或应用程序被恶意软件破坏，则权限有助于限制破坏。

### Command
命令API允许您定义特定的命令，并将其绑定到默认键组合。您的扩展接受的每个命令都必须在清单中作为“命令”清单密钥的属性列出。一个扩展可以有许多命令，但是只能指定4个建议的键。用户可以从chrome：// extensions / configureCommands对话框中手动添加更多快捷方式。






