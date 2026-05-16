# PRD — Tab 1：边框水印

> 参考：https://lookcv.com/
> 优先级：P0（MVP 核心）
> 最后更新：2026-05-16

---

## 一、功能概述

上传照片，自动读取 EXIF 拍摄参数，添加自定义相框（虚化背景 + 圆角 + 阴影）和品牌 LOGO + 拍摄参数水印，一键高质量导出。

**双模式**：
- **Web 模式**：Camera Vision Tab 1 页面，react-konva 实时预览 + 精细参数调节 + 单图导出
- **CLI 模式**：`scripts/watermark-cli.js` 命令行工具，JSON 配置 + 参数覆盖，无需打开浏览器即可批量处理目录照片

核心渲染逻辑（布局计算、虚化、圆角、水印排版）抽离为纯函数，存放于 `src/utils/frame-renderer/`，Web 端（react-konva）和 CLI 端（node-canvas）共享同一套渲染引擎。

## 二、布局

左右分栏：

```
┌─────────────────────────┬────────────────────────────────┐
│                         │  ┌──────────────────────────┐  │
│                         │  │  导入照片 + 缩略图条      │  │
│    Canvas 预览区         │  ├──────────────────────────┤  │
│    (实时渲染照片+        │  │  相机 LOGO 选择          │  │
│     边框+水印)          │  │  型号 / EXIF 参数输入     │  │
│                         │  │  字体 / 颜色 / 字号       │  │
│                         │  │  圆角 / 阴影 / 虚化 滑块  │  │
│                         │  ├──────────────────────────┤  │
│                         │  │  导出当前 │ 导出所有       │  │
│                         │  └──────────────────────────┘  │
└─────────────────────────┴────────────────────────────────┘
```

## 三、功能规格

### 3.1 照片导入

| 功能 | 规格 | 实现 |
|------|------|------|
| 文件选择 | 点击「导入照片」触发 file input | 隐藏 input + 按钮 click |
| 拖拽上传 | 拖拽到预览区 | dragover / drop 事件 |
| 本地读取 | FileReader → DataURL | `FileReader.readAsDataURL()` |
| EXIF 解析 | FocalLength / FNumber / ExposureTime / ISOSpeedRatings | `exifr` |
| 参数格式化 | `35mm f/1.8 1/500 ISO200` | `exif-formatter.ts` |
| 多图导入 | 支持多选 | `<input multiple />` |
| 缩略图条 | 右侧面板顶部水平滚动缩略图行 | ImageImporter 组件 |

### 3.2 Canvas 渲染

技术选型：`react-konva` + `konva`

| 功能 | 规格 |
|------|------|
| 预览画布 | 左侧占满，背景 `var(--color-bg)` |
| 渲染流程 | 清空 Layer → 虚化背景 → 圆角照片(含阴影) → 水印组 |
| 实时预览 | 参数变更 debounce 16ms 后重绘 |
| 自适应 | Stage 根据容器自适应，保持宽高比 |
| 响应式 | ResizeObserver 监听，debounce 重算 |

### 3.3 相框效果

| 参数 | 范围 | 默认 | 控件 |
|------|------|------|------|
| 虚化程度 | 0~200px | 150px | 滑块 |
| 圆角半径 | 0~500px | 40px | 滑块 |
| 阴影偏移 | 0~500px | 100px | 滑块 |

**虚化背景**：原图缩放 → Canvas `filter: blur()` → 绘制到 Konva 底层 → 照片居中绘制在上层。

### 3.4 水印设置

| 参数 | 规格 | 控件 |
|------|------|------|
| 相机 LOGO | 26+ 品牌，弹窗选择 | 按钮 → Grid 浮层 |
| LOGO 变色 | 非 `_full` LOGO 按字体色自动变色 | 自动联动 |
| 型号文字 | 自由输入（如 Z30、A7M4） | Input |
| EXIF 参数 | 自动填充或手动 | Input |
| 字体 | DingTalkSans / Arial / Times New Roman / Georgia / Courier New | Select |
| 字体颜色 | 自由拾色 | `<input type="color" />` |
| 字号 | 0~500px | 滑块 |
| 水印布局 | LOGO + 型号 + 分割线 + EXIF 水平居中于底部 | 自动 |
| 分割线 | 型号与 EXIF 间竖线分隔 | 自动 |

