# PRD — Tab 2：EXIF 分析

> 优先级：P1
> 最后更新：2026-05-03

---

## 一、功能概述

拖入照片，全量解析 EXIF 元数据，展示 RGB 直方图 + 过曝/欠曝警告，提取照片主色调，支持 EXIF 隐私擦除导出。**自动将 EXIF 数据格式化为 `photos.json` 结构**，可直接用于 PhotoGallery 等工具。纯客户端处理，零隐私风险。

## 二、布局

```
┌──────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────────────────┐  │
│  │  拖拽上传区   │  │  EXIF 完整信息                    │  │
│  │  或点击选择   │  │  ├── 相机 / 镜头 / 型号           │  │
│  │              │  │  ├── 光圈 / 快门 / ISO / 焦距     │  │
│  │  照片缩略图   │  │  ├── GPS 坐标 + 地图定位          │  │
│  │              │  │  └── 拍摄时间 / 白平衡 / 测光模式   │  │
│  └──────────────┘  ├──────────────────────────────────┤  │
│                    │  RGB 直方图 + 过曝/欠曝警告        │  │
│                    ├──────────────────────────────────┤  │
│                    │  色彩提取（5 主色 + hex 值）        │  │
│                    ├──────────────────────────────────┤  │
│                    │  [擦除 EXIF 导出] [复制参数]        │  │
│                    └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 三、功能规格

### 3.1 EXIF 完整解析

| 功能 | 规格 | 实现 |
|------|------|------|
| 全量字段 | 相机、镜头、光圈、快门、ISO、焦距、白平衡、测光模式、闪光灯、拍摄时间、软件等 | `exifr` 全量解析 |
| 分组展示 | 按类别分组：相机信息 / 曝光参数 / 镜头信息 / GPS / 时间 / 其他 | 面板分组 UI |
| 参数复制 | 一键复制 EXIF 参数为文本格式 | `navigator.clipboard.writeText()` |

### 3.2 RGB 直方图

| 功能 | 规格 | 实现 |
|------|------|------|
| 三通道直方图 | 红、绿、蓝独立通道曲线 | Canvas `getImageData` 逐像素统计 256 级 |
| 亮度直方图 | 整体亮度分布曲线 | `(R×0.299 + G×0.587 + B×0.114)` 加权 |
| 过曝警告 | 高光溢出区域（像素值 ≥ 250）红色闪烁标注 | 像素阈值检测 + Canvas 叠加层 |
| 欠曝警告 | 阴影溢出区域（像素值 ≤ 5）蓝色闪烁标注 | 像素阈值检测 + Canvas 叠加层 |
| 交互 | 鼠标悬停直方图显示该亮度级的像素数量 | mousemove 事件 + tooltip |

### 3.3 色彩提取

| 功能 | 规格 | 实现 |
|------|------|------|
| 主色提取 | 提取 5 个主色，显示 hex 值 + 色块 | k-means 聚类算法（`color-extract.ts`） |
| 色彩导出 | 主色导出为 CSS 变量 / Tailwind 配置 / 色卡图片 | 字符串拼接 + Canvas 生成 |
| 点击复制 | 点击色块复制 hex 值 | `navigator.clipboard.writeText()` |

### 3.4 GPS 地图

| 功能 | 规格 | 实现 |
|------|------|------|
| 坐标读取 | 从 EXIF 提取 GPS 经纬度 | `exifr` GPS 解析 |
| 地图定位 | OpenStreetMap 标注拍摄位置 | Leaflet.js |
| 无 GPS | 不显示地图区域，提示"该照片不含 GPS 信息" | 条件渲染 |

### 3.5 结构化数据格式化（photos.json 格式）

上传照片解析完成后，自动将 EXIF 数据映射为项目 `photos.json` 的数据结构，用户只需补填少量字段即可直接使用。

**目标结构**（对齐 `src/data/photos.json`）：

```ts
interface PhotoEntry {
  id: string;          // 自动生成: "photo-{timestamp}"
  title: string;       // 需用户填写（默认: 文件名）
  url: string;         // 照片的 DataURL 或原始路径
  thumbnail: string;   // 缩略图 DataURL（自动生成）
  tags: string[];      // 需用户填写（可从色彩/场景建议）
  date: string;        // EXIF → DateTimeOriginal → "YYYY-MM-DD"
  camera: string;      // EXIF → Make + Model → "Sony A7IV"
  settings: string;    // EXIF → 格式化 → "f/2.8, 1/250s, ISO 400"
  description: string; // 需用户填写
  collection: string;  // 需用户填写（默认: "Uncategorized"）
}
```

**EXIF → PhotoEntry 自动映射**：

| PhotoEntry 字段 | EXIF 来源 | 自动/手动 | 格式化规则 |
|-----------------|----------|----------|-----------|
| `id` | — | 自动 | `photo-{Date.now()}` |
| `title` | — | 手动 | 默认取文件名（去扩展名） |
| `url` | FileReader | 自动 | DataURL |
| `thumbnail` | Canvas | 自动 | 缩放至 600px 宽度生成 DataURL |
| `tags` | — | 手动 | 空数组，可从色彩提取结果建议标签 |
| `date` | DateTimeOriginal | 自动 | `2024-03-15`（无 EXIF 则取文件修改时间） |
| `camera` | Make + Model | 自动 | `"Sony" + "ILCE-7M4"` → `"Sony A7IV"`（品牌别名映射） |
| `settings` | FNumber + ExposureTime + ISOSpeedRatings | 自动 | `"f/2.8, 1/250s, ISO 400"` |
| `description` | — | 手动 | 空字符串 |
| `collection` | — | 手动 | 默认 `"Uncategorized"` |

**品牌别名映射**（`camera-aliases.ts`）：

```ts
const CAMERA_ALIASES: Record<string, string> = {
  'ILCE-': 'Sony ',       // ILCE-7M4 → Sony A7M4
  'NIKON': 'Nikon ',
  'Canon': 'Canon ',
  'FUJIFILM': 'Fujifilm ',
  'RICOH': 'Ricoh ',
  'LEICA': 'Leica ',
  // ...更多品牌
};
```

**交互流程**：

```
[上传照片] → [EXIF 解析] → [自动填充 PhotoEntry]
                                │
                                ├── 自动字段: id/url/thumbnail/date/camera/settings
                                ├── 手动字段: title/tags/description/collection（输入框）
                                │
                                ▼
                        [预览 JSON] → [复制 JSON] / [下载 JSON]
