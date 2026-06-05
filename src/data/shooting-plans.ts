export interface ShootingPlanSection {
    type: "text" | "image" | "heading" | "tip" | "settings-table"
    content?: string
    src?: string
    caption?: string
    alt?: string
    level?: 2 | 3
    rows?: { label: string; value: string }[]
}

export interface ReferenceImage {
    src: string
    caption?: string
}

export interface ShootingPlan {
    id: string
    title: string
    subtitle: string
    coverGradient: string
    /** emoji 或图片路径 */
    coverEmoji: string
    tags: string[]
    category: string
    summary: string
    difficulty: "beginner" | "intermediate" | "advanced"
    estimatedTime: string
    gear?: {
        lens?: string[]
        props?: string[]
    }
    settings?: {
        aperture?: string
        shutterSpeed?: string
        iso?: string
        focalLength?: string
        whiteBalance?: string
    }
    sections: ShootingPlanSection[]
    referenceImages?: ReferenceImage[]
    /** 推荐摆姿 ID 列表，关联到 poses.ts */
    recommendedPoses?: string[]
}

export const SHOOTING_CATEGORIES = [
    { id: "all", label: "全部" },
    { id: "portrait", label: "人像" },
    { id: "landscape", label: "风光" },
    { id: "street", label: "街拍" },
    { id: "still-life", label: "静物" },
    { id: "architecture", label: "建筑" },
    { id: "night", label: "夜景" },
] as const

