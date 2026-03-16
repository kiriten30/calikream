import '../app.js';

async function initSignup() {
  try {
    const { initSignupPage } = await import('../auth-page.js');
    initSignupPage();
  } catch (error) {
    console.warn('Signup auth script failed to load:', error);
  }
}

initSignup();
