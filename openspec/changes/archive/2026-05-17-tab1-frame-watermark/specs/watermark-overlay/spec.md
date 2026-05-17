## ADDED Requirements

### Requirement: 相机 LOGO 选择

系统 SHALL 提供 8 个相机品牌 LOGO，用户可通过浮层选择。

#### Scenario: 打开 LOGO 选择器

- **WHEN** 用户点击 LOGO 选择按钮
- **THEN** 系统显示品牌 LOGO Grid 浮层
- **THEN** 浮层背景半透明，居中弹窗

#### Scenario: 选择品牌 LOGO

- **WHEN** 用户在浮层中点击某个品牌 LOGO
- **THEN** 浮层关闭
- **THEN** 所选品牌 LOGO 显示在水印位置

#### Scenario: LOGO 加载

- **WHEN** 选择的品牌有对应的 SVG/PNG 文件
- **THEN** 系统直接加载原始文件并显示
- **WHEN** 文件加载失败
- **THEN** 不显示 LOGO（无文字回退）

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
- **可选字体**: Arial、Times New Roman、Georgia、Courier New

#### Scenario: 字体颜色

- **WHEN** 用户在拾色器中选取颜色
- **THEN** 水印文字颜色更新
- **THEN** 拾色器类型为 `<input type="color">`

#### Scenario: 字号调节

- **WHEN** 用户拖动「字号」滑块（0~500px）
- **THEN** 水印文字大小实时更新

### Requirement: 水印布局

水印 SHALL 采用两行布局，整体水平居中显示在照片底部模糊背景区域。

#### Scenario: 完整水印布局

- **WHEN** LOGO、型号、EXIF 参数均存在
- **THEN** 布局顺序为：
  - 第一行：[LOGO 图标]（水平居中）
  - 第二行：[型号文字] [间隔] [EXIF 参数文字]（水平居中）
- **THEN** LOGO 与文字行之间有固定间距
- **THEN** 整体水平居中于照片底部（水印位置 Y = 照片高度 × 0.925）

#### Scenario: 部分元素缺失

- **WHEN** 型号或 EXIF 之一为空
- **THEN** 剩余元素正常排列居中对齐
- **WHEN** LOGO 未选择、型号和 EXIF 均为空
- **THEN** 不渲染水印

#### Scenario: 品牌 LOGO 尺寸

- **WHEN** 品牌为 Leica 或 DJI
- **THEN** LOGO 高度倍率为 1.8 倍字号（比其他品牌更突出）
- **WHEN** 品牌为其他（Nikon、Canon、Sony、Fujifilm、Hasselblad、Ricoh）
- **THEN** LOGO 高度倍率为 1.4 倍字号

### Requirement: CLI 配置

CLI 端 SHALL 通过 JSON 配置或命令行参数指定水印内容。

#### Scenario: CLI 参数覆盖

- **WHEN** CLI 执行时指定了 `--logo`、`--model`、`--font-size` 等参数
- **THEN** 使用这些参数渲染水印
- **WHEN** CLI 执行时使用 JSON 配置文件
- **THEN** 读取配置文件中所有水印参数
- **WHEN** 同时提供 CLI 参数和 JSON 配置
- **THEN** CLI 参数优先级高于 JSON 配置
