import { expect, test, type Page } from '@playwright/test';

const task = {
  id: 1,
  name: 'Deep clean 2BR apartment',
  short_description: 'Need a verified cleaner this week.',
  description: 'Kitchen, bathroom, floors, and windows. Supplies are available on site.',
  price: 90,
  price_type: 'fixed',
  task_type: 'task',
  asap: true,
  professional: false,
  recurring: false,
  remote_work: false,
  work_required_from: null,
  work_required_to: null,
  latitude: 48.2082,
  longitude: 16.3738,
  user_id: 10,
  category_id: 1,
  address_id: 1,
  active: true,
  status: 'open',
  completed_at: null,
  distance_km: 1.2,
};

const service = {
  ...task,
  id: 2,
  name: 'Verified handyman',
  short_description: 'Assembly, mounting, and small repairs.',
  description: 'Experienced handyman with tools and repeat clients around Vienna.',
  price: 45,
  price_type: 'per_hour',
  task_type: 'tasker',
  professional: true,
  recurring: true,
  distance_km: 2.4,
};

async function mockMarketplaceApi(page: Page) {
  await page.route('**/tasks/search**', async (route) => {
    await route.fulfill({ json: [task, service] });
  });
  await page.route('**/session', async (route) => {
    await route.fulfill({ json: null });
  });
}

test.beforeEach(async ({ page }) => {
  await mockMarketplaceApi(page);
});

async function setTheme(page: Page, preference: 'dark' | 'light') {
  await page.addInitScript((nextPreference) => {
    window.localStorage.setItem('sidehuzle.theme.preference', nextPreference);
  }, preference);
}

async function captureHome(page: Page, path: string, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto('/');
  await page.getByTestId('marketplace-home').waitFor();
  await expect(page.getByLabel('Search tasks, skills, and places')).toBeVisible();
  await expect(page.getByTestId('listing-card-1')).toBeVisible();
  await page.screenshot({ path, fullPage: true });
}

async function captureSearchOverlay(page: Page, path: string, preference: 'dark' | 'light', width: number, height: number) {
  await setTheme(page, preference);
  await page.setViewportSize({ width, height });
  await page.goto('/');
  await page.getByTestId('marketplace-home').waitFor();
  await page.getByLabel('Search tasks, skills, and places').click();
  if (width >= 1024) {
    await expect(page.getByTestId('discovery-panel-backdrop')).toBeVisible();
  } else {
    await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);
  }
  await expect(page.getByTestId('search-suggestions-overlay')).toBeVisible();
  await page.screenshot({ path, fullPage: true });
}

async function captureFilterOverlay(page: Page, path: string, preference: 'dark' | 'light', width: number, height: number) {
  await setTheme(page, preference);
  await page.setViewportSize({ width, height });
  await page.goto('/');
  await page.getByTestId('marketplace-home').waitFor();
  await page.getByTestId('discovery-filter-open').click();
  if (width >= 1024) {
    await expect(page.getByTestId('discovery-panel-backdrop')).toBeVisible();
  } else {
    await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);
  }
  await expect(page.getByTestId('filter-overlay')).toBeVisible();
  await page.screenshot({ path, fullPage: true });
}

async function capturePostAfterNavClicks(page: Page, path: string, preference: 'dark' | 'light') {
  await setTheme(page, preference);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByTestId('marketplace-home')).toBeVisible();
  await page.getByTestId('desktop-nav-account').click();
  await expect(page.getByTestId('account-login-mask')).toBeVisible();
  await page.getByTestId('desktop-nav-post').click();
  await expect(page).toHaveURL(/\/post_type_selector$/);
  await expect(page.getByTestId('account-login-mask')).toBeVisible();
  await expect(page.getByTestId('marketplace-home')).toHaveCount(0);
  await expect(page.getByTestId('account-profile')).toHaveCount(0);
  await page.screenshot({ path, fullPage: true });
}

test('capture glass dark desktop and mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'This visual smoke captures desktop and mobile viewports itself.');
  await setTheme(page, 'dark');
  await captureHome(page, 'test-results/glass-review-dark-desktop.png', 1440, 900);
  await captureHome(page, 'test-results/glass-review-dark-mobile.png', 390, 844);
});

test('capture glass light desktop and mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'This visual smoke captures desktop and mobile viewports itself.');
  await setTheme(page, 'light');
  await captureHome(page, 'test-results/glass-review-light-desktop.png', 1440, 900);
  await captureHome(page, 'test-results/glass-review-light-mobile.png', 390, 844);
});

test('capture clean tab scenes after nav clicks in dark and light', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'This visual smoke captures desktop viewports itself.');
  await capturePostAfterNavClicks(page, 'test-results/nav-scene-dark-post-clean.png', 'dark');
  await capturePostAfterNavClicks(page, 'test-results/nav-scene-light-post-clean.png', 'light');
});

test('capture glass overlays in dark and light', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'This visual smoke captures desktop and mobile viewports itself.');
  await captureSearchOverlay(page, 'test-results/glass-search-dark-desktop.png', 'dark', 1440, 900);
  await captureFilterOverlay(page, 'test-results/glass-filter-dark-desktop.png', 'dark', 1440, 900);
  await captureSearchOverlay(page, 'test-results/glass-search-dark-mobile.png', 'dark', 390, 844);
  await captureFilterOverlay(page, 'test-results/glass-filter-dark-mobile.png', 'dark', 390, 844);
  await captureSearchOverlay(page, 'test-results/glass-search-light-desktop.png', 'light', 1440, 900);
  await captureFilterOverlay(page, 'test-results/glass-filter-light-desktop.png', 'light', 1440, 900);
  await captureSearchOverlay(page, 'test-results/glass-search-light-mobile.png', 'light', 390, 844);
  await captureFilterOverlay(page, 'test-results/glass-filter-light-mobile.png', 'light', 390, 844);
});
