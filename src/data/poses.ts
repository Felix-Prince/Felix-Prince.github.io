export type BasePoseType =
    | "standing"
    | "sitting"
    | "squatting"
    | "lying"
    | "crawl"

export interface Pose {
    id: string
    name: string
    basePose: BasePoseType
    variation: number
    scenes: string[]
    description: string
    tip: string
    difficulty: "easy" | "medium" | "hard"
    imagePath: string
}

export const POSE_CATEGORIES = [
    { id: "all", label: "全部" },
    { id: "standing", label: "站姿" },
    { id: "sitting", label: "坐姿" },
    { id: "squatting", label: "蹲姿" },
    { id: "lying", label: "躺姿" },
    { id: "crawl", label: "趴姿" },
] as const

export const BASE_POSE_LABELS: Record<string, string> = {
    standing: "站姿",
    sitting: "坐姿",
    squatting: "蹲姿",
    lying: "躺姿",
    crawl: "趴姿",
}

export const DIFFICULTY_STARS: Record<string, string> = {
    easy: "⭐",
    medium: "⭐⭐",
    hard: "⭐⭐⭐",
}

export const poses: Pose[] = [
    // ========== 站姿 (×5) ==========
    {
        id: "stand-natural",
        name: "自然站立",
        basePose: "standing",
        variation: 1,
        scenes: ["portrait", "street"],
        description: "右脚微屈，置于左前方。",
        tip: "整体相对放松写意。",
        difficulty: "easy",
        imagePath: "/pose/stand/1.png",
    },
    {
        id: "stand-turn-back",
        name: "插兜站立",
        basePose: "standing",
        variation: 2,
        scenes: ["portrait", "street"],
        description: "单脚站直，另一只脚向外向后脚尖踮地。",
        tip: "稍显酷酷的形象。",
        difficulty: "medium",
        imagePath: "/pose/stand/2.png",
    },
    {
        id: "stand-lean-wall",
        name: "单脚站立",
        basePose: "standing",
        variation: 3,
        scenes: ["portrait", "street"],
        description:
            "单脚站立，另一只脚屈膝抬起，一手举高比耶，另一个手外伸保持身体平衡。",
        tip: "整体更显活泼好动。",
        difficulty: "medium",
        imagePath: "/pose/stand/3.png",
    },
    {
        id: "stand-hand-hat",
        name: "手扶前额",
        basePose: "standing",
        variation: 4,
        scenes: ["portrait"],
        description:
            "一手轻额前头发，另一手自然垂放或插兜，身体微后仰。双脚交叉站立。",
        tip: "酷酷的。",
        difficulty: "medium",
        imagePath: "/pose/stand/4.png",
    },
    {
        id: "stand-cross-arm",
        name: "单脚站立2",
        basePose: "standing",
        variation: 5,
        scenes: ["portrait", "street"],
        description:
            "单脚站立，另一只脚屈膝抬起，一手举高比耶于头部，另一个手插腰保持身体平衡。",
        tip: "灵动活泼。",
        difficulty: "easy",
        imagePath: "/pose/stand/5.png",
    },

    // ========== 坐姿 (×5) ==========
    {
        id: "sit-chair",
        name: "侧坐",
        basePose: "sitting",
        variation: 1,
        scenes: ["portrait", "indoor"],
        description:
            "坐在椅子上，双腿并拢微倾，手放扶扶手。经典室内人像坐姿，端庄大方。",
        tip: "不要让模特坐满整张椅子，坐 1/3 位置身体会更挺拔。",
        difficulty: "easy",
        imagePath: "/pose/sit/1.png",
    },
    {
        id: "sit-cross",
        name: "正襟危坐",
        basePose: "sitting",
        variation: 2,
        scenes: ["portrait", "indoor", "nature"],
        description: "板板正正的坐立。",
        tip: "板板正正的坐立。",
        difficulty: "medium",
        imagePath: "/pose/sit/2.png",
    },
    {
        id: "sit-side",
        name: "二郎腿",
        basePose: "sitting",
        variation: 3,
        scenes: ["portrait", "indoor", "nature"],
        description: "一手搭在膝盖上，双脚二郎腿交叉坐，另一个手扶前额秀发。",
        tip: "优雅端庄",
        difficulty: "medium",
        imagePath: "/pose/sit/3.png",
    },
    {
        id: "sit-stool",
        name: "盘腿坐",
        basePose: "sitting",
        variation: 4,
        scenes: ["portrait", "indoor"],
        description: "盘腿坐立",
        tip: "盘腿坐立",
        difficulty: "medium",
        imagePath: "/pose/sit/4.png",
    },
    {
        id: "sit-chin-hand",
        name: "坐姿托腮",
        basePose: "sitting",
        variation: 5,
        scenes: ["portrait", "indoor"],
        description:
            "坐在椅上，一手托腮，另一手放在桌上或膝上。若有所思的文艺坐姿，适合咖啡馆、书房等环境。",
        tip: "托腮时手不要用力挤压脸部，轻轻托着即可，避免面部变形。",
        difficulty: "easy",
        imagePath: "/pose/sit/5.png",
    },

    // ========== 蹲姿 (×8) ==========
    {
        id: "squat-full",
        name: "蹲身手平摊",
        basePose: "squatting",
        variation: 1,
        scenes: ["portrait", "nature"],
        description: "全蹲姿势，单手平摊成介绍姿态。",
        tip: "全蹲时注意不要让大腿挤压腹部显得臃肿，微微侧身更显瘦。",
        difficulty: "hard",
        imagePath: "/pose/squat/4.png",
    },
    {
        id: "squat-kneel",
        name: "全蹲",
        basePose: "squatting",
        variation: 2,
        scenes: ["portrait", "nature"],
        description: "蹲下，双手抱拳放于下巴处",
        tip: "更显俏皮可爱",
        difficulty: "medium",
        imagePath: "/pose/squat/2.png",
    },
    {
        id: "squat-half",
        name: "全蹲-弗秀发",
        basePose: "squatting",
        variation: 3,
        scenes: ["portrait", "nature", "street"],
        description: "全蹲，一手扶秀发，一手房膝盖上前伸",
        tip: "",
        difficulty: "medium",
        imagePath: "/pose/squat/3.png",
    },
    {
        id: "squat-touch",
        name: "蹲身手触地",
        basePose: "squatting",
        variation: 4,
        scenes: ["portrait", "nature"],
        description:
            "单膝蹲下，一手触地或触花，另一手自然垂放。适合花田、海滩等场景，与环境互动感强。",
        tip: "触地的手不用真的撑地，轻轻触碰即可。配合低角度拍摄让前景虚化更有层次。",
        difficulty: "hard",
        imagePath: "/pose/squat/1.png",
    },
    {
        id: "squat-side",
        name: "蹲姿撑下巴",
        basePose: "squatting",
        variation: 5,
        scenes: ["portrait", "street"],
        description:
            "全蹲单手撑下巴，另一手自然垂放。适合街拍或与建筑物互动的场景，带点酷酷的感觉。",
        tip: "撑下巴时让肘部稍微向外张开，身体微微侧转，画面更有层次感。",
        difficulty: "medium",
        imagePath: "/pose/squat/5.png",
    },
    {
        id: "squat-leg-cross",
        name: "蹲姿抱膝",
        basePose: "squatting",
        variation: 6,
        scenes: ["portrait", "nature"],
        description:
            "全蹲并将双手环抱膝盖，身体蜷缩。可爱俏皮的蹲姿，适合轻松氛围的拍摄。",
        tip: "抱膝时背部微微弓起，头搭在膝盖上，画面更有安心感。",
        difficulty: "hard",
        imagePath: "/pose/squat/6.png",
    },
    {
        id: "squat-side-look",
        name: "蹲姿回眸",
        basePose: "squatting",
        variation: 7,
        scenes: ["portrait", "street"],
        description:
            "蹲姿并转头看向侧后方，一手扶膝一手自然垂放。带故事感的蹲姿，适合街拍抓拍。",
        tip: "回眸时身体跟随头部稍微转动，不要只转头不转体，否则显得僵硬。",
        difficulty: "medium",
        imagePath: "/pose/squat/8.png",
    },
    {
        id: "squat-chin",
        name: "蹲姿侧面",
        basePose: "squatting",
        variation: 8,
        scenes: ["portrait", "indoor"],
        description: "蹲姿的侧面样子，",
        tip: "从侧面去拍一个人的时候，注意让模特的下巴微微抬起，这样颈部线条会更优美，脸部轮廓也会更清晰。",
        difficulty: "easy",
        imagePath: "/pose/squat/7.png",
    },

    // ========== 趴姿 (×4) ==========
    {
        id: "crawl-flat",
        name: "肘撑趴",
        basePose: "crawl",
        variation: 1,
        scenes: ["portrait", "nature"],
        description:
            "双肘撑地支撑上半身，双腿伸直，双手托腮或持物。比平趴更有动感，适合互动型拍摄。",
        tip: "平趴时让模特用肘部支撑上半身，比完全趴平更好看，也能避免脸部被挤压。",
        difficulty: "easy",
        imagePath: "/pose/crawl/1.png",
    },
    {
        id: "crawl-elbow",
        name: "肘撑趴",
        basePose: "crawl",
        variation: 2,
        scenes: ["portrait", "nature"],
        description:
            "双肘撑地支撑上半身，双腿伸直，双手托腮或持物。比平趴更有动感，适合互动型拍摄。",
        tip: "肘撑时背部要挺直，不要塌腰。双手托腮的角度要自然，不要太用力挤压脸部。",
        difficulty: "medium",
        imagePath: "/pose/crawl/2.png",
    },
    {
        id: "crawl-side",
        name: "侧趴",
        basePose: "crawl",
        variation: 3,
        scenes: ["portrait", "nature"],
        description:
            "侧身趴卧，一手撑头一手向前伸展，双腿微曲。慵懒性感的趴姿，适合午后阳光的氛围感拍摄。",
        tip: "侧趴时撑头的手臂不要完全伸直，微微弯曲更自然。视线看向远方更有故事感。",
        difficulty: "medium",
        imagePath: "/pose/crawl/3.png",
    },
    {
        id: "crawl-leg-up",
        name: "侧趴托腮",
        basePose: "crawl",
        variation: 4,
        scenes: ["portrait", "nature"],
        description:
            "侧趴托腮看镜头，双腿微曲并抬起。俏皮可爱的趴姿，适合花田、草地等自然场景。",
        tip: "侧趴托腮时让模特的腿微微抬起，增加画面动感和层次感。",
        difficulty: "hard",
        imagePath: "/pose/crawl/4.png",
    },

    // ========== 躺姿 (×5) ==========
    {
        id: "lie-back",
        name: "仰躺",
        basePose: "lying",
        variation: 1,
        scenes: ["portrait", "nature"],
        description:
            "平躺，双手自然放在腹部或两侧或包头，双腿自然伸直。适合花海俯拍、床照等场景，画面宁静柔美。",
        tip: "俯拍仰躺姿势时，让模特头发自然散开，闭眼微笑，画面感最治愈。",
        difficulty: "easy",
        imagePath: "/pose/lie/2.png",
    },
    {
        id: "lie-side",
        name: "侧躺",
        basePose: "lying",
        variation: 2,
        scenes: ["portrait", "nature"],
        description:
            "侧身躺卧，身体微曲呈 C 形，一手枕着头一手放在身侧。经典的侧躺姿势，能很好展现身体曲线。",
        tip: "侧躺时让模特上面的腿微微弯曲，比直腿更有曲线美。",
        difficulty: "medium",
        imagePath: "/pose/lie/1.png",
    },
    {
        id: "lie-knee-side",
        name: "屈膝侧躺",
        basePose: "lying",
        variation: 3,
        scenes: ["portrait", "indoor"],
        description:
            "侧躺并将双膝弯曲收起，靠近胸前，双手放在身前。如婴儿般的蜷缩姿势，画面温馨有安全感。",
        tip: "屈膝的角度不要太大，微微弯曲就好，太紧会显得拘谨。",
        difficulty: "medium",
        imagePath: "/pose/lie/4.png",
    },
    {
        id: "lie-leg-up",
        name: "抬腿躺",
        basePose: "lying",
        variation: 4,
        scenes: ["portrait", "indoor"],
        description:
            "仰躺并将一条腿向上抬起弯曲，另一条腿自然伸直。俏皮活泼的躺姿，适合活泼风格的人像。",
        tip: "抬腿的角度在 45° 左右最自然，注意不要让裙子走光。",
        difficulty: "hard",
        imagePath: "/pose/lie/3.png",
    },
    {
        id: "lie-back-arm-up",
        name: "仰躺",
        basePose: "lying",
        variation: 5,
        scenes: ["portrait", "nature"],
        description:
            "仰躺单手放于腹部，双腿放松自然屈膝。舒展放松的姿态，适合草地、海滩等户外场景。",
        tip: "双手举过头顶时让手腕放松下垂，比僵硬的伸直更自然。",
        difficulty: "easy",
        imagePath: "/pose/lie/5.png",
    },
]
