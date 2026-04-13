const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const lightTileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const defaultAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function splitHosts(value: string | undefined): string[] {
  if (!value) {
    return ['basemaps.cartocdn.com'];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getMapConfig(isDark: boolean) {
  return {
    tileUrlTemplate: process.env.EXPO_PUBLIC_TILE_URL_TEMPLATE ?? (isDark ? darkTileUrl : lightTileUrl),
    tileAttribution: process.env.EXPO_PUBLIC_TILE_ATTRIBUTION ?? defaultAttribution,
    tileSubdomains: (process.env.EXPO_PUBLIC_TILE_SUBDOMAINS ?? 'abcd').split(''),
    tileCacheHosts: splitHosts(process.env.EXPO_PUBLIC_TILE_CACHE_HOSTS),
    maxZoom: Number(process.env.EXPO_PUBLIC_TILE_MAX_ZOOM ?? 19),
  };
}
