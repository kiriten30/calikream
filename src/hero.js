/**
 * CALIKREAM — Hero Section Frame Animation
 * Buttery-smooth scroll-driven frame + text transitions.
 * Text exits upward with scale+blur when scrolling down,
 * exits downward when scrolling back up.
 */
(function () {
  'use strict';

  const FRAME_COUNT = 5;
  const FRAME_PATH = 'frames/framea';
  const FRAME_EXT = '.png';
  const STAGE_COUNT = 5;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const heroWrapper = document.getElementById('hero-wrapper');
  const glow = document.getElementById('hero-glow');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const stages = [];

  for (let i = 0; i < STAGE_COUNT; i++) {
    const el = document.getElementById('hero-stage-' + i);
    if (el) stages.push(el);
  }

  // ---- Canvas sizing ----
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ---- Image loading ----
  const images = [];
  let loadedCount = 0;
  let allLoaded = false;

  function preloadImages() {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH + i + FRAME_EXT;
      img.onload = function () {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          allLoaded = true;
          renderFrame(0);
        }
      };
      img.onerror = function () {
        console.warn('Failed to load frame:', img.src);
        loadedCount++;
        if (loadedCount === FRAME_COUNT) allLoaded = true;
      };
      images.push(img);
    }
  }

  // ---- Draw frame on canvas ----
  function renderFrame(index) {
    if (!allLoaded || !images[index]) return;

    const img = images[index];
    const cW = canvas.width;
    const cH = canvas.height;

    // Cover the canvas (object-fit: cover)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cW / cH;
    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = cW;
      drawH = cW / imgRatio;
      drawX = 0;
      drawY = (cH - drawH) / 2;
    } else {
      drawH = cH;
      drawW = cH * imgRatio;
      drawX = (cW - drawW) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, cW, cH);
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, cW, cH);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // ---- Smooth scroll state ----
  let currentStage = 0;
  let currentFrame = 0;
  let lastProgress = 0;
  let ticking = false;

  function getScrollProgress() {
    const rect = heroWrapper.getBoundingClientRect();
    const wrapperHeight = heroWrapper.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / wrapperHeight));
  }

  // ---- Directional text transition ----
  function transitionStage(fromIndex, toIndex, direction) {
    const fromEl = stages[fromIndex];
    const toEl = stages[toIndex];

    if (fromEl) {
      // Remove all state classes first
      fromEl.classList.remove('active', 'exit-up', 'exit-down');
      // Add exit direction class
      if (direction === 'down') {
        fromEl.classList.add('exit-up');
      } else {
        fromEl.classList.add('exit-down');
      }
    }

    if (toEl) {
      // Clean up any exit states, add active
      toEl.classList.remove('exit-up', 'exit-down');
      toEl.classList.add('active');
    }
  }

  function updateHero() {
    const progress = getScrollProgress();
    const direction = progress > lastProgress ? 'down' : 'up';

    // Frame index — smooth frame switching
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(progress * FRAME_COUNT)
    );

    if (frameIndex !== currentFrame) {
      currentFrame = frameIndex;
      renderFrame(currentFrame);
    }

    // Stage index — buttery text transitions
    const stageIndex = Math.min(
      STAGE_COUNT - 1,
      Math.floor(progress * STAGE_COUNT)
    );

    if (stageIndex !== currentStage) {
      transitionStage(currentStage, stageIndex, direction);
      currentStage = stageIndex;
    }

    // Glow intensity — smooth interpolation
    if (glow) {
      const glowOpacity = progress * 0.5;
      const glowSize = 400 + progress * 600;
      glow.style.width = glowSize + 'px';
      glow.style.height = glowSize + 'px';
      glow.style.background = 'radial-gradient(ellipse at center, rgba(255, 92, 0, ' + glowOpacity + ') 0%, transparent 70%)';
    }

    // Scroll indicator fade
    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, 1 - progress * 6);
    }

    lastProgress = progress;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHero);
      ticking = true;
    }
  }

  // ---- Init ----
  function init() {
    resizeCanvas();
    preloadImages();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      resizeCanvas();
      renderFrame(currentFrame);
    });

    // Initial state: first stage active
    if (stages[0]) {
      stages[0].classList.add('active');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
