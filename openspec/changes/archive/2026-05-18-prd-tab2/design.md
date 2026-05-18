## Context

Camera Vision Tab 2（EXIF 分析）目前仅显示"即将上线"占位符。Tab 1 边框水印已完整实现并引入了 `exifr` 依赖。Tab 2 需在现有架构下从零实现，复用 Tab 1 已有的 `ImageImporter` 拖拽上传组件和 `exifr` 依赖，遵循同一套蓝紫色设计规范。

## Goals / Non-Goals

**Goals:**
- 完整 EXIF 元数据解析与分组展示（相机/曝光/镜头/GPS/时间/其他）
- RGB 三通道 + 亮度直方图 Canvas 渲染，含过曝/欠曝警告
- k-means 色彩提取（5 主色 + hex），点击复制
- EXIF → PhotoEntry 自动映射 + 手动编辑 + JSON 预览/导出
- EXIF 隐私擦除导出
- 全部纯客户端处理，照片不上传服务器

**Non-Goals:**
- 不涉及 GPS 地图展示（已从 PRD 移除，Leaflet 依赖过重）
- 不涉及多照片 EXIF 对比（Phase 3）
- 不涉及批量格式化多张合并（Phase 3）
- 不涉及 tags 智能建议（Phase 3）
- 不修改 Tab 1 现有逻辑

## Decisions

**1. 复用现有架构与依赖**
- 直接复用 `exifr`（Tab 1 已引入 ^7.x），全量解析 EXIF
- 复用 `ImageImporter` 组件做照片拖拽上传
- 遵循现有 CSS 变量体系（`--color-accent`、`--color-bg-elevated` 等）
- 替代方案：引入新 EXIF 库。否决原因：exifr 已满足全量解析需求，避免重复依赖

**2. Canvas-based 直方图**
- 使用 Canvas `getImageData` 逐像素统计 R/G/B/Luminance 256 级分布
- 4K+ 大图先缩放至 2000px 宽再统计，避免性能问题
- 过曝/欠曝警告：像素级阈值检测（≥250 / ≤5），Canvas 叠加层红色/蓝色闪烁标注
- 替代方案：WebGL 或 offscreenCanvas。否决原因：直方图计算是单次操作，Canvas 2D 已足够且实现更简单

**3. 轻量 k-means 聚类**
- 自实现轻量 k-means（约 50 行），不引入第三方库
- 降采样至 200px 宽后再聚类，减少像素量
- k=5，迭代上限 20 次，距离采用 RGB Euclidean
- 替代方案：引入 `color-thief` 或 `vibrant.js`。否决原因：k-means 实现简单且完全可控，不增加包体积

**4. 组件状态管理**
- ExifAnalyzer 容器组件管理所有状态（photoFile, exifData, histogramData, colors, photoEntry）
- 使用 useReducer 管理复杂状态流转：idle → loading → parsed → editing
- 各子组件为纯展示组件（受控），通过 props 接收数据
- 状态不提升到 CameraVision 父组件，Tab 2 保持独立

**5. PhotoEntry 格式化架构**
- `photo-entry-formatter.ts` 纯函数：接收 exifData + userInputs → PhotoEntry
- 品牌别名映射独立为 `camera-aliases.ts` 数据文件
- `PhotoEntryEditor` 组件管理手动字段的编辑状态
- JSON 预览实时响应字段变更

**6. EXIF 隐私擦除策略**
- Canvas 重绘：将照片绘制到 Canvas 上 → `canvas.toBlob('image/jpeg')` 自然剥离全部元数据
- 不依赖专用 EXIF 剥离库，零额外依赖
- 文件名：`cameravision-noexif-{timestamp}.jpg`

**7. 响应式布局**
- 桌面端（≥768px）：左侧上传区（~40%）+ 右侧信息面板（~60%，含多 tab 或滚动）
- 移动端（<768px）：上下堆叠，上传区 → EXIF 信息 → 直方图 → 色彩 → 导出
- 右侧信息面板使用局部滚动，避免页面整体过长

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 大图直方图计算卡顿 | 4K+ 降采样至 2000px，web worker 可后续优化 |
| k-means 聚类颜色不准 | k=5 迭代 20 次，降采样至 200px，对摄影照片效果已足够 |
| EXIF 字段不标准（不同相机厂商差异） | exifr 兼容性好，兜底显示原始 gps 标签名 |
| 无 EXIF 的照片 | 显示"该照片不含 EXIF 信息"提示，功能面板置灰 |
| 移动端 Canvas 性能 | 直方图/色彩在移动端降低采样率 |
