## ADDED Requirements

### Requirement: EXIF → PhotoEntry 自动映射

系统 SHALL 将解析的 EXIF 数据自动映射为 `photos.json` 兼容的 PhotoEntry 结构。

#### Scenario: 完整自动映射

- **WHEN** 照片 EXIF 解析完成且包含必要字段
- **THEN** 系统自动生成以下字段：
  - `id`: `photo-{Date.now()}`
  - `url`: 照片 DataURL
  - `thumbnail`: 缩略图 DataURL（缩放至 600px 宽度）
  - `date`: EXIF `DateTimeOriginal` → `YYYY-MM-DD` 格式（无 EXIF 则取文件修改时间）
  - `camera`: EXIF `Make` + `Model` → 品牌别名映射后的可读名称（如 `"Sony A7IV"`）
  - `settings`: EXIF 格式化字符串 `f/{FNumber}, 1/{ExposureTime}s, ISO{ISOSpeedRatings}`
- **THEN** 手动字段初始化为空/默认值：
  - `title`: 文件名（去扩展名）
  - `tags`: `[]`
  - `description`: `""`
  - `collection`: `"Uncategorized"`

#### Scenario: 品牌别名映射

- **WHEN** 系统处理相机型号字段
- **THEN** 系统查询品牌别名映射表将型号代码转为可读名称
- **THEN** 已知品牌型号映射正确（如 `ILCE-7M4` → `Sony A7M4`、`NIKON Z 6_2` → `Nikon Z6 II`）
- **THEN** 未匹配的型号保持原始值不转换

#### Scenario: 部分 EXIF 缺失

- **WHEN** 部分 EXIF 字段缺失
- **THEN** 缺失的自动字段显示 `--` 或取用兜底值
- **THEN** 用户可手动填写缺失字段

### Requirement: 手动字段编辑

系统 SHALL 提供内联编辑界面供用户补充手动字段。

#### Scenario: 编辑手动字段

- **WHEN** 用户在 PhotoEntry 编辑器中修改 title / tags / description / collection 任意字段
- **THEN** 系统实时更新界面中的预览 JSON
- **THEN** 输入框使用透明背景 + 底部边框样式，聚焦时高亮 --color-accent

#### Scenario: Tags 输入

- **WHEN** 用户编辑 tags 字段
- **THEN** 系统提供标签输入组件，支持按 Enter/逗号添加标签
- **THEN** 每个标签显示为小圆角 pill，带 × 删除按钮

### Requirement: JSON 预览与复制

系统 SHALL 实时展示 PhotoEntry 的 JSON 格式并提供复制功能。

#### Scenario: JSON 预览

- **WHEN** PhotoEntry 数据发生变化（自动映射或手动编辑）
- **THEN** 系统实时更新 JSON 预览区域
- **THEN** JSON 使用代码等宽字体（JetBrains Mono）和语法高亮

#### Scenario: 复制 JSON

- **WHEN** 用户点击"复制 JSON"按钮
- **THEN** 系统通过 `navigator.clipboard.writeText()` 复制格式化后的 JSON 字符串
- **THEN** 按钮显示短暂"已复制"反馈

### Requirement: JSON 下载

系统 SHALL 支持将 PhotoEntry 下载为 `.json` 文件。

#### Scenario: 下载单条 JSON

- **WHEN** 用户点击"下载 JSON"按钮
- **THEN** 系统创建 Blob 对象（`application/json`）
- **THEN** 系统通过 `<a download>` 触发文件下载
- **THEN** 文件命名为 `photo-{timestamp}.json`
