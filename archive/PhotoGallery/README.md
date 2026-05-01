# Photography Gallery

一个高级暗调风格的个人摄影作品集网站 —— 沉浸式展示体验。

## 设计美学

**暗调沉浸式风格 (Dark Immersive Style)**

- 🖤 **高级暗调** - #111111 深灰背景，营造沉浸式观影体验
- ✨ **精致排版** - Playfair Display 标题字体 + Helvetica Neue 正文字体
- 📖 **书页设计** - 摄影合集以翻开的书本形式展示
- 🎠 **全屏轮播** - 自适应全屏 Hero 轮播，自动切换
- 🔲 **极简灯箱** - 纯黑背景，专注作品本身

## 设计细节

### 排版
- **标题**: Playfair Display (优雅的衬线字体)
- **正文**: Helvetica Neue (简洁的无衬线字体)
- **元数据**: JetBrains Mono (等宽字体，现代感)

### 配色
- **主背景**: 深灰 (#111111)
- **次要背景**: 浅灰 (#1a1a1a)
- **文字**: 浅灰渐变 (#dddddd → #f5f5f5)
- **强调色**: 暖金 (#c9a76e) - 可配置

### 交互
- 顶部导航随滚动变化透明度
- 悬停时图片去色还原 + 缩放效果
- 平滑的轮播切换
- 键盘导航支持 (← → ESC)
- 触摸滑动支持

## GitHub Pages 兼容性

✅ **完全兼容 GitHub Pages** - 使用相对路径，无需特殊配置

所有资源路径都是相对路径：
- `data/photos.json` - 照片数据
- `theme.config.json` - 主题配置
- `css/gallery.css` - 样式文件
- `js/config.js` - 配置模块
- `js/gallery.js` - 主逻辑

直接推送到 GitHub 即可正常访问！

## 快速开始

### 1. 配置主题

编辑 `theme.config.json` 文件来自定义网站：

```json
{
  "site": {
    "title": "Photography",
    "subtitle": "Personal Works"
  },
  "theme": {
    "colors": {
      "accent": "#c9a76e"
    }
  }
}
```

### 2. 添加照片

编辑 `data/photos.json` 文件来添加你的摄影作品：

```json
{
  "photos": [
    {
      "id": "photo-001",
      "title": "Work Title",
      "url": "https://example.com/photo.jpg",
      "thumbnail": "https://example.com/thumb.jpg",
      "tags": ["street", "portrait"],
      "date": "2024-03-15",
      "camera": "Sony A7IV",
      "settings": "f/2.8, 1/250s, ISO 400",
      "description": "Work description...",
      "collection": "Collection Name"
    }
  ]
}
```

### 3. 本地预览

使用任意 HTTP 服务器打开项目：

```bash
# 使用 Python
python3 -m http.server 8000

# 或使用 Node (http-server)
npx http-server
```

然后在浏览器访问 `http://localhost:8000`

### 4. 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `master` 分支（或你的主分支）
4. 等待几分钟，网站就会上线！

## 配置说明

### theme.config.json

| 字段 | 说明 |
|------|------|
| `site.title` | 网站标题 |
| `site.subtitle` | 网站副标题 |
| `theme.colors.accent` | 强调色 |
| `navigation.backLink.href` | 返回首页链接 |
| `navigation.backLink.label` | 返回链接文字 |

### photos.json 照片字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | 是 | 唯一标识符 |
| `title` | 是 | 作品标题 |
| `url` | 是 | 原图链接 |
| `thumbnail` | 否 | 缩略图链接（默认用 url） |
| `tags` | 是 | 标签数组 |
| `date` | 是 | 拍摄日期 (YYYY-MM-DD) |
| `camera` | 否 | 相机型号 |
| `settings` | 否 | 拍摄参数 |
| `description` | 否 | 作品描述 |
| `collection` | 是 | 合集名称 |

## 功能特性

- 🖤 **高级暗调风格** - 沉浸式观影体验
- 🎠 **全屏轮播** - 自适应全屏，自动切换
- 📖 **书页合集** - 摄影作品以书本形式展示
- 🔲 **极简灯箱** - 专注作品本身
- ⌨️ **键盘导航** - 支持 ← → ESC 键
- 📱 **触摸滑动** - 移动端友好
- 📱 **响应式设计** - 完美适配手机、平板、桌面
- 🎭 **主题配置** - 自定义颜色、字体
- 🚀 **GitHub Pages 就绪** - 直接部署，开箱即用

## 技术栈

- 原生 HTML5 / CSS3 / JavaScript
- 无第三方依赖
- CSS 变量主题系统
- 响应式 Grid 布局

## 为其他摄影爱好者定制

如果你也想搭建自己的摄影网站，只需要：

1. 复制整个 `PhotoGallery` 文件夹
2. 修改 `theme.config.json` 为你的信息
3. 替换 `data/photos.json` 为你的作品
4. 推送到 GitHub 并启用 Pages

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT
