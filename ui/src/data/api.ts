import { Platform } from 'react-native';

const DEFAULT_BASE_URL = 'http://localhost:8000';

function getBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (configured) {
    if (configured === 'same-origin' && Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.location.origin;
    }
    return configured.replace(/\/$/, '');
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  return DEFAULT_BASE_URL;
}

export function getApiBaseUrl() {
  return getBaseUrl();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      const detail = (data as { detail?: string }).detail;
      throw new ApiError(response.status, detail ?? `Request failed with ${response.status}`, data);
    }
    return data as T;
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with ${response.status}`);
  }
  return (await response.text()) as unknown as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });
  return parseResponse<T>(response);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });
  return parseResponse<T>(response);
}
