## 1. 项目初始化与目录结构

- [x] 1.1 创建 `src/components/cameravision/ExifAnalyzer/` 组件目录
- [x] 1.2 创建 `src/utils/histogram.ts`、`src/utils/color-extract.ts`、`src/utils/photo-entry-formatter.ts` 工具模块
- [x] 1.3 创建 `src/data/camera-aliases.ts` 品牌别名映射数据文件

## 2. 工具模块

- [x] 2.1 实现 `histogram.ts`：Canvas `getImageData` 逐像素统计 R/G/B/Luminance 256 级分布，支持 4K+ 大图降采样至 2000px
- [x] 2.2 实现 `histogram.ts`：过曝/欠曝检测函数，返回像素占比百分比和遮罩区域数据
- [x] 2.3 实现 `color-extract.ts`：轻量 k-means 聚类（k=5，最大迭代 20 次，RGB Euclidean 距离），输入降采样至 200px
- [x] 2.4 实现 `color-extract.ts`：色彩导出函数（CSS 变量格式 / Tailwind 配置格式）
- [x] 2.5 实现 `photo-entry-formatter.ts`：EXIF → PhotoEntry 自动映射纯函数，含兜底值处理
- [x] 2.6 实现 `camera-aliases.ts`：主流相机品牌别名映射表（Sony/Nikon/Canon/Fujifilm/Ricoh/Leica 等）

## 3. EXIF 全量解析面板

- [x] 3.1 实现 `useExifParser.ts` hook：调用 `exifr.parse()` 全量解析，按类别分组返回结构化数据
- [x] 3.2 实现 `ExifPanel.tsx`：分组展示 EXIF 字段（相机/曝光/镜头/GPS/时间/其他），字段名中文标签
- [x] 3.3 实现参数一键复制功能：格式化全部字段为文本，`navigator.clipboard.writeText()` 调用
- [x] 3.4 处理无 EXIF 状态：显示"该照片不含 EXIF 信息"提示

## 4. 直方图

- [x] 4.1 实现 `Histogram.tsx`：Canvas 2D API 绘制 RGB 三通道 + 亮度曲线，含坐标轴和网格
- [x] 4.2 实现过曝警告：像素阈值检测（≥250），红色半透明闪烁遮罩叠加，显示过曝占比
- [x] 4.3 实现欠曝警告：像素阈值检测（≤5），蓝色半透明闪烁遮罩叠加，显示欠曝占比

## 5. 色彩提取

- [x] 5.1 实现 `ColorExtractor.tsx`：展示 5 主色色块 + hex 值，按聚类数量排序
- [x] 5.2 实现点击复制 hex 值：`navigator.clipboard.writeText()` + "已复制"反馈
- [x] 5.3 实现色彩导出：CSS 变量 / Tailwind 配置格式复制

## 6. PhotoEntry 格式化

- [x] 6.1 实现 `PhotoEntryEditor.tsx`：展示 PhotoEntry 所有字段，自动字段只读，手动字段可编辑
- [x] 6.2 实现 Tags 输入组件：Enter/逗号添加标签，pill 样式 + × 删除
- [x] 6.3 实现 JSON 实时预览：代码高亮（JetBrains Mono），随字段变更更新
- [x] 6.4 实现 JSON 复制与下载：`clipboard.writeText()` + Blob `<a download>`

## 7. EXIF 隐私擦除

- [x] 7.1 实现隐私擦除导出：Canvas 重绘 → `canvas.toBlob('image/jpeg')` → `<a download>`
- [x] 7.2 实现导出加载态和异常处理

## 8. ExifAnalyzer 容器与集成

- [x] 8.1 实现 `ExifAnalyzer.tsx` 容器组件：状态管理（useReducer），数据流转（upload → parse → analyze → format）
- [x] 8.2 集成拖拽上传区（复用 `ImageImporter.tsx`）：左上传预览 + 右侧信息面板布局
- [x] 8.3 实现响应式布局：桌面端左右分栏（768px+）→ 移动端上下堆叠
- [x] 8.4 在 CameraVision TabBar 中注册 ExifAnalyzer 组件，替换占位符
- [x] 8.5 使用 React.lazy 懒加载 ExifAnalyzer，避免阻塞首页加载
- [x] 8.6 验证各 edge case：无 EXIF 照片、大图性能、空状态、移动端适配
- [x] 8.7 清理调试代码（console.log/debugger）
