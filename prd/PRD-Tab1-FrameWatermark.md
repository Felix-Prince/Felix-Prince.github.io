# PRD — Tab 1：边框水印

> 参考：https://lookcv.com/
> 优先级：P0（MVP 核心）
> 最后更新：2026-05-03

---

## 一、功能概述

上传照片，自动读取 EXIF 拍摄参数，添加自定义相框（虚化背景 + 圆角 + 阴影）和品牌 LOGO + 拍摄参数水印，一键高质量导出。

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
| 导出当前 | 原图分辨率 JPG → 浏览器下载 |
| 批量导出 | 遍历图片列表逐张导出 |
| 导出逻辑 | Stage 设原图尺寸 → `toDataURL({pixelRatio:1})` → 恢复 → 下载 |
| 文件名 | `cameravision-export-{timestamp}.jpg` |

## 四、组件结构

```
src/components/cameravision/FrameWatermark/
├── CanvasPreview.tsx      # Konva 预览画布
├── SettingPanel.tsx       # 右侧设置面板
├── LogoSelector.tsx       # LOGO 品牌选择浮层
└── ExportActions.tsx      # 导出按钮组
```

## 五、依赖

| 包 | 版本 | 用途 |
|----|------|------|
| `react-konva` | ^18.x | React 封装 Konva |
| `konva` | ^9.x | Canvas 操作引擎 |
| `exifr` | ^7.x | EXIF 解析 |

## 六、关键实现

- **虚化背景**：离屏 Canvas + `ctx.filter = 'blur(Npx)'` 绘制到 Konva 底层
- **圆角裁切**：Konva.Group + `clipFunc` 圆角矩形路径
- **LOGO 变色**：ImageData 像素遍历，非透明像素颜色替换，离屏 Canvas 处理
- **原图导出**：临时 Stage 设原图尺寸 → toDataURL → 恢复 → `<a download>`
- **性能**：update debounce 16ms、预览用缩放尺寸、LOGO 变色缓存、ResizeObserver

## 七、迭代计划

### MVP（Phase 1）

- [ ] 页面骨架 + 左右分栏
- [ ] 照片导入（单图 + 拖拽）
- [ ] EXIF 自动解析 + 参数填充
- [ ] Canvas 预览（虚化 + 圆角 + 阴影）
- [ ] 水印渲染（LOGO + 型号 + EXIF + 字体/颜色/字号）
- [ ] 单图高质量导出

### 增强（Phase 2~3）

- [ ] 多图导入 + 缩略图切换
- [ ] 批量导出
- [ ] 预设模板（3~5 套风格一键切换）
- [ ] 导出格式可选（JPG / PNG / WebP）
- [ ] 更多相框样式（纯色边框、渐变边框）
- [ ] 水印位置可拖拽
- [ ] 自定义 LOGO 上传
- [ ] 摄影集 lightbox 联动

## 八、风险

| 风险 | 缓解 |
|------|------|
| EXIF 被社交平台剥离 | 手动输入兜底 |
| 大图内存溢出 | 限制最大 8000px |
| `react-konva` 包体积 | React.lazy 路由懒加载 |
| LOGO 品牌版权 | 仅个人站展示，不商用 |

---

_文档版本：v1.0 | 最后更新：2026-05-03_
