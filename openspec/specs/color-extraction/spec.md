## ADDED Requirements

### Requirement: 主色提取

系统 SHALL 使用 k-means 聚类算法提取照片的 5 个主色。

#### Scenario: 标准照片色彩提取

- **WHEN** 用户上传照片且解析完成
- **THEN** 系统将照片降采样至 200px 宽度
- **THEN** 系统对降采样后的像素执行 k-means 聚类（k=5，最大迭代 20 次，RGB Euclidean 距离）
- **THEN** 系统返回 5 个聚类中心色值（RGB 格式）

#### Scenario: 色彩展示

- **WHEN** 主色提取完成
- **THEN** 系统展示 5 个色块，每个色块显示对应 hex 值
- **THEN** 色块按聚类像素数量从多到少排列

#### Scenario: 点击复制色值

- **WHEN** 用户点击某个色块
- **THEN** 系统通过 `navigator.clipboard.writeText()` 复制对应 hex 值到剪贴板
- **THEN** 系统显示短暂"已复制"视觉反馈

### Requirement: 色彩导出

系统 SHALL 支持将提取的主色导出为 CSS 变量 / Tailwind 配置。

#### Scenario: 导出为 CSS 变量

- **WHEN** 用户点击"导出为 CSS 变量"
- **THEN** 系统生成 `--color-primary: #RRGGBB;` 格式的 CSS 代码片段
- **THEN** 系统复制该片段到剪贴板

#### Scenario: 导出为 Tailwind 配置

- **WHEN** 用户选择"导出为 Tailwind 配置"
- **THEN** 系统生成 Tailwind 主题扩展配置（`extend: { colors: { primary: '#RRGGBB', ... } }`）
- **THEN** 系统复制该配置到剪贴板
