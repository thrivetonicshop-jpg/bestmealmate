import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Checkout and Subscription Flow Tests', () => {
  test.describe('Pricing Page Access', () => {
    test('pricing section is accessible from homepage', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Click pricing link
      await page.click('a[href="#pricing"]');

      // Wait for scroll to complete
      await page.waitForTimeout(500);

      // Verify pricing section is in viewport
      await expect(page.locator('#pricing')).toBeInViewport();
    });

    test('pricing cards display correct tiers', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Check for Free tier
      await expect(page.locator('text=Free')).toBeVisible();
      await expect(page.locator('text=$0')).toBeVisible();

      // Check for Premium tier
      await expect(page.locator('text=Premium')).toBeVisible();
      await expect(page.locator('text=$9.99')).toBeVisible();

      // Check for Family tier
      await expect(page.locator('text=Family')).toBeVisible();
      await expect(page.locator('text=$14.99')).toBeVisible();
    });

    test('free tier button navigates to onboarding', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Click the first "Get Started" button (free tier)
      await page.locator('#pricing a[href="/onboarding"]').first().click();
      await page.waitForURL(/\/onboarding/);
    });

    test('premium tier button navigates with plan parameter', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Click premium tier button
      await page.locator('a[href="/onboarding?plan=premium"]').first().click();
      await page.waitForURL(/\/onboarding\?plan=premium/);
    });

    test('family tier button navigates with plan parameter', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Click family tier button
      await page.locator('a[href="/onboarding?plan=family"]').first().click();
      await page.waitForURL(/\/onboarding\?plan=family/);
    });
  });

  test.describe('Settings Page - Subscription Management', () => {
    test('settings page requires authentication', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/settings`);
      await page.waitForURL(/\/login/);
    });
  });

  test.describe('Stripe Checkout API', () => {
    test('checkout API returns error for missing data', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/stripe/checkout`, {
        data: {}
      });

      expect(response.status()).toBeLessThan(500);
      const body = await response.json();
      expect(body.error).toBeDefined();
    });

    test('checkout API returns error for invalid tier', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/stripe/checkout`, {
        data: {
          tier: 'invalid',
          email: 'test@example.com'
        }
      });

      expect(response.status()).toBeLessThan(500);
    });

    test('portal API returns error for missing customer ID', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/stripe/portal`, {
        data: {}
      });

      expect(response.status()).toBeLessThan(500);
      const body = await response.json();
      expect(body.error).toBeDefined();
    });

    test('portal API accepts proper request format', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/stripe/portal`, {
        data: {
          customerId: 'cus_test123',
          returnUrl: `${BASE_URL}/dashboard/settings`
        }
      });

      // Should return an error due to invalid customer, but not a 500
      expect(response.status()).toBeLessThan(500);
    });
  });

  test.describe('Webhook API', () => {
    test('webhook API requires signature', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/stripe/webhook`, {
        data: {
          type: 'checkout.session.completed'
        }
      });

      // Should return 400 for missing signature
      expect(response.status()).toBe(400);
    });
  });
});

test.describe('Try Page - Guest Experience', () => {
  test('try page loads with scanner UI', async ({ page }) => {
    await page.goto(`${BASE_URL}/try`);
    await page.waitForLoadState('networkidle');

    // Check for key elements
    await expect(page.locator('text=Try BestMealMate Free')).toBeVisible();
    await expect(page.locator('text=free scans')).toBeVisible();
    await expect(page.locator('button:has-text("Scan Your Fridge Now")')).toBeVisible();
    await expect(page.locator('button:has-text("See Demo First")')).toBeVisible();
  });

  test('demo mode shows sample items', async ({ page }) => {
    await page.goto(`${BASE_URL}/try`);
    await page.waitForLoadState('networkidle');

    // Click demo button
    await page.locator('button:has-text("See Demo First")').click();

    // Wait for demo items to appear
    await page.waitForTimeout(500);

    // Should show items found message
    await expect(page.locator('text=Items Found')).toBeVisible();

    // Should show signup prompt
    await expect(page.locator('button:has-text("Create Free Account")')).toBeVisible();
  });

  test('signup link works from try page', async ({ page }) => {
    await page.goto(`${BASE_URL}/try`);
    await page.waitForLoadState('networkidle');

    // Click signup link in header
    await page.locator('button:has-text("Sign up")').click();
    await page.waitForURL(/\/onboarding/);
  });
});
