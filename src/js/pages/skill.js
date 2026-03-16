import '../app.js';
import '../nav.js';
import '../scroll.js';

async function initOptionalAuthUi() {
  try {
    const { initAuthUi } = await import('../auth-ui.js');
    await initAuthUi();
  } catch (error) {
    console.warn('Auth UI disabled for this environment:', error);
  }
}

initOptionalAuthUi();
