## ADDED Requirements

### Requirement: 全量 EXIF 字段解析

系统 SHALL 在照片导入后解析完整的 EXIF 元数据，涵盖所有可用标签。

#### Scenario: 全量 EXIF 解析成功

- **WHEN** 照片文件读取完成
- **THEN** 系统调用 `exifr.parse()` 使用全量标签选项解析
- **THEN** 系统提取并分类以下字段：
  - 相机信息：Make、Model、Software、Artist
  - 曝光参数：FNumber、ExposureTime、ISOSpeedRatings、ExposureBiasValue、MeteringMode、ExposureProgram、Flash
  - 镜头信息：FocalLength、FocalLengthIn35mmFilm、LensModel、LensSpecification
  - GPS 坐标：GPSLatitude、GPSLongitude、GPSAltitude（文本展示）
  - 时间信息：DateTimeOriginal、DateTimeDigitized、OffsetTimeOriginal
  - 其他：WhiteBalance、ColorSpace、FileSource、SceneType

#### Scenario: 照片无 EXIF 数据

- **WHEN** 照片文件中不包含 EXIF 数据
- **THEN** 系统显示"该照片不含 EXIF 信息"提示
- **THEN** 直方图/色彩提取/PhotoEntry 面板功能正常但不含 EXIF 映射字段

### Requirement: EXIF 分组展示

系统 SHALL 将解析的 EXIF 字段按类别分组展示。

#### Scenario: 分组面板展示

- **WHEN** EXIF 全量解析完成
- **THEN** 系统按以下分组在面板中展示字段：
  - 相机信息：Make、Model、Software
  - 曝光参数：FNumber、ExposureTime、ISOSpeedRatings、ExposureBiasValue、MeteringMode
  - 镜头信息：FocalLength、FocalLengthIn35mmFilm、LensModel
  - GPS：GPSLatitude、GPSLongitude、GPSAltitude（仅文本）
  - 时间：DateTimeOriginal、OffsetTimeOriginal
  - 其他：WhiteBalance、ColorSpace
- **THEN** 每个分组有独立标题
- **THEN** 字段名使用中文标签（如"光圈""快门速度"）

### Requirement: 参数一键复制

系统 SHALL 支持一键复制全部 EXIF 参数为格式化文本。

#### Scenario: 复制全部参数

- **WHEN** 用户点击"复制参数"按钮
- **THEN** 系统将所有 EXIF 字段格式化为 `{中文标签}: {值}` 文本
- **THEN** 系统通过 `navigator.clipboard.writeText()` 复制到剪贴板
- **THEN** 按钮显示短暂"已复制"反馈

## MODIFIED Requirements

### Requirement: EXIF 自动解析

系统 SHALL 在照片导入后自动调用 `exifr` 解析 EXIF 数据。

#### Scenario: EXIF 解析成功

- **WHEN** 照片文件读取完成
- **THEN** 系统调用 exifr.parse() 解析照片
- **THEN** 系统提取所有可用 EXIF 字段

#### Scenario: 照片无 EXIF 数据

- **WHEN** 照片文件中不包含 EXIF 数据
- **THEN** 系统显示无数据提示
- **THEN** 用户可手动输入拍摄参数（Tab 1）或使用不含 EXIF 映射的功能（Tab 2）
