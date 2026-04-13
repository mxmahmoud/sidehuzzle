import { apiGet } from '@/data/api';
import { useSessionStore, type SessionUser } from '@/stores/sessionStore';

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  username?: string;
};

export async function login(payload: LoginPayload): Promise<SessionUser> {
  const form = new FormData();
  form.append('email', payload.email);
  form.append('password', payload.password);

  const response = await fetch(`${getBaseUrl()}/login`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  if (!response.ok) {
    throw new Error(`Login failed with ${response.status}`);
  }

  const user = await apiGet<SessionUser>('/auth/me');
  useSessionStore.getState().setUser(user);
  return user;
}

export async function signup(payload: SignupPayload): Promise<SessionUser> {
  const response = await fetch(`${getBaseUrl()}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Signup failed with ${response.status}`);
  }

  const user = (await response.json()) as SessionUser;
  useSessionStore.getState().setUser(user);
  return user;
}

export async function logout(): Promise<void> {
  await fetch(`${getBaseUrl()}/logout`, {
    method: 'GET',
    credentials: 'include',
  });
  useSessionStore.getState().signOut();
}

function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
    return window.location.origin;
  }
  return 'http://localhost:8000';
}
