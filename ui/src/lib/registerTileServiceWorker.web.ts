import { getMapConfig } from '@/config/map';

const TILE_SW_PATH = '/tile-cache-sw.js';

export function registerTileServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const cfg = getMapConfig(true);
  const url = new URL(TILE_SW_PATH, window.location.origin);
  url.searchParams.set('hosts', cfg.tileCacheHosts.join(','));

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(url.toString()).catch((error) => {
      console.warn('Tile cache service worker registration failed', error);
    });
  });
}
