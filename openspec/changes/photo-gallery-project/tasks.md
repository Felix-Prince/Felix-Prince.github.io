## 1. 项目结构与配置 / Project Setup & Configuration

- [x] 1.1 创建 gallery 目录结构 / Create gallery directory structure (gallery/, assets/photos/, assets/photos/thumbs/)
- [x] 1.2 创建 theme.config.json 默认主题配置 / Create theme.config.json with default theme configuration
- [x] 1.3 创建 photos.json 示例数据 / Create photos.json example data with sample photo entries
- [x] 1.4 创建 gallery/index.html 入口页面 / Create gallery/index.html entry page

## 2. 主题配置系统 / Theme Configuration System

- [x] 2.1 创建 CSS 变量（主题色、字体、间距）/ Create CSS variables for theme colors, fonts, and spacing
- [x] 2.2 实现配置文件加载器模块 / Implement config loader JavaScript module
- [x] 2.3 实现从配置动态应用 CSS 变量 / Implement dynamic CSS variable application from config
- [x] 2.4 为缺失的配置添加默认值回退 / Add fallback defaults for missing config values

## 3. 相册布局与网格 / Photo Gallery Layout & Grid

- [x] 3.1 创建相册页面 HTML 结构 / Create gallery page HTML structure (header, main, filters, photo grid)
- [x] 3.2 实现响应式 CSS 网格 / Implement responsive CSS grid (3-column desktop, 2-column tablet, 1-column mobile)
- [x] 3.3 创建相片卡片组件 HTML/CSS / Create photo card component HTML/CSS
- [x] 3.4 实现悬停叠加层显示标题和日期 / Implement hover overlay with photo title and date

## 4. 相片数据与加载 / Photo Data & Loading

- [x] 4.1 创建 photos.json 数据加载器模块 / Create photos.json data loader module
- [x] 4.2 实现从 JSON 数据渲染相片 / Implement photo rendering from JSON data
- [x] 4.3 使用 Intersection Observer 添加图片懒加载 / Add lazy loading for images using Intersection Observer
- [x] 4.4 创建缩略图占位符样式 / Create thumbnail placeholder styling

## 5. 标签系统 / Tagging System

- [x] 5.1 实现标签云组件 / Implement tag cloud component (display all tags with counts)
- [x] 5.2 添加标签选择/取消选择功能 / Add tag selection/deselection functionality
- [x] 5.3 实现多标签筛选逻辑（OR 匹配）/ Implement multi-tag filter logic (OR matching)
- [x] 5.4 添加清除所有标签按钮 / Add clear all tags button
- [x] 5.5 按使用频率排序标签 / Sort tags by usage frequency

## 6. 搜索与筛选系统 / Search & Filter System

- [x] 6.1 创建搜索输入 UI 组件 / Create search input UI component
- [x] 6.2 实现跨标题、描述、标签的关键词搜索 / Implement keyword search across title, description, tags
- [x] 6.3 添加日期范围筛选 UI / Add date range filter UI
- [x] 6.4 实现日期范围筛选逻辑 / Implement date range filtering logic
- [x] 6.5 组合搜索、标签和日期筛选（AND 逻辑）/ Combine search, tag, and date filters (AND logic)
- [x] 6.6 显示结果数量 / Display result count
- [x] 6.7 添加「未找到相片」空状态 / Add "No photos found" empty state
- [x] 6.8 添加重置所有筛选按钮 / Add reset all filters button

## 7. 时间线视图 / Timeline View

- [x] 7.1 创建视图切换 UI / Create view toggle UI (Grid/Timeline buttons)
- [x] 7.2 实现时间线视图 CSS 布局 / Implement timeline view CSS layout
- [x] 7.3 在时间线视图中添加日期分组标题 / Add date section headers in timeline view
- [x] 7.4 为时间线视图按时间顺序排序相片 / Sort photos chronologically for timeline view
- [ ] 7.5 持久化视图偏好（可选）/ Persist view preference (optional)

## 8. 灯箱查看器 / Lightbox Viewer

- [x] 8.1 创建灯箱覆盖层 HTML/CSS / Create lightbox overlay HTML/CSS
- [x] 8.2 实现灯箱打开/关闭功能 / Implement lightbox open/close functionality
- [x] 8.3 添加相片导航（下一张/上一张按钮、方向键）/ Add photo navigation (next/previous buttons, arrow keys)
- [x] 8.4 在灯箱中显示相片元数据 / Display photo metadata in lightbox (title, tags, date, camera, settings)
- [x] 8.5 添加键盘快捷键（ESC 关闭、方向键导航）/ Add keyboard shortcuts (ESC to close, arrow keys to navigate)
- [x] 8.6 为移动端添加滑动手势支持 / Add swipe gesture support for mobile

## 9. 集成与完善 / Integration & Polish

- [x] 9.1 从主 index.html 链接到相册 / Link gallery from main index.html
- [x] 9.2 创建示例相片资源并填充 photos.json / Create sample photo assets and populate photos.json
- [ ] 9.3 测试各断点的响应式行为 / Test responsive behavior across breakpoints
- [x] 9.4 优化性能（懒加载、图片尺寸）/ Optimize performance (lazy loading, image sizes)
- [x] 9.5 添加主题配置文档 / Add documentation for theme configuration
- [x] 9.6 添加 photos.json 格式文档 / Add documentation for photos.json format

## 10. 设计调整 / Design Updates

- [x] 10.1 更新设计为深色主题 / Update design to dark theme
- [x] 10.2 添加渐变球体背景效果 / Add gradient orbs background effects
- [x] 10.3 添加颗粒纹理覆盖层 / Add grain texture overlay
- [x] 10.4 更新 theme.config.json 支持深色主题配置 / Update theme.config.json for dark theme
- [x] 10.5 更新 CSS 使用深色配色和毛玻璃效果 / Update CSS with dark colors and glassmorphism
- [x] 10.6 更新 index.html 添加背景效果元素 / Update index.html with background effect elements
- [x] 10.7 更新 js/config.js 支持新配置变量 / Update js/config.js for new config variables
- [x] 10.8 确认 GitHub Pages 兼容性（使用相对路径）/ Confirm GitHub Pages compatibility (relative paths)
- [x] 10.9 更新 README 文档 / Update README documentation
