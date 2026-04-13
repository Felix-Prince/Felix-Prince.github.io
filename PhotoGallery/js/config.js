const defaultConfig = {
  site: {
    title: "Felix's Photography",
    subtitle: "捕捉瞬间，记录光影",
    logo: "",
    favicon: "",
    description: "个人摄影作品集"
  },
  theme: {
    colors: {
      bg: "#0a0a0f",
      bgElevated: "rgba(255, 255, 255, 0.04)",
      bgElevatedHover: "rgba(255, 255, 255, 0.08)",
      border: "rgba(255, 255, 255, 0.1)",
      borderStrong: "rgba(255, 255, 255, 0.15)",
      textPrimary: "#fafafa",
      textSecondary: "rgba(255, 255, 255, 0.6)",
      textMuted: "rgba(255, 255, 255, 0.4)",
      accent: "#ff6b6b",
      accentSecondary: "#4ecdc4",
      accentTertiary: "#ffe66d",
      gradient1: "#ff6b6b",
      gradient2: "#feca57",
      gradient3: "#48dbfb",
      gradient4: "#ff9ff3"
    },
    fonts: {
      heading: "Playfair Display, Georgia, serif",
      body: "Noto Sans SC, -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "JetBrains Mono, monospace"
    },
    spacing: {
      unit: "8px",
      contentMaxWidth: "1400px"
    }
  },
  navigation: {
    backLink: {
      label: "返回首页",
      href: "../index.html"
    },
    links: []
  },
  gallery: {
    defaultView: "grid",
    itemsPerPage: 50,
    enableTimeline: true,
    enableSearch: true,
    enableDateFilter: true
  }
};

let currentConfig = null;

async function loadConfig() {
  try {
    const response = await fetch("theme.config.json");
    if (!response.ok) throw new Error("Config not found");
    const userConfig = await response.json();
    currentConfig = deepMerge(defaultConfig, userConfig);
  } catch (error) {
    console.warn("Using default config:", error.message);
    currentConfig = { ...defaultConfig };
  }
  applyTheme();
  return currentConfig;
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function applyTheme() {
  if (!currentConfig) return;
  const root = document.documentElement;
  const colors = currentConfig.theme.colors;
  const fonts = currentConfig.theme.fonts;

  if (colors) {
    for (const [key, value] of Object.entries(colors)) {
      const cssVar = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    }
  }

  if (fonts) {
    if (fonts.heading) root.style.setProperty("--font-heading", fonts.heading);
    if (fonts.body) root.style.setProperty("--font-body", fonts.body);
    if (fonts.mono) root.style.setProperty("--font-mono", fonts.mono);
  }

  if (currentConfig.theme.spacing) {
    if (currentConfig.theme.spacing.unit) {
      root.style.setProperty("--spacing-unit", currentConfig.theme.spacing.unit);
    }
    if (currentConfig.theme.spacing.contentMaxWidth) {
      root.style.setProperty("--content-max-width", currentConfig.theme.spacing.contentMaxWidth);
    }
  }
}

function getConfig() {
  return currentConfig || defaultConfig;
}
