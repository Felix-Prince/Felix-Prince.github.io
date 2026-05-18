## Why

Camera Vision Tab 2（EXIF 分析）是 P1 功能，目前 Tab 路由已定义但显示"即将上线"占位符。摄影爱好者在拍摄后需要快速查看照片的完整 EXIF 元数据、分析曝光直方图、提取色彩并格式化导出为结构化数据。纯客户端处理，零隐私风险。

## What Changes

- 在 CameraVision 页面中实现 Tab 2 EXIF 分析全部功能
- 左侧照片拖拽上传区 + 缩略图预览
- 右侧面板分组展示完整 EXIF 元数据（相机/曝光/镜头/GPS/时间）
- RGB 三通道 + 亮度直方图，Canvas 像素级统计
- 过曝（≥250）/ 欠曝（≤5）像素区域标注警告
- 色彩提取：k-means 聚类提取 5 主色 + hex 值展示与复制
- EXIF → PhotoEntry 自动格式化（映射 `photos.json` 结构），支持手动字段编辑
- JSON 预览 + 复制/下载
- EXIF 隐私擦除导出（Canvas 重绘剥离元数据）
- 遵循 Camera Vision 现有设计规范（蓝紫色主题、字体、面板样式）

## Capabilities

### New Capabilities

- `histogram`: RGB 三通道 + 亮度直方图统计与渲染，含大图降采样（4K+ 缩至 2000px）、过曝/欠曝像素阈值检测与 Canvas 叠加层标注
- `color-extraction`: k-means 聚类提取 5 主色 + hex 值展示，点击复制色值，导出为 CSS 变量 / Tailwind 配置 / 色卡图片
- `photo-entry-format`: EXIF → PhotoEntry 自动映射（`photos.json` 结构），含品牌别名映射表，手动字段内联编辑，JSON 预览 + 复制/下载
- `exif-privacy-erase`: Canvas 重绘剥离全部 EXIF 元数据导出为 JPG，保护隐私

### Modified Capabilities

- `exif-parsing`: 现有 spec 仅覆盖 Tab 1 水印所需的 4 字段（FocalLength/FNumber/ExposureTime/ISOSpeedRatings）。Tab 2 需要全量 EXIF 解析：相机型号、镜头、光圈、快门、ISO、焦距、白平衡、测光模式、闪光灯、拍摄时间、软件、GPS 坐标文本，并按类别分组展示。同时新增参数一键复制功能。

## Impact

- **新增组件**：`src/components/cameravision/ExifAnalyzer/` 下 4 个组件（ExifPanel, Histogram, ColorExtractor, PhotoEntryEditor）
- **新增工具函数**：`src/utils/histogram.ts`、`src/utils/color-extract.ts`、`src/utils/photo-entry-formatter.ts`
- **新增数据文件**：`src/data/camera-aliases.ts`（相机型号别名映射表）
- **现有依赖**：`exifr`（Tab 1 已引入）可复用
- **Tab 路由**：在 CameraVision TabBar 中注册 ExifAnalyzer 组件，替换占位符
- **性能**：4K 大图降采样至 2000px 后再统计直方图；k-means 降采样后聚类
- **包体积**：所有新组件通过 React.lazy 懒加载
