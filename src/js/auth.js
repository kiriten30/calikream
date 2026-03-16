import { ensureSupabase, getSiteUrl, isSupabaseConfigured } from './supabase.js';

function unavailableResult() {
  return {
    data: null,
    error: new Error('Authentication is unavailable until Supabase environment variables are configured.'),
  };
}

function getDisplayError(error, fallbackMessage) {
  if (!error) {
    return new Error(fallbackMessage);
  }

  return error instanceof Error ? error : new Error(String(error));
}

async function upsertProfile(user) {
  if (!user || !isSupabaseConfigured) {
    return { data: null, error: null };
  }

  try {
    const client = ensureSupabase();
    const profilePayload = {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Calikream Athlete',
      email: user.email,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.warn('Profile sync skipped:', error.message);
    return { data: null, error };
  }
}

export async function signUpUser(email, password, fullName) {
  if (!isSupabaseConfigured) {
    return unavailableResult();
  }

  try {
    const client = ensureSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSiteUrl('/'),
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data?.user && data?.session) {
      await upsertProfile(data.user);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: getDisplayError(error, 'Unable to create your account.') };
  }
}

export async function logInUser(email, password) {
  if (!isSupabaseConfigured) {
    return unavailableResult();
  }

  try {
    const client = ensureSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    if (data?.user) {
      await upsertProfile(data.user);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: getDisplayError(error, 'Unable to log you in.') };
  }
}

export async function logInWithProvider(provider) {
  if (!isSupabaseConfigured) {
    return unavailableResult();
  }

  try {
    const client = ensureSupabase();
    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getSiteUrl('/'),
      },
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: getDisplayError(error, 'Unable to start sign-in with that provider.') };
  }
}

export async function logOutUser() {
  if (!isSupabaseConfigured) {
    window.location.href = '/';
    return;
  }

  try {
    const client = ensureSupabase();
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Logout error:', error.message);
  } finally {
    window.location.href = '/';
  }
}

export async function getActiveSession() {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const client = ensureSupabase();
    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error) {
      throw error;
    }

    if (session?.user) {
      await upsertProfile(session.user);
    }

    return session;
  } catch (error) {
    console.error('Session lookup error:', error.message);
    return null;
  }
}

export async function getProfile(userId) {
  if (!isSupabaseConfigured || !userId) {
    return null;
  }

  try {
    const client = ensureSupabase();
    const { data, error } = await client
      .from('profiles')
      .select('id, full_name, email, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.warn('Profile fetch skipped:', error.message);
    return null;
  }
}