export const shootingPlans: ShootingPlan[] = [
    {
        id: "hydrangea-portrait",
        title: "无尽夏人像",
        subtitle: "绣球花海的日系少女写真",
        coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        coverEmoji: "/assets/plans/hydrangea/banner.png",
        tags: ["人像", "花卉", "日系", "自然光"],
        category: "portrait",
        summary:
            "以无尽夏（绣球花）为背景的日系人像拍摄方案，适合春夏交替的花季，利用自然光营造柔和通透的少女感。",
        difficulty: "intermediate",
        estimatedTime: "2-3 小时",
        gear: {
            lens: ["56mm（中焦人像）", "33mm（标准视角）"],
            props: [
                "五合一反光板（白色/柔光面）",
                "便携梯（俯拍机位）",
                "花束道具",
            ],
        },
        settings: {
            aperture: "f/1.2 ~ f/2.8",
            shutterSpeed: "1/125s ~ 1/250s",
            iso: "100 ~ 400",
            focalLength: "56mm (≈85mm 等效)",
            whiteBalance: "日光 / 阴影",
        },
        referenceImages: [
            {
                src: "/assets/plans/hydrangea/huaban-6261680389.png",
                caption: "低角度仰拍构图参考",
            },
            {
                src: "/assets/plans/hydrangea/image.png",
                caption: "俯拍花海效果示意",
            },
            {
                src: "/assets/plans/hydrangea/image1.png",
                caption: "逆光发丝光效果",
            },
        ],
        recommendedPoses: ["stand-natural", "stand-turn-back", "squat-touch"],
        sections: [
            {
                type: "heading",
                content: "拍摄思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    '无尽夏花海的特点是色彩丰富（蓝紫/粉白色系）且高度密集，拍摄的核心思路是"人花融合"——让模特自然地置身花丛中，利用前景虚化营造梦幻氛围。',
            },
            {
                type: "text",
                content:
                    "建议选择阴天或傍晚柔光时段拍摄。顺光拍摄肤色通透，逆光拍摄发丝发光更有氛围感。白色/浅色系服装与绣球花的蓝紫色调形成和谐对比。",
            },
            {
                type: "heading",
                content: "构图参考",
                level: 3,
            },
            {
                type: "text",
                content:
                    "① 低角度仰拍：以花丛为前景，天空为背景，画面干净层次丰富。\n② 俯拍躺姿：模特躺在花丛中，从上往下俯拍，花海铺满画面。\n③ 半身肖像：使用 56mm 镜头，大光圈虚化背景花朵，突出人物表情。\n④ 局部特写：手的特写、裙摆在花丛中的动态抓拍。",
            },
            {
                type: "tip",
                content:
                    "使用反光板白色面从下方补光，可以消除绣球花在面部投射的紫色色染，让肤色更自然通透。",
            },
            {
                type: "heading",
                content: "推荐参数",
                level: 2,
            },
            {
                type: "settings-table",
                rows: [
                    { label: "拍摄模式", value: "光圈优先 (A)" },
                    { label: "光圈", value: "f/1.2 ~ f/2.8" },
                    { label: "快门速度", value: "1/125s ~ 1/250s" },
                    { label: "ISO", value: "100 ~ 400" },
                    { label: "白平衡", value: "日光（阴影偏暖可用 5300K）" },
                    { label: "胶片模拟", value: "Classic Chrome / Astia" },
                    { label: "对焦模式", value: "眼部追踪 AF-C" },
                ],
            },
            {
                type: "heading",
                content: "后期思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    "色调偏向低饱和高明度。调色时降低紫色/蓝色的饱和度，提高橙色/黄色的明度（肤色更通透）。可以适当增加柔光层的朦胧感（2-5% 高斯模糊叠加）。",
            },
        ],
    },
    {
        id: "city-nightscape",
        title: "城市夜景",
        subtitle: "都市天际线的蓝调时刻捕捉",
        coverGradient:
            "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        coverEmoji: "/assets/plans/nightscape/banner.png",
        tags: ["风光", "夜景", "城市", "长曝", "三脚架"],
        category: "night",
        summary:
            "在城市制高点拍摄日落后的蓝调时刻，结合城市灯光与天空余晖，拍摄具有电影感的城市天际线。",
        difficulty: "intermediate",
        estimatedTime: "1-2 小时",
        gear: {
            lens: ["16mm（超广角风光）", "10-24mm（变焦灵活）"],
            props: ["三脚架（必备）", "快门线 / App 遥控", "手电筒"],
        },
        settings: {
            aperture: "f/8 ~ f/11",
            shutterSpeed: "1s ~ 15s",
            iso: "160 ~ 800",
            focalLength: "16mm (≈24mm 等效)",
            whiteBalance: "白炽灯 / 荧光灯",
        },
        sections: [
            {
                type: "heading",
                content: "拍摄思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    '城市夜景的核心是"蓝调时刻"——日落后 20-40 分钟，天空呈现深邃蓝色，城市灯光刚刚亮起，天空与地面光比最平衡。提前 1 小时到达踩点，黄金时段拍远景，蓝调时段拍城市。',
            },
            {
                type: "text",
                content:
                    "选择城市制高点（天台/观景台/山腰）或者有水面的位置（形成倒影对称构图）。长曝光可以让车流化为光轨，动静对比增加画面张力。",
            },
            {
                type: "heading",
                content: "拍摄要点",
                level: 3,
            },
            {
                type: "text",
                content:
                    "① 使用 M 档手动曝光，关闭防抖（三脚架下防抖反而会引入抖动）。\n② 开启 2 秒自拍延时或使用快门线，避免按快门的震动。\n③ ISO 锁定 160（X-T5 原生低感），光圈 f/8~f/11 保证景深。\n④ 单张不够亮？使用 1s 曝光多张后期堆栈降噪。",
            },
            {
                type: "tip",
                content:
                    "包里带一只小手电——方便在黑暗中对焦（AF 失效时手动对焦）。可以先在白天预先对好焦，用胶带固定对焦环。",
            },
            {
                type: "settings-table",
                rows: [
                    { label: "拍摄模式", value: "手动 (M)" },
                    { label: "光圈", value: "f/8 ~ f/11" },
                    { label: "快门速度", value: "1s ~ 15s（视光比而定）" },
                    { label: "ISO", value: "160（原生低感最佳）" },
                    { label: "白平衡", value: "白炽灯（约 3200K）" },
                    { label: "胶片模拟", value: "Classic Chrome / Velvia" },
                    { label: "对焦", value: "手动对焦 → ∞ 稍回" },
                ],
            },
            {
                type: "heading",
                content: "后期思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    "先降噪（夜景噪点不可避免），再强化蓝橙对比。提高蓝色饱和度让天空更纯净，橙色/黄色偏向城市灯光。注意暗部细节不要死黑，可稍微提亮阴影。",
            },
        ],
    },
    {
        id: "japanese-street",
        title: "日系街拍",
        subtitle: "市井巷弄的人文纪实",
        coverGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        coverEmoji: "/assets/plans/street/banner.png",
        tags: ["街拍", "人文", "日系", "快拍"],
        category: "street",
        summary:
            "穿梭在城市巷弄中捕捉日常瞬间，利用光影和构图讲述街头故事。轻装出行，拍摄不打扰。",
        difficulty: "intermediate",
        estimatedTime: "1-2 小时",
        gear: {
            lens: ["23mm（经典街拍焦段）", "35mm（人文视角）"],
            props: ["腕带（非颈带）", "备用电池", "轻便背包"],
        },
        settings: {
            aperture: "f/2.8 ~ f/5.6",
            shutterSpeed: "1/250s ~ 1/500s",
            iso: "400 ~ 1600",
            focalLength: "23mm / 35mm",
            whiteBalance: "自动（或日光）",
        },
        sections: [
            {
                type: "heading",
                content: "拍摄思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    '日系街拍的核心是"少即是多"。不追求大场景，而是寻找有秩序感的细节：等红灯的路人、穿过光影的单车、雨后的积水倒影。',
            },
            {
                type: "text",
                content:
                    '设置好曝光参数后专注于"看"和"等"——找到一个好的背景（光影/色彩/几何），等待合适的人物走进画面。"预构图 + 等人"是街拍的基本功。',
            },
            {
                type: "heading",
                content: "机位技巧",
                level: 3,
            },
            {
                type: "text",
                content:
                    "① 腰部高度盲拍：相机挂在胸前，用区域对焦 + 小光圈，不看取景器拍摄。\n② 转角反射：利用商店橱窗玻璃的反光叠加人物与街景。\n③ 光影切割：找有强烈明暗分界的位置，人物从暗部走入光影的瞬间按下快门。\n④ 色彩呼应：寻找服装颜色与环境颜色的巧合搭配。",
            },
            {
                type: "tip",
                content:
                    "使用区域对焦（Snap Focus）配合小光圈（f/5.6+），提前设置好 2m / 3m 对焦距离，抬手就能拍，不需要等对焦。",
            },
            {
                type: "settings-table",
                rows: [
                    { label: "拍摄模式", value: "光圈优先 (A)" },
                    { label: "光圈", value: "f/2.8 ~ f/5.6" },
                    {
                        label: "快门速度",
                        value: "1/250s ~ 1/500s（安全快门优先）",
                    },
                    { label: "ISO", value: "400 ~ 1600（自动 ISO 设上限）" },
                    { label: "白平衡", value: "自动（晴天固定日光更一致）" },
                    { label: "胶片模拟", value: "Classic Chrome / Acros" },
                    { label: "对焦模式", value: "区域对焦 / 手动预对焦" },
                ],
            },
            {
                type: "heading",
                content: "后期思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    "日系街拍后期克制。轻微提升阴影、降低对比度、饱和度 -0.5~1 档。色调偏青或偏暖保持一致即可，不需要每张单独调色。",
            },
        ],
    },
    {
        id: "food-still-life",
        title: "静物美食",
        subtitle: "咖啡馆里的氛围感食物拍摄",
        coverGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        coverEmoji: "/assets/plans/food/banner.png",
        tags: ["静物", "美食", "近摄", "自然光"],
        category: "still-life",
        summary:
            "在咖啡馆/餐厅用自然光拍摄食物，从俯拍、斜侧、平视三个角度捕捉食物的质感与氛围。",
        difficulty: "beginner",
        estimatedTime: "1-2 小时",
        gear: {
            lens: ["33mm（标准视角）", "56mm（中焦特写）", "80mm（微距细节）"],
            props: ["窗边位（自然光）", "白色卡纸（补光/反光）", "喷水壶"],
        },
        settings: {
            aperture: "f/2.0 ~ f/4.0",
            shutterSpeed: "1/60s ~ 1/125s",
            iso: "200 ~ 800",
            focalLength: "33mm ~ 56mm",
            whiteBalance: "自动（或保持现场色温）",
        },
        sections: [
            {
                type: "heading",
                content: "拍摄思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    '食物拍摄的核心是"质感"和"氛围"。不要贪多，专注一个主体（单品展示永远比大合照好看）。利用侧逆光突出食物表面纹理——咖啡的油脂、汤面的热气、面包的焦脆。',
            },
            {
                type: "text",
                content:
                    '三个万能角度：俯拍（45° 俯视，适合摆盘布置）、45° 斜侧（最接近人眼视角）、90° 平视（适合千层/饮品层次）。点餐时选窗边位，自然光是性价比最高的"补光设备"。',
            },
            {
                type: "heading",
                content: "摆盘心法",
                level: 3,
            },
            {
                type: "text",
                content:
                    "① 三角构图：主食物 + 配饰（餐巾/餐具）+ 环境元素（菜单/花）构成三角。\n② 留白：不要让画面太满，留白让视线聚焦食物本身。\n③ 动态元素：正冒热气的咖啡、正在倾倒的酱汁、刚撒下的糖粉。\n④ 层次感：背景模糊（大光圈），前景放些虚化的餐具，增加空间感。",
            },
            {
                type: "tip",
                content:
                    "拍摄前用喷壶在食材上喷细微水珠，看起来更新鲜。汤面/拉面趁热拍，冷了卖相大减。咖啡表面奶泡的拉花要在 30 秒内拍完。",
            },
            {
                type: "settings-table",
                rows: [
                    { label: "拍摄模式", value: "光圈优先 (A)" },
                    { label: "光圈", value: "f/2.0 ~ f/4.0（视主体大小）" },
                    { label: "快门速度", value: "1/60s ~ 1/125s（手持下限）" },
                    { label: "ISO", value: "200 ~ 800（暗光可到 1600）" },
                    {
                        label: "白平衡",
                        value: "保持现场色温（不要强行暖改冷）",
                    },
                    { label: "胶片模拟", value: "Astia / Classic Chrome" },
                    { label: "对焦", value: "单点 AF-S → 食物主体" },
                ],
            },
            {
                type: "heading",
                content: "后期思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    '重点是色彩还原和白平衡校正。适当提高饱和度让食物看起来更诱人，但不要过度——"看起来好吃"比"看起来鲜艳"重要。轻微提高清晰度纹理可以增强食物质感。',
            },
        ],
    },
    {
        id: "architecture-light",
        title: "建筑光影",
        subtitle: "几何线条的光影游戏",
        coverGradient:
            "linear-gradient(135deg, #0c3483 0%, #a2b6df 50%, #6b8cce 100%)",
        coverEmoji: "/assets/plans/architecture/banner.png",
        tags: ["建筑", "几何", "光影", "极简"],
        category: "architecture",
        summary:
            "捕捉建筑中的几何线条与光影关系，利用对称、重复、节奏感构图，拍摄具有建筑美感的结构摄影作品。",
        difficulty: "intermediate",
        estimatedTime: "2-3 小时",
        gear: {
            lens: [
                "10-24mm（超广角建筑）",
                "16mm（大场景）",
                "50-140mm（局部特写）",
            ],
            props: ["CPL 偏振镜（强烈推荐）", "水平仪", "超广角镜头"],
        },
        settings: {
            aperture: "f/5.6 ~ f/11",
            shutterSpeed: "1/60s ~ 1/250s",
            iso: "200 ~ 800",
            focalLength: "10-24mm（超广角为主）",
            whiteBalance: "日光",
        },
        sections: [
            {
                type: "heading",
                content: "拍摄思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    '建筑摄影不只是"拍一栋建筑"，而是拍建筑的设计语言。关注：重复的窗格形成的节奏感、螺旋楼梯的动势、玻璃幕墙的倒映、钢结构的光影切割。抽象化、几何化、图形化——这是建筑摄影和普通打卡照的区别。',
            },
            {
                type: "text",
                content:
                    "最佳时间是上午 10 点前和下午 3 点后，低角度阳光在建筑表面拉出长影，产生强烈的明暗对比。使用超广角体现建筑张力，使用长焦抓取局部细节。",
            },
            {
                type: "heading",
                content: "万能取景公式",
                level: 3,
            },
            {
                type: "text",
                content:
                    "① 对称构图：找到建筑的中轴线，站在正中央拍摄。\n② 引导线：利用走廊、楼梯、坡道等线性元素引导视线至主体。\n③ 框架构图：利用门窗洞口作为画中画，框住远处的建筑。\n④ 极简留白：大面积纯色墙面 + 极小的人物点缀（比例参照）。\n⑤ 反射倒映：下雨后地面的积水、玻璃幕墙的反射是天然镜面。",
            },
            {
                type: "tip",
                content:
                    "CPL 偏振镜是建筑摄影的利器——可以消除玻璃反光、加深天空蓝色、增强建筑墙面质感。超广角拍建筑时注意保持水平，垂直线的汇聚是视觉张力，过度的倾斜是构图失误。",
            },
            {
                type: "settings-table",
                rows: [
                    { label: "拍摄模式", value: "光圈优先 (A), 曝光补偿 ±0" },
                    { label: "光圈", value: "f/5.6 ~ f/11（保证全景深）" },
                    { label: "快门速度", value: "1/60s ~ 1/250s" },
                    { label: "ISO", value: "200 ~ 800" },
                    { label: "白平衡", value: "日光（统一冷暖基调）" },
                    { label: "胶片模拟", value: "Classic Chrome / Acros" },
                    { label: "专用配件", value: "CPL 偏振镜（强烈推荐）" },
                ],
            },
            {
                type: "heading",
                content: "后期思路",
                level: 2,
            },
            {
                type: "text",
                content:
                    '建筑摄影后期重点是"横平竖直"——透视校正（Lightroom 自动 Upright 功能）。强化线条清晰度（提高纹理 + 清晰度），控制色温统一。黑白调色（Acros 模拟）可以去除色彩干扰，只留下黑白灰的光影关系。',
            },
        ],
    },
]

/** 判断字符串是否为图片路径（而非 emoji） */
export function isImagePath(s: string): boolean {
    return /\.(png|jpe?g|webp|gif|svg|avif|bmp|tiff?)/i.test(s)
}
