import '../app.js';
import '../hero.js';
import '../nav.js';
import '../scroll.js';
import '../counters.js';

async function initOptionalAuthUi() {
  try {
    const { initAuthUi } = await import('../auth-ui.js');
    await initAuthUi();
  } catch (error) {
    console.warn('Auth UI disabled for this environment:', error);
  }
}

initOptionalAuthUi();
