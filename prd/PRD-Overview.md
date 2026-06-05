# Camera Vision — 产品总览

> 摄影爱好者的在线工具箱 | 纯前端 · 零安装 · 免费
> 生成日期：2026-05-03

---

## 一、产品定位

面向摄影爱好者的**在线工具箱**——覆盖从拍摄规划到社交分享的全流程：黄金时刻计算、景深/ND滤镜计算、EXIF 解析、照片边框水印、社交平台裁切预览，纯浏览器运行，零安装。

**差异化** = 全流程 + 零安装 + 免费 + 中国社交平台适配

## 二、项目架构

| 维度 | 现状 |
|------|------|
| 技术栈 | React 18 + TypeScript 5 + Vite 5 |
| 路由 | React Router DOM 6（HashRouter） |
| 样式 | CSS 变量主题体系 + inline styles |
| 字体 | JetBrains Mono / Playfair Display / Noto Sans SC |
| 色彩 | `#050810` 背景、`#2474a6` / `#4ecdc4` 渐变、`#d2fffe` 文字 |
| 现有页面 | Home → ColorWalk → PhotoGallery |
| 部署 | GitHub Pages（`docs/` 目录） |

## 三、模块拆分

Camera Vision 采用 **Tab 工具箱模式**，每个 Tab 对应独立 PRD：

| Tab | 名称 | PRD 文档 | 优先级 | 依赖 | 模式 |
|-----|------|---------|--------|------|------|
| Tab 1 | 边框水印 | [PRD-Tab1-FrameWatermark.md](PRD-Tab1-FrameWatermark.md) | P0 | konva, react-konva, exifr | Web UI + CLI 工具 |
| Tab 2 | EXIF 分析 | [PRD-Tab2-ExifAnalyzer.md](PRD-Tab2-ExifAnalyzer.md) | P1 | exifr | Web UI |
| Tab 3 | 拍摄方案 | [PRD-Tab3-ShootingPlan.md](PRD-Tab3-ShootingPlan.md) | P1 | — | Web UI |
| Tab 4 | 拍摄计算器 | [PRD-Tab4-PhotoCalculator.md](PRD-Tab4-PhotoCalculator.md) | P1 | suncalc | Web UI |

## 四、页面布局

```
┌──────────────────────────────────────────────────────────────┐
│  Header (fixed)  [Camera Vision]               [← Back Home] │
├──────────────────────────────────────────────────────────────┤
│  [边框水印]  [EXIF 分析]  [拍摄方案]  [拍摄计算器]            │
├──────────────────────────────────────────────────────────────┤
│              当前 Tab 对应的功能区（每个 Tab 独立布局）         │
├──────────────────────────────────────────────────────────────┤
│  Footer                                                       │
└──────────────────────────────────────────────────────────────┘
```

## 五、路由

```
/cameravision → CameraVision 页面（内部 Tab 路由）
```

App.tsx 新增：
```tsx
const CameraVision = React.lazy(() => import('./pages/CameraVision'));
<Route path="/cameravision" element={<CameraVision />} />
```

Home.tsx 替换 placeholder 卡片：
```tsx
<ProjectCard
  to="/cameravision"
  type="Web Tool"
  title="Camera Vision"
  description="在线照片边框水印工具，自动读取 EXIF 拍摄参数，添加品牌 LOGO 与自定义水印。"
  emoji="🖼"
  ctaText="开始使用"
/>
```

## 六、设计规范（全局共享）

### 6.1 色彩

| 角色 | 色值 | 用途 |
|------|------|------|
| 背景 | `var(--color-bg)` #050810 | 页面/预览区背景 |
| 面板背景 | `var(--color-bg-elevated)` rgba(36,116,166,0.08) | 设置面板 |
| 品牌主色 | `var(--color-accent)` #2474a6 | 按钮主色、焦点 |
| 强调色 | `var(--color-accent-secondary)` #4ecdc4 | 次要操作、选中态 |
| 主文字 | `var(--color-text-primary)` #d2fffe | 标题、内容 |
| 次文字 | `var(--color-text-secondary)` rgba(210,255,254,0.65) | 描述 |
| 边框 | `var(--color-border)` rgba(210,255,254,0.12) | 面板/输入边框 |

### 6.2 字体

| 用途 | 字体栈 |
|------|--------|
| 标题 | `'Playfair Display', Georgia, serif` |
| 等宽标签 | `'JetBrains Mono', monospace` |
| 正文/面板 | `'Noto Sans SC', -apple-system, sans-serif` |

### 6.3 组件风格

| 元素 | 规范 |
|------|------|
| 按钮 | 圆角 8px、背景 accent、hover glow |
| 滑块 | 轨道 border 色、thumb accent-secondary 色 |
| Input | 透明背景、底部边框、focus 高亮 accent |
| Select | 深色下拉、选中态 accent-secondary |
| 面板 | bg-elevated 背景、border 边框、radius-lg 圆角 |
| 浮层 | 居中弹窗、bg 背景 + blur、边框 glow |

