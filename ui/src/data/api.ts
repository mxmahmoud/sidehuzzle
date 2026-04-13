import { Platform } from 'react-native';

const DEFAULT_BASE_URL = 'http://localhost:8000';

function getBaseUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const { origin } = window.location;
    if (origin && origin !== 'null') return origin;
  }
  return DEFAULT_BASE_URL;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}
