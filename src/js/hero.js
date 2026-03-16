/**
 * CALIKREAM - Hero Section Frame Animation
 * Scroll-driven frame and text transitions for the landing page hero.
 */
(function () {
  'use strict';

  const FRAME_COUNT = 5;
  const FRAME_BASE_PATHS = [
    '/media/frames/framea',
    '/public/media/frames/framea',
    'media/frames/framea',
    'public/media/frames/framea',
    './media/frames/framea',
    './public/media/frames/framea',
  ];
  const FRAME_EXT = '.png';
  const STAGE_COUNT = 5;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const heroWrapper = document.getElementById('hero-wrapper');
  const glow = document.getElementById('hero-glow');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const stages = [];

  for (let i = 0; i < STAGE_COUNT; i += 1) {
    const element = document.getElementById(`hero-stage-${i}`);
    if (element) {
      stages.push(element);
    }
  }

  const images = [];
  let loadedCount = 0;
  let allLoaded = false;
  let currentStage = 0;
  let currentFrame = 0;
  let lastProgress = 0;
  let ticking = false;

  function hasRenderableFrame(image) {
    return Boolean(image && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
  }

  function getRenderableFrameIndex(preferredIndex) {
    if (hasRenderableFrame(images[preferredIndex])) {
      return preferredIndex;
    }

    for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
      const lower = preferredIndex - offset;
      const upper = preferredIndex + offset;

      if (lower >= 0 && hasRenderableFrame(images[lower])) {
        return lower;
      }

      if (upper < FRAME_COUNT && hasRenderableFrame(images[upper])) {
        return upper;
      }
    }

    return -1;
  }

  function tryLoadFrame(image, frameNumber, onDone) {
    let basePathIndex = 0;

    function loadNextPath() {
      if (basePathIndex >= FRAME_BASE_PATHS.length) {
        console.warn(`Failed to load hero frame ${frameNumber} from all known paths.`);
        onDone(false);
        return;
      }

      const frameSrc = `${FRAME_BASE_PATHS[basePathIndex]}${frameNumber}${FRAME_EXT}`;
      basePathIndex += 1;

      image.onload = function () {
        onDone(true);
      };

      image.onerror = function () {
        loadNextPath();
      };

      image.src = frameSrc;
    }

    loadNextPath();
  }

  function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function preloadImages() {
    for (let index = 1; index <= FRAME_COUNT; index += 1) {
      const image = new Image();
      images.push(image);

      tryLoadFrame(image, index, function () {
        loadedCount += 1;

        if (loadedCount === FRAME_COUNT) {
          allLoaded = true;
          const firstFrameIndex = getRenderableFrameIndex(0);

          if (firstFrameIndex === -1) {
            console.warn('Hero frames could not be loaded. Check frame file paths.');
            return;
          }

          renderFrame(firstFrameIndex);
        }
      });
    }
  }

  function renderFrame(index) {
    if (!allLoaded) return;

    const frameIndex = getRenderableFrameIndex(index);
    if (frameIndex === -1) return;

    const image = images[frameIndex];
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth;
    let drawHeight;
    let drawX;
    let drawY;

    if (canvasRatio > imageRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imageRatio;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imageRatio;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  function getScrollProgress() {
    if (!heroWrapper) {
      return 0;
    }

    const rect = heroWrapper.getBoundingClientRect();
    const wrapperHeight = Math.max(heroWrapper.offsetHeight - window.innerHeight, 1);
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / wrapperHeight));
  }

  function transitionStage(fromIndex, toIndex, direction) {
    const fromElement = stages[fromIndex];
    const toElement = stages[toIndex];

    if (fromElement) {
      fromElement.classList.remove('active', 'exit-up', 'exit-down');
      fromElement.classList.add(direction === 'down' ? 'exit-up' : 'exit-down');
    }

    if (toElement) {
      toElement.classList.remove('exit-up', 'exit-down');
      toElement.classList.add('active');
    }
  }

  function updateHero() {
    const progress = getScrollProgress();
    const direction = progress > lastProgress ? 'down' : 'up';
    const nextFrame = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
    const nextStage = Math.min(STAGE_COUNT - 1, Math.floor(progress * STAGE_COUNT));

    if (nextFrame !== currentFrame) {
      currentFrame = nextFrame;
      renderFrame(currentFrame);
    }

    if (nextStage !== currentStage) {
      transitionStage(currentStage, nextStage, direction);
      currentStage = nextStage;
    }

    if (glow) {
      const glowOpacity = progress * 0.5;
      const glowSize = 360 + progress * 520;
      glow.style.width = `${glowSize}px`;
      glow.style.height = `${glowSize}px`;
      glow.style.background = `radial-gradient(ellipse at center, rgba(255, 92, 0, ${glowOpacity}) 0%, transparent 70%)`;
    }

    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, 1 - progress * 6).toString();
    }

    lastProgress = progress;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHero);
      ticking = true;
    }
  }

  function init() {
    resizeCanvas();
    preloadImages();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      resizeCanvas();
      renderFrame(currentFrame);
    });

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
