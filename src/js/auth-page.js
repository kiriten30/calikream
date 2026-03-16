import { logInUser, logInWithProvider, signUpUser } from './auth.js';

function setErrorMessage(errorElement, message) {
  if (!errorElement) {
    return;
  }

  if (!message) {
    errorElement.textContent = '';
    errorElement.hidden = true;
    return;
  }

  errorElement.textContent = message;
  errorElement.hidden = false;
}

function setSuccessMessage(messageElement, message) {
  if (!messageElement) {
    return;
  }

  if (!message) {
    messageElement.textContent = '';
    messageElement.hidden = true;
    return;
  }

  messageElement.textContent = message;
  messageElement.hidden = false;
}

async function handleProviderLogin(provider, errorElement) {
  setErrorMessage(errorElement, '');
  const { error } = await logInWithProvider(provider);

  if (error) {
    setErrorMessage(errorElement, error.message);
  }
}

export function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) {
    return;
  }

  const errorElement = document.getElementById('loginError');
  const submitButton = form.querySelector('button[type="submit"]');
  const googleButton = document.getElementById('btnGoogleLogin');
  const appleButton = document.getElementById('btnAppleLogin');

  setErrorMessage(errorElement, '');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailInput')?.value.trim();
    const password = document.getElementById('passwordInput')?.value;
    const originalLabel = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = 'Logging in...';
    setErrorMessage(errorElement, '');

    const { error } = await logInUser(email, password);

    if (error) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
      setErrorMessage(errorElement, error.message);
      return;
    }

    window.location.href = '/';
  });

  googleButton?.addEventListener('click', () => handleProviderLogin('google', errorElement));
  appleButton?.addEventListener('click', () => handleProviderLogin('apple', errorElement));
}

export function initSignupPage() {
  const form = document.getElementById('signupForm');
  if (!form) {
    return;
  }

  const errorElement = document.getElementById('signupError');
  const successElement = document.getElementById('signupSuccess');
  const submitButton = form.querySelector('button[type="submit"]');
  const googleButton = document.getElementById('btnGoogleSignup');
  const appleButton = document.getElementById('btnAppleSignup');

  setErrorMessage(errorElement, '');
  setSuccessMessage(successElement, '');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('nameInput')?.value.trim();
    const email = document.getElementById('emailInput')?.value.trim();
    const password = document.getElementById('passwordInput')?.value;
    const originalLabel = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = 'Creating account...';
    setErrorMessage(errorElement, '');
    setSuccessMessage(successElement, '');

    const { data, error } = await signUpUser(email, password, fullName);

    if (error) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
      setErrorMessage(errorElement, error.message);
      return;
    }

    if (data?.session) {
      setSuccessMessage(successElement, 'Account created successfully. Redirecting you home...');
      window.location.href = '/';
      return;
    }

    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
    form.reset();
    setSuccessMessage(successElement, 'Account created. Check your email to confirm your account before logging in.');
  });

  googleButton?.addEventListener('click', () => handleProviderLogin('google', errorElement));
  appleButton?.addEventListener('click', () => handleProviderLogin('apple', errorElement));
}
