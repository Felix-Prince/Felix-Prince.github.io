## ADDED Requirements

### Requirement: 相机 LOGO 选择

系统 SHALL 提供 26+ 相机品牌 LOGO，用户可通过浮层选择。

#### Scenario: 打开 LOGO 选择器

- **WHEN** 用户点击 LOGO 选择按钮
- **THEN** 系统显示品牌 LOGO Grid 浮层
- **THEN** 浮层背景半透明，居中弹窗

#### Scenario: 选择品牌 LOGO

- **WHEN** 用户在浮层中点击某个品牌 LOGO
- **THEN** 浮层关闭
- **THEN** 所选品牌 LOGO 显示在水印位置

#### Scenario: LOGO 变色

- **WHEN** 所选的 LOGO 文件名不含 `_full`
- **THEN** 系统自动将 LOGO 像素的色相/明度按当前字体色处理
- **WHEN** 字体色改变
- **THEN** LOGO 颜色自动同步更新

### Requirement: 型号文字

系统 SHALL 允许用户输入相机型号文字显示在水印中。

#### Scenario: 型号输入

- **WHEN** 用户在「型号」输入框中输入文字
- **THEN** 水印中型号文字更新为输入内容

#### Scenario: 型号为空

- **WHEN** 型号输入为空
- **THEN** 水印中不显示型号文字（仅 LOGO + EXIF）

### Requirement: 水印文字样式

系统 SHALL 支持调节水印文字的字体、颜色、字号。

#### Scenario: 字体选择

- **WHEN** 用户在字体 Select 中选择字体
- **THEN** 水印文字立即切换为所选字体
- **可选字体**: DingTalkSans、Arial、Times New Roman、Georgia、Courier New

#### Scenario: 字体颜色

- **WHEN** 用户在拾色器中选取颜色
- **THEN** 水印文字和 LOGO 颜色同步更新
- **THEN** 拾色器类型为 `<input type="color">`

#### Scenario: 字号调节

- **WHEN** 用户拖动「字号」滑块（0~500px）
- **THEN** 水印文字大小实时更新

### Requirement: 水印布局

水印 SHALL 水平居中排列于照片底部：LOGO + 型号 + 分割线 + EXIF 参数。

#### Scenario: 完整水印布局

- **WHEN** LOGO、型号、EXIF 参数均存在
- **THEN** 布局顺序为：[LOGO 图标] [型号文字] [竖线分割] [EXIF 参数文字]
- **THEN** 整体水平居中于照片底部边缘

#### Scenario: 部分元素缺失

- **WHEN** 型号或 EXIF 之一为空
- **THEN** 剩余元素正常排列居中对齐
- **WHEN** LOGO 未选择、型号和 EXIF 均为空
- **THEN** 不渲染水印

### Requirement: CLI 配置

CLI 端 SHALL 通过 JSON 配置或命令行参数指定水印内容。

#### Scenario: CLI 参数覆盖

- **WHEN** CLI 执行时指定了 `--logo`、`--model`、`--font-size` 等参数
- **THEN** 使用这些参数渲染水印
- **WHEN** CLI 执行时使用 JSON 配置文件
- **THEN** 读取配置文件中所有水印参数
- **WHEN** 同时提供 CLI 参数和 JSON 配置
- **THEN** CLI 参数优先级高于 JSON 配置
