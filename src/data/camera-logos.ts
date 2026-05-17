export interface CameraLogoMeta {
    name: string
    file: string
}

// 品牌列表 — 与 public/assets/logos/ 中的文件对应
export const CAMERA_LOGOS: CameraLogoMeta[] = [
    { name: "Nikon", file: "nikon_full.svg" },
    { name: "Canon", file: "Canon_logo.svg.png" },
    { name: "Sony", file: "Sony_logo.svg.png" },
    { name: "Fujifilm", file: "Fujifilm_logo.svg.png" },
    { name: "Hasselblad", file: "hasselblad.svg" },
    { name: "Leica", file: "leica_red_full.svg" },
    { name: "DJI", file: "DJI_id5sH6ECbd_1.png" },
    { name: "Ricoh", file: "Ricoh_logo_2005.svg.png" },
]

export function getLogoPath(name: string): string {
    const meta = CAMERA_LOGOS.find((l) => l.name === name)
    if (!meta || !meta.file) return ""
    return `/assets/logos/${meta.file}`
}
