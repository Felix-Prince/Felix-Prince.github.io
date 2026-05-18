## ADDED Requirements

### Requirement: EXIF 隐私擦除

系统 SHALL 通过 Canvas 重绘方式剥离照片的全部 EXIF 元数据后导出。

#### Scenario: 隐私擦除导出

- **WHEN** 用户点击"擦除 EXIF 导出"按钮
- **THEN** 系统将照片绘制到 Canvas 上
- **THEN** 系统调用 `canvas.toBlob('image/jpeg')` 生成不含任何 EXIF 元数据的新图片
- **THEN** 系统通过 `<a download>` 触发下载
- **THEN** 文件命名为 `cameravision-noexif-{timestamp}.jpg`

#### Scenario: 擦除过程中显示加载状态

- **WHEN** 隐私擦除导出正在进行
- **THEN** 按钮显示加载旋转动画
- **THEN** 按钮置灰防止重复点击
- **THEN** 导出完成后恢复按钮状态
