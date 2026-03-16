import '../app.js';

async function initLogin() {
  try {
    const { initLoginPage } = await import('../auth-page.js');
    initLoginPage();
  } catch (error) {
    console.warn('Login auth script failed to load:', error);
  }
}

initLogin();
