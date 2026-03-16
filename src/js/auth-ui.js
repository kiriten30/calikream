import { getActiveSession, getProfile, logOutUser } from './auth.js';

function getUserName(session, profile) {
  return (
    profile?.full_name ||
    session?.user?.user_metadata?.full_name ||
    session?.user?.email?.split('@')[0] ||
    'Athlete'
  );
}

function buildAuthUi(userName) {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-user';

  const label = document.createElement('span');
  label.className = 'nav-user__label';
  label.textContent = `Hey, ${userName}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn--sm nav-user__button';
  button.textContent = 'Log Out';
  button.setAttribute('data-logout-button', 'true');

  wrapper.append(label, button);
  return wrapper;
}

export async function initAuthUi() {
  const authContainer = document.getElementById('nav-auth-container');
  if (!authContainer) {
    return;
  }

  const session = await getActiveSession();
  if (!session?.user) {
    return;
  }

  const profile = await getProfile(session.user.id);
  const userName = getUserName(session, profile);
  authContainer.replaceChildren(buildAuthUi(userName));

  const logoutButton = authContainer.querySelector('[data-logout-button]');
  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    logoutButton.textContent = 'Logging out...';
    await logOutUser();
  });
}
