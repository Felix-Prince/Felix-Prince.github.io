## ADDED Requirements

### Requirement: 照片文件导入

系统 SHALL 支持用户通过点击按钮选择照片文件。

#### Scenario: 点击按钮触发文件选择

- **WHEN** 用户点击「导入照片」按钮
- **THEN** 系统弹出系统文件选择对话框

#### Scenario: 支持多图选择

- **WHEN** 用户在文件选择对话框中选中多张照片
- **THEN** 系统将所有选中照片加载到导入列表

### Requirement: 拖拽上传

系统 SHALL 支持用户将照片拖拽到预览区进行导入。

#### Scenario: 拖拽文件到预览区

- **WHEN** 用户将照片文件拖拽到 Canvas 预览区
- **THEN** 系统阻止浏览器默认行为
- **THEN** 系统读取拖拽文件并加入导入列表

#### Scenario: 非图片文件拖拽提示

- **WHEN** 用户拖拽非图片文件到预览区
- **THEN** 系统显示提示信息「请拖入图片文件」

### Requirement: 本地文件读取

系统 SHALL 使用 FileReader API 将图片文件读取为 DataURL。

#### Scenario: 文件读取成功

- **WHEN** 文件读取完成
- **THEN** 系统将 DataURL 存入状态用于后续渲染

### Requirement: 缩略图条

右侧面板顶部 SHALL 显示已导入照片的水平滚动缩略图条。

#### Scenario: 显示缩略图

- **WHEN** 照片导入完成
- **THEN** 缩略图条中出现该照片的缩略图
- **THEN** 缩略图使用小尺寸预览图以节省内存

#### Scenario: 缩略图切换

- **WHEN** 用户点击缩略图条中的某张缩略图
- **THEN** 预览区切换到该照片进行编辑
