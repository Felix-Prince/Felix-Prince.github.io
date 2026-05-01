const defaultConfig = {
  site: {
    title: "Photography",
    subtitle: "Personal Works",
    logo: "",
    favicon: "",
    description: "Personal Photography Gallery"
  },
  theme: {
    colors: {
      white: "#ffffff",
      offWhite: "#fafafa",
      cream: "#f7f5f2",
      gray100: "#f0f0f0",
      gray200: "#e6e6e6",
      gray300: "#d1d1d1",
      gray500: "#8a8a8a",
      gray600: "#6b6b6b",
      gray700: "#4a4a4a",
      gray900: "#1a1a1a",
      black: "#000000",
      accent: "#c9a76e",
      accentHover: "#b8945a"
    },
    fonts: {
      display: "Playfair Display, Georgia, serif",
      body: "Helvetica Neue, Arial, sans-serif",
      mono: "JetBrains Mono, monospace"
    }
  },
  navigation: {
    backLink: {
      label: "Back to Home",
      href: "../index.html"
    }
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

function getConfig() {
  return currentConfig || defaultConfig;
}