**LOGO 品牌**（26 个）：Nikon / Nikon Full / Canon / Sony / Fujifilm / Hasselblad / Hasselblad-T / Leica / Leica Full / Leica Red Full / RED / RED Full / DJI / Insta360 / Kodak / Lumix / Mamiya / Olympus / Panasonic / Pentax / Phase One / Ricoh / Rolleiflex / Sigma / Tamron / Zeiss Full

### 3.5 导出

| 功能 | 规格 |
|------|------|
| 导出当前 | 原图分辨率 JPG → 浏览器下载（最大 6000px） |
| 批量导出 | 遍历图片列表逐张导出 |
| 导出逻辑 | Stage 设原图尺寸 → `toDataURL({pixelRatio:1})` → 恢复 → 下载 |
| 文件名 | `cameravision-export-{timestamp}.jpg` |

## 四、组件结构

### Web UI 组件

```
src/components/cameravision/FrameWatermark/
├── CanvasPreview.tsx      # Konva 预览画布（WebRenderer 封装）
├── SettingPanel.tsx       # 右侧设置面板
├── LogoSelector.tsx       # LOGO 品牌选择浮层
└── ExportActions.tsx      # 导出按钮组
```

### 共享渲染引擎（Web + CLI 共用）

```
src/utils/frame-renderer/
├── types.ts               # RenderConfig 接口 + 布局类型定义
├── web-renderer.tsx        # Konva 组件包装（仅 Web）
├── node-renderer.ts        # node-canvas 渲染实现（仅 CLI）
├── logo-color.ts           # LOGO 像素级变色（共享）
└── exif-formatter.ts       # EXIF 参数格式化（共享）
```

### CLI 工具

```
scripts/
└── watermark-cli.js        # 命令行批量处理入口
```

## 五、依赖

| 包 | 版本 | 用途 |
|----|------|------|
| `react-konva` | ^18.x | React 封装 Konva（Web 端） |
| `konva` | ^9.x | Canvas 操作引擎（Web 端） |
| `exifr` | ^7.x | EXIF 解析（Web + CLI 共享） |
| `canvas`（node-canvas） | ^9.x | 无头 Canvas 渲染（CLI 端，optionalDependency） |

## 六、关键实现

- **引擎架构**：渲染逻辑分两层 — `RenderConfig`（纯参数定义）+ 双 Renderer（Web: react-konva / CLI: node-canvas），共享布局计算纯函数
- **虚化背景**：离屏 Canvas + `ctx.filter = 'blur(Npx)'` 绘制到 Konva 底层（Web）/ node-canvas filter（CLI）
- **圆角裁切**：Konva.Group + `clipFunc` 圆角矩形路径（Web）/ ctx.clip + roundRect（CLI）
- **LOGO 变色**：ImageData 像素遍历，非透明像素颜色替换，离屏 Canvas 处理，`Map` 缓存
- **原图导出**：临时 Stage 设原图尺寸 → toDataURL → 恢复 → `<a download>`（Web）/ 直接 canvas 输出 JPEG（CLI）
- **CLI 配置**：JSON 配置文件 + 命令行参数双层覆盖（CLI 参数 > JSON > 默认值）
- **CLI 批量**：目录递归遍历，错误隔离（单张失败不中断），进度输出 + 汇总
- **性能**：update debounce 16ms、预览用缩放尺寸、LOGO 变色缓存、ResizeObserver、最大 6000px 限制

## 七、性能

### 7.1 图片分级策略

为减少 Canvas 重绘开销，引入三级图片管道：

| 级别 | 用途 | 分辨率策略 | 加载时机 |
|------|------|-----------|---------|
| **缩略图** | 缩略图条展示 | 最大边 200px | 导入时立即生成 |
| **预览图** | Canvas 实时预览渲染 | 适配 viewport 尺寸（不超过 1200px） | 导入时立即生成 |
| **原图** | 导出使用 | 原始分辨率（限制最大 6000px） | 仅导出时加载 |

**核心原则**：预览过程始终操作预览图，不触碰原图。导出时临时加载原图重新渲染一次。

### 7.2 渲染缓存

