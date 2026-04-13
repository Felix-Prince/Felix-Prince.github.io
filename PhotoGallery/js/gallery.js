let photos = [];
let filteredPhotos = [];
let selectedTags = new Set();
let searchQuery = "";
let dateStart = "";
let dateEnd = "";
let currentView = "grid";
let currentPhotoIndex = 0;
let lazyLoadObserver = null;

async function initGallery() {
  await loadConfig();
  await loadPhotos();
  initFilters();
  initViewToggle();
  initLightbox();
  initLazyLoad();
  updateGallery();
  updateSiteInfo();
}

function updateSiteInfo() {
  const config = getConfig();
  document.title = config.site.title;

  const siteTitleEl = document.querySelector(".site-title");
  const siteSubtitleEl = document.querySelector(".site-subtitle");
  const backLinkEl = document.querySelector(".back-link");
  const backLinkTextEl = document.querySelector(".back-link-text");

  if (siteTitleEl) siteTitleEl.textContent = config.site.title;
  if (siteSubtitleEl) siteSubtitleEl.textContent = config.site.subtitle;

  if (config.navigation.backLink) {
    if (backLinkEl) backLinkEl.href = config.navigation.backLink.href;
    if (backLinkTextEl) backLinkTextEl.textContent = config.navigation.backLink.label;
  }
}

async function loadPhotos() {
  try {
    const response = await fetch("data/photos.json");
    const data = await response.json();
    photos = data.photos || [];
    filteredPhotos = [...photos];
  } catch (error) {
    console.error("Failed to load photos:", error);
    photos = [];
    filteredPhotos = [];
  }
}

function getAllTags() {
  const tagCount = {};
  photos.forEach(photo => {
    photo.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
}

function initFilters() {
  renderTags();

  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear");
  const dateStartInput = document.getElementById("date-start");
  const dateEndInput = document.getElementById("date-end");
  const resetBtn = document.getElementById("reset-filters");
  const clearTagsBtn = document.getElementById("clear-tags");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      updateGallery();
    });
  }

  if (searchClear) {
    searchClear.addEventListener("click", () => {
      searchQuery = "";
      searchInput.value = "";
      updateGallery();
    });
  }

  if (dateStartInput) {
    dateStartInput.addEventListener("change", (e) => {
      dateStart = e.target.value;
      updateGallery();
    });
  }

  if (dateEndInput) {
    dateEndInput.addEventListener("change", (e) => {
      dateEnd = e.target.value;
      updateGallery();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }

  if (clearTagsBtn) {
    clearTagsBtn.addEventListener("click", () => {
      selectedTags.clear();
      renderTags();
      updateGallery();
    });
  }
}

function renderTags() {
  const tagsContainer = document.getElementById("tags-cloud");
  if (!tagsContainer) return;

  const allTags = getAllTags();
  tagsContainer.innerHTML = allTags.map(({ tag, count }) => `
    <button class="tag-btn ${selectedTags.has(tag) ? "active" : ""}" data-tag="${tag}">
      ${tag} <span style="opacity:0.7">(${count})</span>
    </button>
  `).join("");

  tagsContainer.querySelectorAll(".tag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
      } else {
        selectedTags.add(tag);
      }
      renderTags();
      updateGallery();
    });
  });
}

function resetFilters() {
  selectedTags.clear();
  searchQuery = "";
  dateStart = "";
  dateEnd = "";

  const searchInput = document.getElementById("search-input");
  const dateStartInput = document.getElementById("date-start");
  const dateEndInput = document.getElementById("date-end");

  if (searchInput) searchInput.value = "";
  if (dateStartInput) dateStartInput.value = "";
  if (dateEndInput) dateEndInput.value = "";

  renderTags();
  updateGallery();
}

