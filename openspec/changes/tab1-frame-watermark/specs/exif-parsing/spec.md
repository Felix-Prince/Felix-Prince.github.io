## ADDED Requirements

### Requirement: EXIF 自动解析

系统 SHALL 在照片导入后自动调用 `exifr` 解析 EXIF 数据。

#### Scenario: EXIF 解析成功

- **WHEN** 照片文件读取完成
- **THEN** 系统调用 exifr.parse() 解析照片
- **THEN** 系统提取 FocalLength、FNumber、ExposureTime、ISOSpeedRatings 字段

#### Scenario: 照片无 EXIF 数据

- **WHEN** 照片文件中不包含 EXIF 数据
- **THEN** 系统显示空参数状态
- **THEN** 用户可手动输入拍摄参数

### Requirement: EXIF 参数格式化

系统 SHALL 将解析的 EXIF 参数格式化为标准拍摄信息字符串。

#### Scenario: 完整参数格式化

- **WHEN** EXIF 解析完成且所有字段均有值
- **THEN** 格式化为 `{焦距}mm f/{光圈} 1/{快门} ISO{感光度}` 格式
- **THEN** 显式时间格式：快门值 < 1s 显示为分数（如 1/500），≥ 1s 显示为数字

#### Scenario: 部分参数缺失

- **WHEN** 部分 EXIF 字段缺失
- **THEN** 缺失字段显示为 `--`
- **THEN** 格式为 `{焦距}mm f/{光圈} 1/{快门} ISO{感光度}`

### Requirement: 参数手动覆盖

用户 SHALL 可以在设置面板中手动修改或覆盖自动解析的拍摄参数。

#### Scenario: 修改参数

- **WHEN** 用户在参数输入框中修改值
- **THEN** 水印渲染立即使用用户输入的值
