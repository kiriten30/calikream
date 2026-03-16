/**
 * CALIKREAM — Scroll Animations
 * Uses Intersection Observer for reveal animations and GSAP ScrollTrigger for advanced effects.
 */
(function () {
  'use strict';

  // ---- Intersection Observer: reveal on scroll ----
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Roadmap: stage reveal + line fill ----
  function initRoadmapAnimations() {
    const roadmap = document.getElementById('roadmap-timeline');
    const lineFill = document.getElementById('roadmap-line-fill');
    if (!roadmap || !lineFill) return;

    const stages = roadmap.querySelectorAll('.roadmap__stage');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger reveal stages
            stages.forEach(function (stage, i) {
              setTimeout(function () {
                stage.classList.add('visible');
              }, i * 200);
            });

            // Animate line fill
            setTimeout(function () {
              lineFill.style.width = '100%';
            }, 300);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(roadmap);
  }

  // ---- GSAP-powered animations (if GSAP is available) ----
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Parallax on showcase visuals
    document.querySelectorAll('.showcase__visual').forEach(function (el) {
      gsap.fromTo(
        el.querySelector('.showcase__visual-glow'),
        { scale: 0.6, opacity: 0 },
        {
          scale: 1.2,
          opacity: 1,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        }
      );
    });

    // CTA glow pulse
    const ctaGlow = document.querySelector('.cta-section__glow');
    if (ctaGlow) {
      gsap.fromTo(
        ctaGlow,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }

    // Floating shapes in CTA
    document.querySelectorAll('.cta-section__shape').forEach(function (shape, i) {
      gsap.to(shape, {
        y: -30 + i * 15,
        rotation: 45 + i * 10,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });
    });

    // Skill card SVGs: subtle float
    document.querySelectorAll('.stick-figure').forEach(function (figure) {
      gsap.to(figure, {
        y: -5,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
      });
    });
  }

  // ---- Init ----
  function init() {
    initRevealAnimations();
    initRoadmapAnimations();

    // Delay GSAP init slightly to ensure the library is loaded
    setTimeout(initGSAPAnimations, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
