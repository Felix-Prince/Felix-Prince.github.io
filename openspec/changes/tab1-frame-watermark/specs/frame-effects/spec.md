## ADDED Requirements

### Requirement: 虚化背景

系统 SHALL 将原图缩放并应用高斯模糊作为相框背景层。

#### Scenario: 虚化背景渲染

- **WHEN** 照片加载完成且虚化程度 > 0
- **THEN** 系统创建离屏 Canvas 将原图缩放到预览尺寸
- **THEN** 系统应用 `ctx.filter = 'blur(Npx)'` 模糊处理
- **THEN** 模糊后的图像作为 Konva 底层 Image 显示

#### Scenario: 虚化程度调节

- **WHEN** 用户拖动「虚化程度」滑块（0~200px，默认 150px）
- **THEN** 虚化背景实时更新
- **WHEN** 虚化程度 = 0
- **THEN** 背景显示为纯色 `var(--color-bg)`

### Requirement: 圆角裁切

系统 SHALL 对照片应用圆角裁切效果。

#### Scenario: 圆角预览

- **WHEN** 照片渲染后
- **THEN** 照片四角按「圆角半径」值裁切
- **THEN** 裁切使用 Konva.Group + clipFunc 圆形矩形路径实现

#### Scenario: 圆角半径调节

- **WHEN** 用户拖动「圆角半径」滑块（0~500px，默认 40px）
- **THEN** 照片圆角弧度实时更新

#### Scenario: 圆角半径为 0

- **WHEN** 圆角半径 = 0
- **THEN** 照片显示为直角矩形

### Requirement: 阴影偏移

系统 SHALL 在照片下方绘制投影增强立体感。

#### Scenario: 阴影渲染

- **WHEN** 照片渲染在画布上
- **THEN** 照片下方显示阴影
- **THEN** 阴影偏移量跟随「阴影偏移」参数

#### Scenario: 阴影偏移调节

- **WHEN** 用户拖动「阴影偏移」滑块（0~500px，默认 100px）
- **THEN** 照片下方阴影偏移量实时更新

#### Scenario: 阴影关闭

- **WHEN** 阴影偏移 = 0
- **THEN** 不绘制阴影

### Requirement: CLI 共享

相框效果的计算逻辑 SHALL 定义为纯函数，同时被 Web 端（Konva）和 CLI 端（node-canvas）调用。

#### Scenario: 统一布局计算

- **WHEN** Web 端渲染相框
- **THEN** 调用核心布局函数计算虚化区域、照片位置、圆角路径、阴影偏移
- **WHEN** CLI 端渲染相框
- **THEN** 调用同一套核心布局函数，计算结果一致
