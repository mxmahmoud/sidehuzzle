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
  await page.route('**/tasks/1', async (route) => {
    await route.fulfill({ json: task });
  });
  await page.route('**/tasks/2', async (route) => {
    await route.fulfill({ json: service });
  });
  await page.route('**/session', async (route) => {
    await route.fulfill({ json: null });
  });
  await page.route('**/notifications**', async (route) => {
    await route.fulfill({ json: [] });
  });
  await page.route('**/chat**', async (route) => {
    await route.fulfill({ json: [] });
  });
}

test.beforeEach(async ({ page }) => {
  await mockMarketplaceApi(page);
});

async function clickPrimaryNav(page: Page, name: string | RegExp) {
  const button = page.getByRole('button', { name }).first();
  if ((await button.count()) > 0 && await button.isVisible().catch(() => false)) {
    await button.click();
    return;
  }
  await page.getByRole('tab', { name }).first().click();
}

async function expectPrimaryTabClean(page: Page, activeTestId: string) {
  const tabTestIds = ['marketplace-home', 'account-profile', 'account-login-mask', 'activity-hub', 'notifications-screen'];
  for (const testId of tabTestIds) {
    if (testId !== activeTestId) {
      await expect(page.getByTestId(testId)).toHaveCount(0);
    }
  }
}

test('desktop discovery renders search, results, filters, and map actions', async ({ page }) => {
  await page.goto('/');
  const isDesktopViewport = (page.viewportSize()?.width ?? 0) >= 1024;

  await expect(page.getByTestId('marketplace-home')).toBeVisible();
  await expect(page.getByLabel('Search tasks, skills, and places')).toBeVisible();
  await expect(page.getByTestId('discovery-listing-mode').getByRole('button', { name: 'All work' })).toBeVisible();
  await expect(page.getByTestId('map-listing-mode-controls')).toBeVisible();
  await expect(page.getByTestId('discovery-view-mode')).toHaveCount(0);
  if (isDesktopViewport) {
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
  } else {
    await expect(page.getByRole('tab', { name: /Home/ })).toBeVisible();
  }
  await expect(page.getByTestId('listing-card-1')).toBeVisible();

  const discoverySearch = page.getByLabel('Search tasks, skills, and places');
  await discoverySearch.click();
  await discoverySearch.fill('clean');
  await expect(discoverySearch).toHaveValue('clean');
  await expect(page.getByTestId('search-suggestions-overlay')).toBeVisible();
  await expect(page.getByTestId('search-suggestions-panel')).toBeVisible();
  const searchBox = await page.getByTestId('discovery-search').boundingBox();
  const suggestionsBox = await page.getByTestId('search-suggestions-overlay').boundingBox();
  expect(searchBox).not.toBeNull();
  expect(suggestionsBox).not.toBeNull();
  if (searchBox && suggestionsBox && isDesktopViewport) {
    expect(suggestionsBox.y).toBeLessThan(searchBox.y + searchBox.height + 20);
    expect(suggestionsBox.y).toBeGreaterThan(searchBox.y + searchBox.height - 2);
  }
  await expect(page.getByText('Recent searches')).toBeVisible();
  await expect(page.getByTestId('search-suggestions-panel').getByText('clean', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Search ideas for/)).toHaveCount(0);
  if (isDesktopViewport) {
    await expect(page.getByTestId('discovery-panel-backdrop')).toBeVisible();
    await page.mouse.click(48, 300);
  } else {
    await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);
    await page.mouse.click(8, 760);
  }
  await expect(page.getByTestId('search-suggestions-overlay')).toHaveCount(0);
  await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);

  await page.getByTestId('discovery-filter-open').click();
  await expect(page.getByTestId('filter-overlay')).toBeVisible();
  await expect(page.getByTestId('discovery-filter')).toBeVisible();
  if (isDesktopViewport) {
    await expect(page.getByTestId('discovery-panel-backdrop')).toBeVisible();
  } else {
    await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);
  }
  await page.getByTestId('apply-filters').click();
  await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);

  const mapSurface = page.getByTestId('map-surface').first();
  await expect(mapSurface).toBeVisible();
  await expect(page.getByTestId('map-utility-controls')).toBeVisible();
  const mapBox = await mapSurface.boundingBox();
  const utilityBox = await page.getByTestId('map-utility-controls').boundingBox();
  const modeBox = await page.getByTestId('map-listing-mode-controls').boundingBox();
  const locateBox = await page.getByRole('button', { name: 'Locate me' }).first().boundingBox();
  const fullscreenBox = await page.getByRole('button', { name: 'Fullscreen map' }).first().boundingBox();
  expect(mapBox).not.toBeNull();
  expect(utilityBox).not.toBeNull();
  expect(modeBox).not.toBeNull();
  if (mapBox && utilityBox) {
    expect(utilityBox.x + utilityBox.width).toBeGreaterThan(mapBox.x + mapBox.width - 132);
    expect(Math.abs((utilityBox.y + utilityBox.height / 2) - (mapBox.y + mapBox.height / 2))).toBeLessThan(34);
  }
  if (mapBox && modeBox) {
    if (isDesktopViewport) {
      expect(modeBox.y).toBeLessThan(mapBox.y + 64);
    } else {
      expect(modeBox.y + modeBox.height).toBeGreaterThan(mapBox.y + mapBox.height - 64);
    }
  }
  expect(locateBox).not.toBeNull();
  expect(fullscreenBox).not.toBeNull();
  if (locateBox && fullscreenBox) {
    expect(locateBox.y + locateBox.height).toBeLessThan(fullscreenBox.y + 4);
  }
  await expect(page.getByTestId('map-surface')).toBeVisible();

  await page.getByRole('button', { name: 'Fullscreen map' }).click();
  await expect(page.getByTestId('marketplace-map')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Locate me' })).toBeVisible();
  await expect(page.getByTestId('map-screen-list-button')).toBeVisible();
  const fullMapBox = await page.getByTestId('marketplace-map').boundingBox();
  const fullUtilityBox = await page.getByTestId('map-screen-utility-controls').boundingBox();
  expect(fullMapBox).not.toBeNull();
  expect(fullUtilityBox).not.toBeNull();
  if (fullMapBox && fullUtilityBox) {
    expect(Math.abs((fullUtilityBox.y + fullUtilityBox.height / 2) - (fullMapBox.y + fullMapBox.height / 2))).toBeLessThan(42);
  }
  await expect(page.getByText(/places found/)).toHaveCount(0);
  await expect(page.getByText('Map results')).toHaveCount(0);
  await page.getByLabel('Search the map').click();
  await expect(page.getByTestId('map-search-suggestions-overlay')).toBeVisible();
  await expect(page.getByTestId('map-panel-backdrop')).toBeVisible();
  await page.mouse.click(48, 760);
  await expect(page.getByTestId('map-search-suggestions-overlay')).toHaveCount(0);
});

