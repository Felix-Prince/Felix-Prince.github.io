let photos = [];
let currentSlideIndex = 0;
let currentPhotoIndex = 0;
let slideInterval = null;

async function initGallery() {
  await loadConfig();
  await loadPhotos();
  initHeroSlider();
  renderCollections();
  initLightbox();
  initHeaderScroll();
  updateSiteInfo();
}

function updateSiteInfo() {
  const config = getConfig();
  document.title = config.site.title;

  const logoEl = document.getElementById('logo-text');
  const heroTitleEl = document.getElementById('hero-title');
  const heroSubtitleEl = document.getElementById('hero-subtitle');
  const collectionsLabelEl = document.getElementById('collections-label');
  const collectionsTitleEl = document.getElementById('collections-title');
  const backLinkEl = document.getElementById('back-link');
  const backLinkTextEl = document.getElementById('back-link-text');

  if (logoEl && config.site.title) logoEl.textContent = config.site.title;
  if (heroTitleEl && config.site.heroTitle) heroTitleEl.textContent = config.site.heroTitle;
  if (heroSubtitleEl && config.site.heroSubtitle) heroSubtitleEl.textContent = config.site.heroSubtitle;
  if (collectionsLabelEl && config.site.collectionsLabel) collectionsLabelEl.textContent = config.site.collectionsLabel;
  if (collectionsTitleEl && config.site.collectionsTitle) collectionsTitleEl.textContent = config.site.collectionsTitle;

  if (config.navigation && config.navigation.backLink) {
    if (backLinkEl && config.navigation.backLink.href) backLinkEl.href = config.navigation.backLink.href;
    if (backLinkTextEl && config.navigation.backLink.label) backLinkTextEl.textContent = config.navigation.backLink.label;
  }
}

async function loadPhotos() {
  try {
    const response = await fetch("data/photos.json");
    const data = await response.json();
    photos = data.photos || [];
  } catch (error) {
    console.error("Failed to load photos:", error);
    photos = [];
  }
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initHeroSlider() {
  renderHeroSlides();
  startAutoSlide();
  initSliderNavigation();
}

function renderHeroSlides() {
  const slidesContainer = document.querySelector('.hero-slides');
  const navContainer = document.querySelector('.hero-nav');

  if (!slidesContainer) return;

  const heroPhotos = photos.slice(0, Math.min(5, photos.length));

  slidesContainer.innerHTML = heroPhotos.map((photo, index) => `
    <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
      <img src="${photo.url}" alt="${photo.title}">
    </div>
  `).join('');

  if (navContainer) {
    navContainer.innerHTML = heroPhotos.map((_, index) => `
      <button class="hero-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
    `).join('');
  }
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    goToSlide(currentSlideIndex + 1);
  }, 5000);
}

function initSliderNavigation() {
  const navContainer = document.querySelector('.hero-nav');
  if (!navContainer) return;

  navContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.hero-dot');
    if (dot) {
      const index = parseInt(dot.dataset.index);
      goToSlide(index);
      resetAutoSlide();
    }
  });
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');

  if (slides.length === 0) return;

  currentSlideIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlideIndex);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlideIndex);
  });
}

function resetAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
  startAutoSlide();
}

function getCollections() {
  const collections = {};
  photos.forEach(photo => {
    const collection = photo.collection || 'Uncategorized';
    if (!collections[collection]) {
      collections[collection] = [];
    }
    collections[collection].push(photo);
  });
  return collections;
}

function renderCollections() {
  const container = document.getElementById('collections-container');
  if (!container) return;

  const collections = getCollections();

  container.innerHTML = Object.entries(collections).map(([collectionName, collectionPhotos]) => `
    <div class="collection">
      <div class="collection-header">
        <h3 class="collection-title">${collectionName}</h3>
        <span class="collection-count">${collectionPhotos.length} works</span>
      </div>
      <div class="book">
        <div class="book-inner">
          <div class="book-spine"></div>
          <div class="book-pages">
            ${collectionPhotos.slice(0, 6).map((photo, index) => createBookPage(photo, index)).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  initBookPageClickHandlers();
}

function createBookPage(photo, index) {
  const photoIndex = photos.indexOf(photo);
  return `
    <div class="book-page" data-index="${photoIndex}">
      <img src="${photo.thumbnail || photo.url}" alt="${photo.title}" loading="lazy">
      <div class="book-page-overlay">
        <h4 class="book-page-title">${photo.title}</h4>
      </div>
    </div>
  `;
}

function initBookPageClickHandlers() {
  const pages = document.querySelectorAll('.book-page');
  pages.forEach(page => {
    page.addEventListener('click', () => {
      const index = parseInt(page.dataset.index);
      openLightbox(index);
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-nav.prev');
  const nextBtn = document.querySelector('.lightbox-nav.next');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateLightbox(1));
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  initLightboxSwipe();
}

function openLightbox(index) {
  currentPhotoIndex = index;
  renderLightbox();
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  currentPhotoIndex = (currentPhotoIndex + direction + photos.length) % photos.length;
  renderLightbox();
}

function renderLightbox() {
  const photo = photos[currentPhotoIndex];
  if (!photo) return;

  const img = document.querySelector('.lightbox-image');
  if (img) img.src = photo.url;
}

function initLightboxSwipe() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      navigateLightbox(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initGallery);
