## ADDED Requirements

### Requirement: CLI 入口

系统 SHALL 提供 `scripts/watermark-cli.js` 作为 CLI 入口脚本。

#### Scenario: 查看帮助

- **WHEN** 用户运行 `node scripts/watermark-cli.js --help` 或 `-h`
- **THEN** 系统显示所有可用参数和使用说明

#### Scenario: 基本用法

- **WHEN** 用户运行 `node scripts/watermark-cli.js --input ./photos --output ./output`
- **THEN** 系统读取 `./photos` 目录下所有照片
- **THEN** 系统使用默认配置添加相框和水印
- **THEN** 系统将结果写入 `./output` 目录

### Requirement: 参数配置

CLI SHALL 支持以下配置方式：JSON 配置文件 + 命令行参数覆盖。

#### Scenario: JSON 配置文件

- **WHEN** 用户运行 `node scripts/watermark-cli.js --input ./photos --config ./watermark-config.json`
- **THEN** 系统读取 JSON 文件获取相框和水印参数

#### Scenario: 配置文件格式

- **WHEN** 系统读取 JSON 配置文件
- **THEN** 配置 SHALL 包含以下可选字段：blurRadius、cornerRadius、shadowOffset、logo、model、fontSize、fontColor、fontFamily、maxDimension

#### Scenario: 命令行参数覆盖

- **WHEN** 同时提供 JSON 配置文件和命令行参数
- **THEN** 命令行参数优先级更高，覆盖 JSON 中的对应字段

### Requirement: 支持的参数

CLI SHALL 支持以下命令行参数。

#### Scenario: 全部参数列表

- **WHEN** 用户查看帮助文档
- **THEN** 显式以下参数说明：
  - `--input, -i`：输入目录或文件路径（必填）
  - `--output, -o`：输出目录路径（必填）
  - `--config, -c`：JSON 配置文件路径
  - `--logo`：相机品牌 LOGO 名称
  - `--model`：相机型号文字
  - `--font-size`：水印字号（默认 40）
  - `--font-color`：水印字体颜色（十六进制，默认 #ffffff）
  - `--font-family`：水印字体名称
  - `--blur`：虚化程度 px（默认 150）
  - `--corner-radius`：圆角半径 px（默认 40）
  - `--shadow-offset`：阴影偏移 px（默认 100）
  - `--max-dimension`：最大边长 px（默认 6000）
  - `--suffix`：输出文件名后缀（默认 `_watermarked`）
  - `--verbose, -v`：详细日志输出
  - `--help, -h`：帮助信息

### Requirement: 进度反馈

CLI SHALL 在批量处理时显示处理进度。

#### Scenario: 进度条

- **WHEN** CLI 批量处理照片
- **THEN** 控制台显示进度 `[3/10] filename.jpg`
- **WHEN** 单张处理完成
- **THEN** 输出 `✓ filename.jpg → output/filename_watermarked.jpg`

#### Scenario: 错误处理

- **WHEN** 某张照片处理失败
- **THEN** 系统捕获错误不中断其他照片处理
- **THEN** 控制台显示 `✗ filename.jpg: 错误信息`
- **THEN** 最终显式汇总 `处理完成: 8成功, 2失败`

### Requirement: 无头渲染

CLI 端 SHALL 使用 node-canvas (`canvas` 包) 实现无头渲染，不依赖浏览器环境。

#### Scenario: 渲染路径

- **WHEN** CLI 导入 `frame-renderer/node-renderer`
- **THEN** 使用 node-canvas 的 Canvas 和 Image 类
- **THEN** 应用与 Web 端相同的核心布局函数
- **THEN** 渲染结果写入文件系统

#### Scenario: node-canvas 缺失

- **WHEN** `canvas` 包未安装
- **THEN** CLI 启动时报错提示安装依赖 `npm install canvas --no-save`
