## Why

Camera Vision 的 Tab 1 边框水印是 MVP 核心功能（P0），用户上传照片后自动读取 EXIF 添加相框和水印并导出。同时，日常场景中用户希望无需打开浏览器，直接在文件目录中通过命令行快速批量添加统一边框水印。因此需要将核心渲染逻辑抽取为独立的工具函数，同时服务 Web UI 和 CLI 两种使用方式。

## What Changes

- 抽取核心边框水印逻辑为独立工具函数，与 UI 解耦，同时被 Web 页面和 CLI 脚本调用
- 在 CameraVision 页面中实现 Tab 1 边框水印全部功能
- 左侧 Canvas 实时预览区（react-konva 渲染照片、边框、水印）
- 右侧设置面板（导入照片、参数调节、LOGO 选择、导出）
- 照片导入：文件选择 + 拖拽上传 + 多图支持 + 缩略图条
- EXIF 自动解析并格式化为拍摄参数字符串
- 相框效果：虚化背景、圆角裁切、阴影偏移
- 水印渲染：品牌 LOGO + 型号文字 + 分割线 + EXIF 参数，水平居中于底部
- 单图/批量导出为原图分辨率 JPG
- 新增 CLI 脚本，接收目录/文件参数 + 配置，直接批量处理照片输出结果
- 新增 `react-konva`、`konva`、`exifr` 依赖。CLI 模式下使用 `canvas` (node-canvas) 实现无头渲染

## Capabilities

### New Capabilities
- `photo-import`: 照片导入，支持文件选择、拖拽上传、多图选择、缩略图条展示和切换
- `exif-parsing`: EXIF 自动解析（焦距/光圈/快门/ISO），格式化拍摄参数字符串，Web 和 CLI 共享
- `canvas-preview`: Konva Canvas 实时预览，自适应容器，响应式 ResizeObserver（仅 Web）
- `frame-effects`: 相框效果核心逻辑，含虚化背景（blur）、圆角裁切、阴影偏移。抽离为纯函数，Web 和 CLI 共享
- `watermark-overlay`: 水印渲染核心逻辑，含品牌 LOGO 变色/定位、型号+EXIF 文字排版、字体/颜色/字号。抽离为纯函数，Web 和 CLI 共享
- `image-export`: 单图及批量导出为原图分辨率 JPG，临时 Stage 渲染（仅 Web）
- `cli-batch-tool`: Node.js CLI 脚本，接收目录路径 + JSON 配置（或命令行参数），批量遍历照片应用边框水印并输出到指定目录

### Modified Capabilities

- 无（CameraVision 是新功能，尚无现有 spec 变更）

## Impact

- **新增依赖**：`react-konva` ^18.x、`konva` ^9.x、`exifr` ^7.x（Web + 共享逻辑）；`canvas` (node-canvas) 用于 CLI 无头渲染
- **共享核心逻辑**：`src/utils/canvas-render.ts` 扩展为同时支持 Web（Konva）和 Node（node-canvas）两条渲染路径；`utils/logo-color.ts` 和 `utils/exif-formatter.ts` 共享
- **新增文件**：
  - `src/components/cameravision/FrameWatermark/` 下 4 个 Web 组件
  - `scripts/watermark-cli.js` — CLI 入口脚本
  - `src/utils/canvas-render.ts` — 核心渲染引擎（Web + Node）
- **性能**：大图渲染限制最大 6000px，参数变更 debounce 16ms
- **包体积**：`react-konva` 通过 React.lazy 懒加载；`canvas` (node-canvas) 仅 CLI 场景使用