### 6.4 动画

| 交互 | 动画 |
|------|------|
| 参数变更 | debounce 16ms |
| 按钮 hover | glow + 微上移 |
| 浮层出现 | fade-in + scale(0.95→1) |
| 导出加载 | loading 旋转 |
| 页面进入 | fade-in-up 0.8s |

## 七、跨 Tab 联动

```
Tab 4 (计算器) ──→ Tab 3 (拍摄方案) ──→ 实际拍摄 ──→ Tab 2 (EXIF 分析) ──→ Tab 1 (边框水印)
                      ↑                           ↑
                拍摄前找灵感                  拍完复盘参考
```

**摄影集联动**：PhotoGallery lightbox 增加「Camera Vision 编辑」入口，通过路由 state 传递照片 URL + EXIF。

## 八、文件结构

```
src/
├── pages/
│   └── CameraVision.tsx               # 主页面（Tab 路由 + 布局）
├── components/
│   └── cameravision/
│       ├── FrameWatermark/             # Tab 1（见 Tab1 PRD）
│       ├── ExifAnalyzer/              # Tab 2（见 Tab2 PRD）
│       ├── ShootingPlan/               # Tab 3（见 Tab3 PRD）
│       ├── PhotoCalculator/           # Tab 4（见 Tab4 PRD）
│       └── shared/
│           ├── ImageImporter.tsx       # 照片导入 + 拖拽上传
│           └── TabBar.tsx             # Tab 切换栏
├── hooks/
│   ├── useExifParser.ts               # EXIF 解析 hook
│   └── useImageConfig.ts              # 图片配置状态管理
├── utils/
│   ├── frame-renderer/                # 核心渲染引擎（Web + CLI 共享）
│   │   ├── types.ts                   # RenderConfig 接口 + 布局类型
│   │   ├── web-renderer.tsx           # Konva 组件包装（仅 Web）
│   │   ├── node-renderer.ts           # node-canvas 渲染（仅 CLI）
│   │   ├── logo-color.ts              # LOGO 像素级变色
│   │   └── exif-formatter.ts          # EXIF 参数格式化
│   ├── canvas-render.ts               # Canvas 渲染核心（备用层）
│   ├── logo-color.ts                  # LOGO 像素级变色
│   └── exif-formatter.ts              # EXIF 参数格式化
├── data/
│   ├── camera-logos.ts                # LOGO 品牌元数据
│   ├── crop-presets.ts                # 平台裁切预设
│   ├── sensor-sizes.ts               # 传感器尺寸 + 弥散圆
│   ├── focal-length-guide.ts         # 焦段推荐映射表 + 距离矩阵
│   └── fujinon-lenses.ts             # 富士原生 + 副厂镜头参考列表
├── assets/
│   └── logos/                          # 相机品牌 LOGO（26+ PNG）
└── scripts/                            # CLI 工具
    └── watermark-cli.js                # 命令行批量边框水印处理
```

## 九、迭代路线图

| Phase | 内容 | 对应 PRD |
|-------|------|---------|
| 1 | 页面骨架 + Tab 1 边框水印 MVP | Overview + Tab1 |
| 2 | Tab 2 EXIF 分析 + Tab 3 裁切预览 | Tab2 + Tab3 |
| 3 | Tab 4 拍摄计算器（富士 APS-C 优先）+ Tab 1/2 增强 | Tab4 + Tab1/2 增强 |
| 4 | 精细化：月相、收藏、镜头库、联动 | 全部 |

## 十、非功能需求

| 维度 | 要求 |
|------|------|
| 性能 | 4K 照片渲染 < 2s，参数调整响应 < 100ms |
| 兼容性 | Chrome 90+、Safari 15+、Firefox 90+、Edge 90+ |
| 安全 | 照片纯客户端处理，不上传服务器 |
| 隐私 | 无用户数据收集 |
| 可访问性 | 表单标签关联、键盘操作、ARIA 标注 |
| 包体积 | 所有新依赖按需懒加载，不影响首页速度 |

## 十一、风险

| 风险 | 缓解 |
|------|------|
| 新依赖包体积 | React.lazy 路由懒加载 |
| LOGO 品牌版权 | 仅个人站展示，不商用 |
| 功能过于分散 | 优先打磨 Tab 1，其他 Tab 逐步完善 |
| 移动端 Canvas 性能 | Phase 4 考虑降级方案 |
| 镜头数据维护 | 首批覆盖富士主流原生，副厂社区贡献 |
| CLI/Web 渲染差异 | 共享布局纯函数，差异仅绘图 API 层 |
| node-canvas 原生编译 | optionalDependency 不阻塞 Web 端 |

---

_文档版本：v1.1 | 最后更新：2026-05-16_