| 缓存项 | 缓存键 | 失效条件 |
|-------|--------|---------|
| 虚化背景 | 原图 src + blur 半径 | 图片切换或 blur 半径变更 |
| LOGO 变色 | LOGO 文件名 + 目标色值 | 字体颜色变更或 LOGO 切换 |
| 布局计算结果 | 图片尺寸 + viewport + 参数 | 任何参数或容器尺寸变更 |

### 7.3 React 渲染优化

| 手段 | 目标组件 | 说明 |
|------|---------|------|
| `React.memo` | SettingPanel 内各控件 | 滑块/输入框避免因父组件 state 变更整体重渲染 |
| `useMemo` | 布局计算、LOGO 处理 | 依赖未变时跳过重计算 |
| `useCallback` | 事件处理函数 | 避免子组件因引用变更重渲染 |
| 状态分离 | 预览参数 vs UI 状态 | 预览参数变更触发 Canvas 重绘但不触发面板重渲染 |

### 7.4 虚化背景缓存机制

虚化背景是每次重绘最昂贵的操作（缩放 + 模糊大图）。实施分层缓存：

1. **原图不变**：同张照片下虚化背景只需计算一次，缓存为离屏 Canvas
2. **blur 参数变更**：如果 only blur 半径变，只需重新 filter，不重新缩放
3. **LOGO/文字变更**：仅重绘水印层，不重绘虚化背景和照片层

Konva 分层：虚化 Layer + 照片 Layer + 水印 Layer，三层独立更新。

### 7.5 大图处理

| 场景 | 限制 |
|------|------|
| 导入时读取 | 预览图缩放至 1200px 以内 |
| Canvas 渲染 | 始终使用预览图 |
| 导出时 | 加载原图（最大 6000px），若超过则提示用户强制缩至 6000px |
| CLI 处理 | `--max-dimension` 参数控制（默认 6000px） |

### 7.6 内存管理

- 缩略图导出后释放 DataURL，保留预览图数据用于 Canvas
- 切换照片时主动销毁旧 Layer 上的 Konva Image 节点
- 批量导入多图时，非当前编辑照片仅保留缩略图，预览图按需加载
- CLI 批量处理逐张读取 → 渲染 → 写入 → 释放，避免累积占用

### 7.7 首屏加载

| 措施 | 说明 |
|------|------|
| React.lazy | FrameWatermark 整包懒加载，不影响 CameraVision TabBar 首次渲染 |
| 依赖分包 | konva / react-konva 随 FrameWatermark 一起懒加载 |
| CLI 不引入 React | watermark-cli.js 纯 Node 脚本，零前端依赖 |

## 八、迭代计划

### MVP（Phase 1）

- [ ] 页面骨架 + 左右分栏
- [ ] 照片导入（单图 + 拖拽）
- [ ] EXIF 自动解析 + 参数填充
- [ ] Canvas 预览（虚化 + 圆角 + 阴影）
- [ ] 水印渲染（LOGO + 型号 + EXIF + 字体/颜色/字号）
- [ ] 单图高质量导出
- [ ] 核心渲染引擎抽离为共享纯函数（`frame-renderer/`）
- [ ] CLI 批量处理工具（目录遍历 + JSON 配置 + 参数覆盖 + 进度反馈）

### 增强（Phase 2~3）

- [ ] 多图导入 + 缩略图切换
- [ ] 批量导出
- [ ] 预设模板（3~5 套风格一键切换）
- [ ] 导出格式可选（JPG / PNG / WebP）
- [ ] 更多相框样式（纯色边框、渐变边框）
- [ ] 水印位置可拖拽
- [ ] 自定义 LOGO 上传
- [ ] 摄影集 lightbox 联动

## 九、风险

| 风险 | 缓解 |
|------|------|
| EXIF 被社交平台剥离 | 手动输入兜底 |
| 大图内存溢出 | 限制最大 6000px |
| `react-konva` 包体积 | React.lazy 路由懒加载 |
| LOGO 品牌版权 | 仅个人站展示，不商用 |
| node-canvas 编译原生模块 | optionalDependency，不会阻塞 Web 端安装 |
| CLI/Web 渲染效果差异 | 共享布局纯函数，差异仅在于绘图 API 层 |

---

_文档版本：v1.0 | 最后更新：2026-05-03_
