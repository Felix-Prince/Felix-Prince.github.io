# Photography Gallery

一个简约、可配置的个人摄影作品集网站，采用深色主题设计。

## 设计风格

- 🌙 **深色主题** - 与主站一致的深色背景 (#0a0a0f)
- ✨ **渐变球体** - 动态漂浮的彩色渐变装饰
- 🎨 **颗粒纹理** - 复古胶片质感的颗粒覆盖层
- 🌌 **毛玻璃效果** - 半透明卡片与柔和阴影
- 🎭 **渐变色系** - #ff6b6b, #feca57, #48dbfb, #ff9ff3

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
    "title": "你的摄影集名称",
    "subtitle": "副标题描述",
    "logo": ""
  },
  "theme": {
    "colors": {
      "bg": "#0a0a0f",
      "accent": "#ff6b6b"
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
      "title": "作品标题",
      "url": "https://example.com/photo.jpg",
      "thumbnail": "https://example.com/thumb.jpg",
      "tags": ["街拍", "人文"],
      "date": "2024-03-15",
      "camera": "Sony A7IV",
      "settings": "f/2.8, 1/250s, ISO 400",
      "description": "作品描述..."
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
| `site.logo` | Logo 图片路径 |
| `theme.colors.bg` | 背景色 |
| `theme.colors.accent` | 主强调色 |
| `theme.colors.gradient1-4` | 渐变球体颜色 |
| `theme.fonts.heading` | 标题字体 |
| `theme.fonts.body` | 正文字体 |
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

## 功能特性

- 🎨 **深色主题设计** - 符合摄影审美的深色界面
- ✨ **视觉效果** - 渐变球体、颗粒纹理、毛玻璃卡片
- 🏷️ **标签分类** - 支持多标签，灵活筛选
- 🔍 **搜索功能** - 按标题、描述、标签搜索
- 📅 **时间线视图** - 按时间顺序浏览作品
- 🖼️ **灯箱查看** - 全屏查看照片详情
- ⚡ **懒加载** - 图片懒加载，性能优化
- 📱 **响应式设计** - 完美适配手机、平板、桌面
- 🎭 **主题配置** - 自定义颜色、字体、Logo
- 🚀 **GitHub Pages 就绪** - 直接部署，开箱即用

## 技术栈

- 原生 HTML5 / CSS3 / JavaScript
- 无第三方依赖
- CSS 变量主题系统
- Intersection Observer 懒加载

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
