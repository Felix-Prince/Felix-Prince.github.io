## Context

Camera Vision 目前仅有页面骨架（Tab 路由 + 布局），Tab 1 边框水印需要从零实现。项目技术栈为 React 18 + TypeScript 5 + Vite 5，样式使用 CSS 变量主题体系。Tab 1 核心是利用 Canvas 在照片上叠加相框和水印并导出。

用户额外要求在核心渲染逻辑上做双层架构：抽离纯工具函数供 Web UI 和 CLI 脚本共同调用，满足日常快速批量处理的需求。

## Goals / Non-Goals

**Goals:**
- 核心渲染逻辑（虚化背景、圆角裁切、阴影、水印排版）抽离为纯函数，UI 无关
- Web 端通过 react-konva 提供实时交互预览和单图/批量导出
- CLI 端通过 node-canvas 实现无头批量处理
- Web 端用于精细调节（每次处理一张），CLI 端用于目录级别的快速批量处理
- 全部在浏览器/本地完成，不上传服务器

**Non-Goals:**
- 不涉及云端存储或用户系统
- 不涉及用户登录/认证
- Phase 1 不实现多图缩略图切换和批量导出（留到 Phase 2~3）
- 不实现预设模板、水印位置拖拽、自定义 LOGO 上传

## Decisions

**1. 核心引擎双路径架构**
- 将相框+水印渲染拆为两层：`RenderConfig`（参数定义）+ `Renderer`（渲染实现）
- 定义统一的 `RenderConfig` 接口，描述所有参数（虚化、圆角、阴影、LOGO、文字等）
- Web 端用 Konva.Stage 实现 Renderer（通过 `react-konva`）
- CLI 端用 node-canvas 实现同一套 Renderer 接口
- 替代方案：统一用 Canvas 2D API 手动绘制。否决原因：Web 端需要实时交互预览，Konva 的声明式 API 更适合 React 集成和增量更新
- 替代方案：CLI 端用 Puppeteer 无头浏览器跑 Web 版。否决原因：太重，node-canvas 更轻量且适合批处理场景

**2. 三级图片管道（性能核心）**
- 导入时立即生成三级图片：缩略图（200px）→ 预览图（1200px）→ 原图（max 6000px）
- 预览过程始终操作预览图，不触碰原图尺寸
- 导出时临时加载原图渲染一次后立即释放
- 替代方案：始终用原图渲染。否决原因：4K 照片（~4000px）每次重绘缩放开销大，拖动滑块会卡顿

**3. 分层渲染与缓存**
- Konva 分三层 Layer：虚化背景 Layer + 照片 Layer + 水印 Layer
- 仅变更的 Layer 独立更新，不重绘全部
- 虚化背景缓存为离屏 Canvas，仅照片 src 或 blur 半径变更时重建
- LOGO 变色缓存 `Map<logo+color, ImageData>`，避免像素遍历重复执行
- 布局计算 `calcLayout` 纯函数，依赖未变时 memo 化

**4. React 渲染优化**
- 状态分离：预览参数 state 与面板 UI state 分开管理
- SettingPanel 内滑块/选择器用 React.memo 包裹
- 避免因父组件重渲染导致 Konva Stage 重建

**5. EXIF 解析共享**
- 使用 `exifr` 解析，结果格式化为统一字符串 `focalLength fNumber exposureTime ISO`
- Web 和 CLI 共享同一套格式化逻辑 `exif-formatter.ts`
- 用户在 Web 端可手动覆盖 EXIF 参数，CLI 端通过 JSON 配置传入

**6. LOGO 变色方案**
- 非 `_full` 的 LOGO 图需要按字体色变色
- 离屏 Canvas + ImageData 像素遍历，非透明像素替换为目标色（保留透明度）
- 缓存在 `Map<string, ImageData>` 中避免重复处理

**7. 导出策略**
- 单图导出：临时 Konva Stage 设原图分辨率 → toDataURL → 下载
- CLI 批量：遍历目录，对每张照片应用 Renderer → 写入输出目录
- 最大限制 6000px 避免内存溢出

**8. 文件结构**
- `src/utils/frame-renderer/` — 核心渲染引擎（UI 无关）
  - `types.ts` — RenderConfig 接口定义
  - `web-renderer.tsx` — Konva 组件包装
  - `node-renderer.ts` — node-canvas 实现
  - `logo-color.ts` — LOGO 变色
  - `exif-formatter.ts` — EXIF 格式化
- `src/components/cameravision/FrameWatermark/` — Web UI 组件
- `scripts/watermark-cli.js` — CLI 入口

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| node-canvas 在部分系统需要编译原生模块 | 通过 optionalDependencies 处理，非必需依赖 |
| 大图（>6000px）内存溢出 | 读取时缩放到最大 6000px，CLI 添加 `--max-dimension` 参数 |
| CLI 和 Web 渲染效果有细微差异 | 核心算法统一为纯函数，双端调用同一套 layout 计算逻辑，差异仅在于绘图 API |
| EXIF 信息被社交平台剥离 | 保留手动输入兜底 |
| `react-konva` + `konva` 包体积 | React.lazy 路由懒加载，不影响首页 |