test('discovery overlays close when navigating primary tabs', async ({ page }) => {
  const cases = [
    {
      nav: 'Messages',
      assertRoute: async () => {
        await expect(page).toHaveURL(/\/requests_posts_hub$/);
        await expect(page.getByTestId('account-login-mask')).toBeVisible();
      },
    },
    {
      nav: 'Post',
      assertRoute: async () => {
        await expect(page).toHaveURL(/\/post_type_selector$/);
        await expect(page.getByTestId('account-login-mask')).toBeVisible();
      },
    },
    {
      nav: /Notifications/,
      assertRoute: async () => {
        await expect(page).toHaveURL(/\/notifications_list$/);
        await expect(page.getByTestId('account-login-mask')).toBeVisible();
      },
    },
    {
      nav: 'Account',
      assertRoute: async () => {
        await expect(page).toHaveURL(/\/account_profile$/);
        await expect(page.getByTestId('account-login-mask')).toBeVisible();
      },
    },
  ] as const;

  for (const item of cases) {
    await page.goto('/');
    await page.getByLabel('Search tasks, skills, and places').click();
    await expect(page.getByTestId('search-suggestions-overlay')).toBeVisible();
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      await expect(page.getByTestId('discovery-panel-backdrop')).toBeVisible();
    } else {
      await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);
    }

    await clickPrimaryNav(page, item.nav);
    await expect(page.getByTestId('search-suggestions-overlay')).toHaveCount(0);
    await expect(page.getByTestId('filter-overlay')).toHaveCount(0);
    await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);
    await expect(page.getByTestId('marketplace-home')).toHaveCount(0);
    await item.assertRoute();
  }
});

test('desktop nav button clicks isolate the active tab scene', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  await expect(page.getByTestId('marketplace-home')).toBeVisible();
  await page.getByTestId('desktop-nav-account').click();
  await expect(page.getByTestId('account-login-mask')).toBeVisible();
  await expectPrimaryTabClean(page, 'account-login-mask');

  await page.getByTestId('desktop-nav-post').click();
  await expect(page).toHaveURL(/\/post_type_selector$/);
  await expect(page.getByTestId('account-login-mask')).toBeVisible();
  await expect(page.getByTestId('marketplace-home')).toHaveCount(0);
  await expect(page.getByTestId('account-profile')).toHaveCount(0);
  await page.screenshot({ path: 'test-results/nav-scene-post-clean.png', fullPage: true });

  await page.getByTestId('desktop-nav-home').click();
  await expect(page.getByTestId('marketplace-home')).toBeVisible();
  await expectPrimaryTabClean(page, 'marketplace-home');

  await page.getByTestId('desktop-nav-account').click();
  await expect(page.getByTestId('account-login-mask')).toBeVisible();
  await expectPrimaryTabClean(page, 'account-login-mask');

  await page.getByTestId('desktop-nav-messages').click();
  await expect(page).toHaveURL(/\/requests_posts_hub$/);
  await expect(page.getByTestId('account-login-mask')).toBeVisible();
  await expect(page.getByTestId('account-profile')).toHaveCount(0);
  await expect(page.getByTestId('search-suggestions-overlay')).toHaveCount(0);
  await expect(page.getByTestId('filter-overlay')).toHaveCount(0);
});

