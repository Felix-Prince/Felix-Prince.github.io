## ADDED Requirements

### Requirement: 单图导出

系统 SHALL 支持将当前编辑的照片以其原始宽高比导出为 JPG。

#### Scenario: 导出当前照片

- **WHEN** 用户点击「导出当前」按钮
- **THEN** 系统使用当前 Stage 内容，通过 `stage.toDataURL()` 导出
- **THEN** 系统自动计算最优 pixelRatio（最高 4x）以获得近原始分辨率的输出
- **THEN** 系统创建 `<a download>` 元素触发浏览器下载
- **THEN** 系统使用 `mimeType: 'image/jpeg', quality: 0.92`

#### Scenario: 导出时无照片

- **WHEN** 用户点击导出按钮但未导入照片
- **THEN** 按钮置灰不可点击

### Requirement: 导出文件名

导出的文件 SHALL 按规则命名。

#### Scenario: 默认文件名

- **WHEN** 导出单张照片
- **THEN** 文件名为 `cameravision-{timestamp}.jpg`
- **THEN** timestamp 为 UNIX 时间戳

### Requirement: 最大分辨率限制

系统 SHALL 在 CLI 端限制导出最大分辨率为 6000px 以避免内存溢出。

#### Scenario: CLI 原图超过限制

- **WHEN** CLI 导入的照片最短边超过 6000px
- **THEN** 导出时将照片缩放至最短边 6000px

### Requirement: CLI 批量导出

CLI 端 SHALL 支持遍历目录批量导出处理后的照片。

#### Scenario: 目录批量处理

- **WHEN** CLI 执行时指定输入目录
- **THEN** 系统递归遍历目录下所有图片文件（jpg/png/webp）
- **THEN** 对每张照片应用相框和水印配置
- **THEN** 输出到指定输出目录，保持原始文件名（添加后缀 `_watermarked`）

#### Scenario: 单文件处理

- **WHEN** CLI 执行时指定单个文件路径
- **THEN** 系统仅处理该文件
- **THEN** 输出到指定输出目录
