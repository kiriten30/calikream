/**
 * CALIKREAM - Navigation Controller
 * Handles navbar scroll behavior, mobile menu state, and anchor scrolling.
 */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link') : [];
  const SCROLL_THRESHOLD = 80;
  const DESKTOP_BREAKPOINT = 768;
  let isMenuOpen = false;

  function updateNavbar() {
    if (!navbar) {
      return;
    }

    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    if (scrolled && !isMenuOpen) {
      navbar.classList.add('navbar--scrolled');
      navbar.classList.remove('navbar--transparent');
    } else if (!isMenuOpen) {
      navbar.classList.remove('navbar--scrolled');
      navbar.classList.add('navbar--transparent');
    }
  }

  function syncToggleIcon(isOpen) {
    if (!navToggle) {
      return;
    }

    const spans = navToggle.querySelectorAll('span');
    if (spans.length !== 3) {
      return;
    }

    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    spans[0].style.background = isOpen ? '#fff' : '';
    spans[1].style.background = isOpen ? '#fff' : '';
    spans[2].style.background = isOpen ? '#fff' : '';
  }

  function setMenuState(nextState) {
    if (!mobileMenu || !navToggle) {
      return;
    }

    isMenuOpen = nextState;
    mobileMenu.classList.toggle('active', isMenuOpen);
    navToggle.classList.toggle('active', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    syncToggleIcon(isMenuOpen);
    updateNavbar();
  }

  function toggleMenu() {
    setMenuState(!isMenuOpen);
  }

  function closeMobileMenu() {
    if (isMenuOpen) {
      setMenuState(false);
    }
  }

  function handleAnchorClick(event) {
    const href = event.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    closeMobileMenu();
    const offset = navbar ? navbar.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function handleEscape(event) {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  }

  function handleResize() {
    if (window.innerWidth > DESKTOP_BREAKPOINT) {
      closeMobileMenu();
    }
  }

  function init() {
    window.addEventListener('scroll', updateNavbar, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleEscape);
    updateNavbar();

    navToggle?.addEventListener('click', toggleMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', handleAnchorClick);
    });

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
