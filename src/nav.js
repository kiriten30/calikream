/**
 * CALIKREAM — Navigation Controller
 * Handles navbar transparency/glassmorphism transition, mobile menu, and active section highlighting.
 */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link') : [];

  const SCROLL_THRESHOLD = 80;
  let isMenuOpen = false;

  // ---- Scroll behavior: transparent → frosted glass ----
  function updateNavbar() {
    if (!navbar) return;
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    if (scrolled && !isMenuOpen) {
      navbar.classList.add('navbar--scrolled');
      navbar.classList.remove('navbar--transparent');
    } else if (!isMenuOpen) {
      navbar.classList.remove('navbar--scrolled');
      navbar.classList.add('navbar--transparent');
    }
  }

  // ---- Mobile menu toggle ----
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.classList.add('active');
      navToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Animate hamburger to X
      const spans = navToggle.querySelectorAll('span');
      if (spans.length === 3) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        // Ensure bars are visible on dark overlay
        spans[0].style.background = '#fff';
        spans[1].style.background = '#fff';
        spans[2].style.background = '#fff';
      }
    } else {
      mobileMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
      const spans = navToggle.querySelectorAll('span');
      if (spans.length === 3) {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
        spans[0].style.background = '';
        spans[1].style.background = '';
        spans[2].style.background = '';
      }
    }
  }

  // ---- Close menu on link click ----
  function closeMobileMenu() {
    if (isMenuOpen) toggleMenu();
  }

  // ---- Smooth scroll for anchor links ----
  function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        closeMobileMenu();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  // ---- Init ----
  function init() {
    // Scroll listener
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Mobile toggle
    if (navToggle) {
      navToggle.addEventListener('click', toggleMenu);
    }

    // Mobile links
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', handleAnchorClick);
    });

    // Desktop nav links smooth scroll
    const navLinks = document.querySelectorAll('.navbar__link, .navbar__actions .btn, .navbar__login');
    navLinks.forEach(function (link) {
      link.addEventListener('click', handleAnchorClick);
    });

    // All anchor links on page
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', handleAnchorClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
