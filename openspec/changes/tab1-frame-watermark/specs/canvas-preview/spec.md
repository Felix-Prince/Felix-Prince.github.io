## ADDED Requirements

### Requirement: Konva 实时预览画布

左侧区域 SHALL 使用 react-konva 实现实时 Canvas 预览。

#### Scenario: 初始化画布

- **WHEN** Tab 1 首次渲染
- **THEN** 左侧区域显示 Konva Stage
- **THEN** Stage 背景为 `var(--color-bg)`
- **THEN** Stage 未导入照片时显示「请导入照片」占位文字

#### Scenario: 参数变更重绘

- **WHEN** 用户调节任意参数（相框/水印）
- **THEN** 系统在 16ms debounce 后重新渲染 Canvas
- **THEN** 渲染流程：清空 Layer → 绘制虚化背景 → 绘制圆角照片(含阴影) → 绘制水印组

### Requirement: 画布自适应

预览画布 SHALL 根据容器尺寸自适应，保持照片原始宽高比。

#### Scenario: 窗口缩放

- **WHEN** 浏览器窗口宽度变化
- **THEN** ResizeObserver 触发重新计算
- **THEN** Stage 尺寸按容器等比例缩放
- **THEN** 照片保持原始宽高比居中显示

#### Scenario: 面板展开/收起

- **WHEN** 右侧面板宽度变化
- **THEN** 预览画布自适应填充左侧剩余空间

### Requirement: 响应式适配

移动端 SHALL 切换为上下布局。

#### Scenario: 移动端布局切换

- **WHEN** 屏幕宽度 < 768px
- **THEN** 预览区在上，设置面板在下的垂直布局
- **THEN** 预估高度控制预览区高度不超过视口 60%
