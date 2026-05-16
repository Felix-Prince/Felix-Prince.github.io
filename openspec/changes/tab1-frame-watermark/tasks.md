## 1. 项目初始化与依赖

- [x] 1.1 在 package.json 中添加 `konva`、`react-konva`、`exifr` 依赖
- [x] 1.2 在 package.json 中添加 `canvas`（node-canvas）为 optionalDependency
- [x] 1.3 创建目录结构：`src/utils/frame-renderer/` 和 `scripts/`
- [x] 1.4 创建 `src/utils/frame-renderer/types.ts`，定义统一的 RenderConfig 接口和布局类型

## 2. 核心渲染引擎 — 布局与共享逻辑

- [x] 2.1 实现布局计算纯函数：`calcLayout(config, imageSize, viewportSize)`，返回 blurRegion、photoRect、shadowOffset、watermarkPosition
- [x] 2.2 实现 `exif-formatter.ts`：将 EXIF 格式化为 `35mm f/1.8 1/500 ISO200` 字符串，快门速度自动分数处理
- [x] 2.3 实现 `logo-color.ts`：离屏 Canvas + ImageData 像素级 LOGO 颜色替换（非透明像素色调/明度变换）
- [x] 2.4 添加 LOGO 变色缓存 `Map<string, HTMLCanvasElement>`，避免重复处理

## 3. 核心渲染引擎 — Web 端（react-konva）

- [x] 3.1 实现 `WebRenderer` 组件：Konva Stage 包装 + ResizeObserver 自适应
- [x] 3.2 实现虚化背景层：离屏 Canvas + `ctx.filter = 'blur(Npx)'` → Konva Image 层
- [x] 3.3 实现圆角照片层：Konva.Group + clipFunc 圆角矩形路径绘制 + 阴影
- [x] 3.4 实现水印组：LOGO 图片 + 型号文字 + 分割线 + EXIF 文字，底部水平居中布局
- [x] 3.5 参数变更连接 debounce（16ms）自动重绘

## 4. 核心渲染引擎 — Node 端（node-canvas）

- [x] 4.1 实现 `NodeRenderer` 类，遵循统一的 RenderConfig 接口
- [x] 4.2 使用 node-canvas API 实现虚化背景 + 圆角裁切 + 阴影偏移
- [x] 4.3 使用 node-canvas 实现水印文字和 LOGO 渲染
- [x] 4.4 输出为 JPEG 文件，支持最大尺寸限制

## 5. Web UI — 组件开发

- [x] 5.1 实现 `CanvasPreview.tsx`：Konva Stage 包装器，包含加载态、空态和自适应尺寸
- [x] 5.2 实现 `SettingPanel.tsx`：右侧面板，包含导入区域、缩略图条、所有参数滑块和输入框
- [x] 5.3 实现 `LogoSelector.tsx`：Grid 弹窗选择 26+ 相机品牌 LOGO
- [x] 5.4 实现 `ExportActions.tsx`：导出按钮组和进度指示
- [x] 5.5 组装 `FrameWatermark` 容器组件：状态管理、参数流转、照片列表管理
- [x] 5.6 实现响应式布局：桌面端左右分栏（768px+）→ 移动端上下堆叠

## 6. Web UI — 照片导入

- [x] 6.1 实现隐藏 file input + 按钮点击触发，支持 `<input multiple />` 多选
- [x] 6.2 实现拖拽上传区域：dragover/drop 事件处理，文件类型校验
- [x] 6.3 实现 `FileReader.readAsDataURL()` 流程，将图片数据 URL 存入状态
- [x] 6.4 实现缩略图条：水平滚动，每张导入照片显示小尺寸预览，点击切换

## 7. Web UI — EXIF 集成

- [x] 7.1 照片导入时调用 `exifr.parse()` 解析 EXIF，提取 FocalLength/FNumber/ExposureTime/ISOSpeedRatings
- [x] 7.2 将格式化后的 EXIF 字符串自动填入水印参数
- [x] 7.3 在 SettingPanel 中添加每个 EXIF 字段的手动覆盖输入框
- [x] 7.4 处理无 EXIF / EXIF 缺失的情况：显示空字段，允许手动输入

## 8. 性能优化 — 图片分级与缓存

- [x] 8.1 导入时生成三级图片：缩略图（200px）、预览图（max 1200px）、保留原图引用
- [x] 8.2 Canvas 预览始终使用预览图渲染，不直接操作原图
- [x] 8.3 实现虚化背景离屏 Canvas 缓存：同一照片 + 同一 blur 半径复用缓存
- [x] 8.4 实现 Konva 三层分离（虚化背景 Layer / 照片 Layer / 水印 Layer），按需更新

## 9. 性能优化 — React 渲染优化

- [x] 9.1 状态分离：预览参数 state 与 UI 交互 state 分开管理
- [x] 9.2 SettingPanel 内滑块组件包裹 React.memo，避免连带重渲染
- [x] 9.3 布局计算 calcLayout 使用 useMemo，依赖未变跳过重算
- [x] 9.4 Param 变更回调使用 useCallback，稳定引用

## 10. 性能优化 — 内存管理

- [x] 10.1 照片切换时主动销毁旧 Konva Image 节点，释放 GPU 内存
- [x] 10.2 非当前编辑照片仅保留缩略图 DataURL，预览图按需加载
- [x] 10.3 CLI 批量处理逐张读取→渲染→写入→释放，不累积内存

## 11. Web UI — 导出功能

- [x] 11.1 实现单图导出（原图路径）：加载原图 → 一次性渲染 → toDataURL → `<a download>` 触发下载
- [x] 11.2 限制最大 6000px 导出尺寸，超出时提示用户并自动缩放
- [x] 11.3 导出完成后释放临时 Stage，清理原图引用

## 12. CLI 批量处理工具

- [x] 12.1 实现 `scripts/watermark-cli.js` 入口，支持参数解析
- [x] 12.2 实现 JSON 配置文件读取 + 字段校验
- [x] 12.3 实现命令行参数覆盖逻辑（CLI 参数 > JSON 配置 > 默认值）
- [x] 12.4 实现目录递归遍历（jpg/png/webp）和单文件处理
- [x] 12.5 实现批量处理循环，显示进度 `[3/10] filename.jpg`
- [x] 12.6 实现错误隔离（单张照片处理失败不影响其他照片）
- [x] 12.7 处理完成后汇总输出：`处理完成: 8成功, 2失败`
- [x] 12.8 支持 `--suffix` 自定义输出文件名后缀

## 13. 集成与收尾

- [x] 13.1 在 CameraVision TabBar 路由中注册 Tab 1 组件
- [x] 13.2 使用 React.lazy 懒加载 Tab 1，避免阻塞首页加载
- [x] 13.3 验证响应式布局在 375px、768px、1440px 断点下的表现
- [x] 13.4 测试导出画质对比（预览 vs 导出的全分辨率图）
- [x] 13.5 性能验证：4K 照片参数调节流畅度 ≥ 30fps，首次渲染 < 2s
- [x] 13.6 清理调试代码（console.log/debugger）