function filterPhotos() {
  filteredPhotos = photos.filter(photo => {
    if (selectedTags.size > 0) {
      const hasMatchingTag = photo.tags.some(tag => selectedTags.has(tag));
      if (!hasMatchingTag) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = photo.title.toLowerCase().includes(query);
      const matchDesc = (photo.description || "").toLowerCase().includes(query);
      const matchTags = photo.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    if (dateStart) {
      if (photo.date < dateStart) return false;
    }
    if (dateEnd) {
      if (photo.date > dateEnd) return false;
    }

    return true;
  });
}

function initViewToggle() {
  const gridBtn = document.getElementById("view-grid");
  const timelineBtn = document.getElementById("view-timeline");

  if (gridBtn) {
    gridBtn.addEventListener("click", () => {
      currentView = "grid";
      updateViewButtons();
      updateGallery();
    });
  }

  if (timelineBtn) {
    timelineBtn.addEventListener("click", () => {
      currentView = "timeline";
      updateViewButtons();
      updateGallery();
    });
  }
}

function updateViewButtons() {
  const gridBtn = document.getElementById("view-grid");
  const timelineBtn = document.getElementById("view-timeline");

  if (gridBtn) gridBtn.classList.toggle("active", currentView === "grid");
  if (timelineBtn) timelineBtn.classList.toggle("active", currentView === "timeline");
}

function updateGallery() {
  filterPhotos();
  updateResultsCount();

  const gridContainer = document.getElementById("photo-grid");
  const timelineContainer = document.getElementById("timeline-view");

  if (currentView === "grid") {
    if (gridContainer) gridContainer.style.display = "grid";
    if (timelineContainer) timelineContainer.classList.remove("active");
    renderGrid();
  } else {
    if (gridContainer) gridContainer.style.display = "none";
    if (timelineContainer) timelineContainer.classList.add("active");
    renderTimeline();
  }
}

function updateResultsCount() {
  const countEl = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");

  if (countEl) {
    countEl.textContent = `${filteredPhotos.length} 张照片`;
  }

  if (emptyState) {
    emptyState.style.display = filteredPhotos.length === 0 ? "block" : "none";
  }
}

function renderGrid() {
  const container = document.getElementById("photo-grid");
  if (!container) return;

  container.innerHTML = filteredPhotos.map((photo, index) => createPhotoCard(photo, index)).join("");
  setupLazyLoad();
  initGridClickHandlers();
}

function createPhotoCard(photo, index) {
  return `
    <article class="photo-card" data-index="${index}">
      <img
        class="lazy-image"
        data-src="${photo.thumbnail || photo.url}"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3C/svg%3E"
        alt="${photo.title}"
        loading="lazy"
      >
      <div class="photo-overlay">
        <h3 class="photo-title">${photo.title}</h3>
        <p class="photo-date">${formatDate(photo.date)}</p>
        <div class="photo-tags">
          ${photo.tags.slice(0, 3).map(tag => `<span class="photo-tag">${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderTimeline() {
  const container = document.getElementById("timeline-view");
  if (!container) return;

  const grouped = {};
  filteredPhotos.forEach(photo => {
    const yearMonth = photo.date.substring(0, 7);
    if (!grouped[yearMonth]) grouped[yearMonth] = [];
    grouped[yearMonth].push(photo);
  });

  const sortedMonths = Object.keys(grouped).sort().reverse();

  container.innerHTML = sortedMonths.map(yearMonth => {
    const photosInMonth = grouped[yearMonth].sort((a, b) => b.date.localeCompare(a.date));
    return `
      <section class="timeline-section">
        <h2 class="timeline-date">${formatYearMonth(yearMonth)}</h2>
        <div class="timeline-grid">
          ${photosInMonth.map((photo, idx) => createPhotoCard(photo, filteredPhotos.indexOf(photo))).join("")}
        </div>
      </section>
    `;
  }).join("");

  setupLazyLoad();
  initTimelineClickHandlers();
}

function initGridClickHandlers() {
  const cards = document.querySelectorAll("#photo-grid .photo-card");
  cards.forEach(card => {
    card.addEventListener("click", () => openLightbox(parseInt(card.dataset.index)));
  });
}

function initTimelineClickHandlers() {
  const cards = document.querySelectorAll("#timeline-view .photo-card");
  cards.forEach(card => {
    card.addEventListener("click", () => openLightbox(parseInt(card.dataset.index)));
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

function formatYearMonth(yearMonth) {
  const [year, month] = yearMonth.split("-");
  const date = new Date(year, parseInt(month) - 1, 1);
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
}

function initLazyLoad() {
  if ("IntersectionObserver" in window) {
    lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          lazyLoadObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: "100px"
    });
  }
}

function setupLazyLoad() {
  if (!lazyLoadObserver) return;
  document.querySelectorAll(".lazy-image[data-src]").forEach(img => {
    lazyLoadObserver.observe(img);
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => navigateLightbox(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => navigateLightbox(1));
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });

  initLightboxSwipe();
}

function openLightbox(index) {
  currentPhotoIndex = index;
  renderLightbox();
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function navigateLightbox(direction) {
  currentPhotoIndex = (currentPhotoIndex + direction + filteredPhotos.length) % filteredPhotos.length;
  renderLightbox();
}

function renderLightbox() {
  const photo = filteredPhotos[currentPhotoIndex];
  if (!photo) return;

  const img = document.getElementById("lightbox-image");
  const title = document.getElementById("lightbox-title");
  const description = document.getElementById("lightbox-description");
  const tags = document.getElementById("lightbox-tags");
  const date = document.getElementById("lightbox-date");
  const camera = document.getElementById("lightbox-camera");
  const settings = document.getElementById("lightbox-settings");

  if (img) img.src = photo.url;
  if (title) title.textContent = photo.title;
  if (description) description.textContent = photo.description || "";
  if (tags) {
    tags.innerHTML = photo.tags.map(tag => `<span class="lightbox-tag">${tag}</span>`).join("");
  }
  if (date) date.textContent = formatDate(photo.date);
  if (camera) camera.textContent = photo.camera || "-";
  if (settings) settings.textContent = photo.settings || "-";
}

function initLightboxSwipe() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      navigateLightbox(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", initGallery);