```

**输出能力**：

| 功能 | 规格 | 实现 |
|------|------|------|
| JSON 预览 | 右侧面板底部展示格式化后的 JSON | 代码高亮展示 |
| 复制 JSON | 一键复制单条 PhotoEntry JSON | `navigator.clipboard.writeText()` |
| 下载 JSON | 下载为 `.json` 文件（可合并多张） | Blob + `<a download>` |
| 批量格式化 | 多张照片合并为一个 `{"photos": [...]}` 结构 | 遍历 + 合并 |
| 编辑 | 手动字段（title/tags/description/collection）提供内联编辑 | Input/TagInput 组件 |

### 3.6 EXIF 擦除

| 功能 | 规格 | 实现 |
|------|------|------|
| 隐私导出 | 去除所有 EXIF 元数据后重新导出 | Canvas 重绘（自然剥离 EXIF） |
| 格式 | 导出为 JPG | `canvas.toBlob('image/jpeg')` |
| 文件名 | `cameravision-noexif-{timestamp}.jpg` | — |

## 四、组件结构

```
src/components/cameravision/ExifAnalyzer/
├── ExifPanel.tsx          # EXIF 信息面板（分组展示）
├── Histogram.tsx          # RGB + 亮度直方图
├── ColorExtractor.tsx      # 色彩提取展示
├── PhotoEntryEditor.tsx   # PhotoEntry 格式化 + 编辑面板
└── GpsMap.tsx             # GPS 坐标地图
```

```
src/utils/
├── histogram.ts           # 直方图计算
├── color-extract.ts       # k-means 色彩提取
└── photo-entry-formatter.ts # EXIF → PhotoEntry 映射 + 品牌别名
```

```
src/data/
└── camera-aliases.ts      # 相机型号别名映射表
```

## 五、依赖

| 包 | 版本 | 用途 | 阶段 |
|----|------|------|------|
| `exifr` | ^7.x | EXIF 解析 | Phase 2（Tab 1 已引入） |
| `leaflet` | ^1.x | 地图渲染 | Phase 3（GPS 地图） |
| `react-leaflet` | ^4.x | React 封装 Leaflet | Phase 3 |

## 六、迭代计划

### Phase 2

- [ ] EXIF 完整解析面板
- [ ] RGB + 亮度直方图
- [ ] 过曝/欠曝警告
- [ ] 色彩提取（5 主色 + hex）
- [ ] EXIF 擦除导出
- [ ] 参数一键复制
- [ ] EXIF → PhotoEntry 自动格式化（自动映射 + 手动字段编辑）
- [ ] JSON 预览 + 复制/下载

### Phase 3

- [ ] GPS 地图定位（Leaflet）
- [ ] 色彩导出为 CSS / Tailwind 配置 / 色卡图片
- [ ] 直方图鼠标悬停交互（显示像素数量）
- [ ] EXIF 对比（两张照片参数对比）
- [ ] 批量格式化（多张照片合并为一个 `{"photos": [...]}` JSON）
- [ ] 品牌别名映射表完善（主流相机型号全覆盖）
- [ ] tags 智能建议（从色彩提取结果 + 日期/场景推断）

## 七、风险

| 风险 | 缓解 |
|------|------|
| EXIF 字段不标准 | exifr 兼容性好，兜底显示原始 key |
| 无 EXIF 的照片 | 显示"该照片不含 EXIF 信息"提示 |
| k-means 性能 | 对大图降采样后再聚类 |
| Leaflet 包体积 | GPS 地图 Phase 3 引入，React.lazy 懒加载 |

---

_文档版本：v1.0 | 最后更新：2026-05-03_
