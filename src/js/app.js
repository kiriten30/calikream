/**
 * CALIKREAM - Main Application Entry Point
 * Handles global, page-safe initialization.
 */
(function () {
  'use strict';

  function init() {
    document.body.classList.add('app-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
