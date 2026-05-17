## Verification Report: tab1-frame-watermark

### Summary
| Dimension | Status |
|-----------|--------|
| Completeness | 59/59 tasks (100%), 21/27 reqs covered |
| Correctness | 3 issues remaining (+ 4 previously fixed) |
| Coherence | Design partially followed, 4 deviations |

---

### ✅ Fixed Issues (in current session)

| # | Issue | Fix |
|---|-------|-----|
| 1 | EXIF 快门 `1/1/500` 重复前缀 | `exif-formatter.ts:25` 模板改为 `${shutter}` |
| 2 | 导出分辨率过低 | `web-renderer.tsx` 使用 `stage.toDataURL({ pixelRatio })`，自动计算最优倍率（最高 4x） |
| 3 | 缺少 16ms debounce | `FrameWatermark.tsx` 用 `requestAnimationFrame` 节流 `updateConfig` |
| 4 | 缺少 768px 响应式 | `matchMedia` 检测 `<767px`，切换 `flexDirection: column`，SettingPanel 自适应宽度 |

---

### CRITICAL Issues (Remaining)

**1. 单 Layer 渲染（非三层分离）**
- **Design**: Decisions §3 — "Konva 分三层 Layer：虚化背景 Layer + 照片 Layer + 水印 Layer"
- **Current**: 所有元素在同一个 Layer 内的 Group 中渲染
- **Recommendation**: 分离为三层 Layer 以实现按需更新，避免任意参数变更时全部重绘

**2. 缺少最大尺寸限制（Web 导出端）**
- **Spec**: `image-export/spec.md` — "限制导出最大分辨率为 6000px"
- **Current**: `maxDimension` 仅在 CLI `node-renderer.ts` 中实现，Web 导出端未检查/应用限制
- **Recommendation**: 在 Web 导出前检查图像尺寸，超限时缩放并提示用户

**3. 水印布局已偏离 spec 描述**
- **Spec**: `watermark-overlay/spec.md` — 布局为 `[LOGO 图标] [型号文字] [竖线分割] [EXIF 参数文字]`
- **Current**: 两行布局（Logo 在上，型号+EXIF 同在下行），无竖线分割
- **Recommendation**: 如果两行布局是用户明确要求的新方案，更新 spec 反映当前实现

---

### WARNING Issues

**4. `logo-color.ts` 未使用（孤儿文件）**
- **Design**: Decisions §6 — "LOGO 变色方案"
- **Current**: 文件存在但零引用
- **Recommendation**: 移除未使用的 `logo-color.ts`

**5. 品牌数量从 26+ 缩减到 8**
- **Recommendation**: 若为用户要求，更新 spec 反映当前范围

**6. 导出使用 pixelRatio vs temp stage at full res**
- **Spec**: 要求创建临时 Stage 设原图分辨率再导出
- **Current**: 使用 pixelRatio 提升输出分辨率（更轻量，但非 spec 所述方案）
- **Note**: 当前方案在大多数场景下够用，若原图 >> 预览缩放比导致 pixelRatio 不够时可补充

---

### SUGGESTION Issues

**7. 缺少单元测试**
- 核心纯函数（`calcLayout`、`formatExif`、`estimateTextWidth`）均无测试覆盖

---

### Final Assessment

**3 critical issue(s) remaining.** 

已修复 4 个 critical 问题。剩余 critical 项均涉及 spec/design 偏离而非功能缺陷，可在归档前更新 spec 文档以对齐当前实现，或按需继续修复。