test('mobile discovery keeps search and listing cards usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.unroute('**/tasks/search**');
  await page.route('**/tasks/search**', async (route) => {
    await route.fulfill({
      json: Array.from({ length: 8 }, (_, index) => ({
        ...(index % 2 === 0 ? task : service),
        id: index + 1,
        name: index % 2 === 0 ? `Deep clean apartment ${index + 1}` : `Verified handyman ${index + 1}`,
        distance_km: 1.2 + index,
      })),
    });
  });
  await page.goto('/');

  await expect(page.getByTestId('marketplace-home')).toBeVisible();
  await expect(page.getByLabel('Search tasks, skills, and places')).toBeVisible();
  await page.getByLabel('Search tasks, skills, and places').click();
  await expect(page.getByTestId('search-suggestions-overlay')).toBeVisible();
  await expect(page.getByTestId('discovery-panel-backdrop')).toHaveCount(0);
  await page.mouse.click(8, 760);
  await expect(page.getByTestId('search-suggestions-overlay')).toHaveCount(0);
  await expect(page.getByTestId('listing-card-1')).toBeVisible();
  await page.mouse.move(200, 520);
  await page.mouse.wheel(0, 900);
  await expect(page.getByTestId('discovery-results-header')).toBeVisible();
  await expect(page.getByTestId('mobile-floating-map')).toBeVisible();
  const tabBox = await page.getByRole('tab', { name: /Home/ }).boundingBox();
  const viewport = page.viewportSize();
  expect(tabBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (tabBox && viewport) {
    expect(tabBox.y + tabBox.height).toBeGreaterThan(viewport.height - 28);
  }
});

test('search routes to results with mocked listings', async ({ page }) => {
  await page.goto('/search_screen');

  await page.getByLabel('Search freelancers or jobs').fill('clean');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('search-results')).toBeVisible();
  await expect(page.getByText('Results for "clean"')).toBeVisible();
  await expect(page.getByTestId('listing-card-1')).toBeVisible();
  await expect(page.getByTestId('search-results-map-button')).toBeVisible();
});

test('posting forms expose validation and primary actions', async ({ page }) => {
  await page.goto('/help_request_form');

  await expect(page.getByTestId('job-listing-form')).toBeVisible();
  await expect(page.getByTestId('job-listing-submit')).toContainText('Post job');
  await page.getByTestId('job-listing-submit').click();
  await expect(page.getByText('Title is required')).toBeVisible();
  await expect(page.getByText('Description *')).toBeVisible();
  await expect(page.getByText('Short description *')).toHaveCount(0);
  await expect(page.getByText('Full description *')).toHaveCount(0);
  await expect(page.getByText('Attachments')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Images' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'PDFs' })).toBeVisible();

  await page.goto('/worker_service_form');
  await expect(page.getByTestId('service-listing-form')).toBeVisible();
  await expect(page.getByTestId('service-listing-submit')).toContainText('Offer service');
  await page.getByTestId('service-listing-submit').click();
  await expect(page.getByText('Title is required')).toBeVisible();
});

test('wireframe-covered scaffolds expose marketplace sections', async ({ page }) => {
  await page.goto('/categories_overview');
  await expect(page.getByTestId('route-section-popular-categories')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cleaning' })).toBeVisible();

  await page.goto('/account_settings');
  await expect(page.getByTestId('route-section-profile-and-security')).toBeVisible();
  await expect(page.getByText('Payment methods')).toBeVisible();

  await page.goto('/payment_cards_manage');
  await expect(page.getByTestId('route-section-payment-methods')).toBeVisible();
  await expect(page.getByText('Add card')).toBeVisible();

  await page.goto('/report_reason_selection');
  await expect(page.getByTestId('route-section-safety-categories')).toBeVisible();
  await expect(page.getByText('Spam or scam')).toBeVisible();

  await page.goto('/membership_status');
  await expect(page.getByTestId('route-section-current-plan')).toBeVisible();
  await expect(page.getByText('Compare plans')).toBeVisible();

  await page.unroute('**/session');
  await page.route('**/session', async (route) => {
    await route.fulfill({
      json: {
        id: 10,
        email: 'maya@example.test',
        username: 'maya',
        first_name: 'Maya',
        last_name: 'K',
        name: 'Maya K',
      },
    });
  });
  await page.goto('/(tabs)/account_profile');
  await expect(page.getByTestId('account-profile')).toBeVisible();
  await expect(page.getByText('Offered services')).toBeVisible();
  await expect(page.getByText('Posted jobs')).toBeVisible();
  await expect(page.getByText('Payment methods')).toBeVisible();
});

test('auth and detail routes render key CTAs', async ({ page }) => {
  await page.goto('/login_form');
  await expect(page.getByTestId('login-panel')).toBeVisible();
  await expect(page.getByText('Welcome back')).toBeVisible();

  await page.goto('/job_description?id=1');
  await expect(page.getByTestId('job-detail')).toBeVisible();
  await expect(page.getByTestId('job-detail-primary-action')).toBeVisible();

  await page.goto('/worker_description?id=2');
  await expect(page.getByTestId('worker-detail')).toBeVisible();
  await expect(page.getByTestId('worker-detail-primary-action')).toBeVisible();
});
