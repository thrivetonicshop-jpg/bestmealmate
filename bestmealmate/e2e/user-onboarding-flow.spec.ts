import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('User Onboarding and Checkout Flow', () => {

  test.describe('Onboarding Page', () => {
    test('displays welcome screen with features', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      // Check welcome elements
      await expect(page.getByRole('heading', { name: 'BestMealMate' })).toBeVisible();
      await expect(page.locator('text=AI-powered meal planning')).toBeVisible();

      // Check feature cards
      await expect(page.locator('text=Scan Your Food')).toBeVisible();
      await expect(page.locator('text=Smart Meal Plans')).toBeVisible();
      await expect(page.locator('text=Grocery Lists')).toBeVisible();

      // Check free trial badge
      await expect(page.locator('text=5 FREE Food Scans')).toBeVisible();
    });

    test('has Try Free and Create Account buttons', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('text=Try 5 Free Scans Now')).toBeVisible();
      await expect(page.locator('text=Create Free Account')).toBeVisible();
    });

    test('Try Free button navigates to /try', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      await page.click('text=Try 5 Free Scans Now');
      await page.waitForURL(/\/try/);
      expect(page.url()).toContain('/try');
    });

    test('Create Account button shows signup form', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      await page.click('text=Create Free Account');
      await page.waitForTimeout(500); // Wait for animation

      // Check form elements
      await expect(page.locator('text=Quick Setup')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('text=How many people eat together?')).toBeVisible();
    });

    test('signup form has all required fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      await page.click('text=Create Free Account');
      await page.waitForTimeout(500);

      // Name field (optional)
      await expect(page.locator('input[placeholder="What should we call you?"]')).toBeVisible();

      // Email field
      await expect(page.locator('input[type="email"]')).toBeVisible();

      // Password field
      await expect(page.locator('input[type="password"]')).toBeVisible();

      // Household size buttons
      for (const num of [1, 2, 3, 4, 5]) {
        await expect(page.locator(`button:has-text("${num}")`).first()).toBeVisible();
      }
    });

    test('can fill in signup form', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      await page.click('text=Create Free Account');
      await page.waitForTimeout(500);

      // Fill form
      await page.fill('input[placeholder="What should we call you?"]', 'Test User');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');

      // Select household size
      await page.click('button:has-text("4")');

      // Verify form is filled
      await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    });

    test('Sign in link navigates to /login', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      await page.click('text=Sign in');
      await page.waitForURL(/\/login/);
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('Plan Selection from Landing Page', () => {
    test('Premium plan button passes plan parameter', async ({ page }) => {
      await page.goto(`${BASE_URL}`);
      await page.waitForLoadState('networkidle');

      // Scroll to pricing section
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Click Premium plan button
      await page.click('a[href="/onboarding?plan=premium"]');
      await page.waitForURL(/\/onboarding\?plan=premium/);

      expect(page.url()).toContain('plan=premium');
    });

    test('Family plan button passes plan parameter', async ({ page }) => {
      await page.goto(`${BASE_URL}`);
      await page.waitForLoadState('networkidle');

      // Scroll to pricing section
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Click Family plan button
      await page.click('a[href="/onboarding?plan=family"]');
      await page.waitForURL(/\/onboarding\?plan=family/);

      expect(page.url()).toContain('plan=family');
    });

    test('Free plan button goes to onboarding', async ({ page }) => {
      await page.goto(`${BASE_URL}`);
      await page.waitForLoadState('networkidle');

      // Scroll to pricing section
      await page.locator('#pricing').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Click free tier button
      const freeButton = page.locator('#pricing a[href="/onboarding"]').first();
      await freeButton.click();
      await page.waitForURL(/\/onboarding/);

      expect(page.url()).toContain('/onboarding');
    });
  });

  test.describe('Try Page (Free Trial)', () => {
    test('Try page loads correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/try`);
      await page.waitForLoadState('networkidle');

      // Should have some trial/scan related content
      await expect(page.locator('h1').first()).toBeVisible();
    });

    test('Try page is accessible from onboarding', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      await page.click('text=Try 5 Free Scans Now');
      await page.waitForURL(/\/try/);

      await expect(page).toHaveURL(/\/try/);
    });
  });

  test.describe('Dashboard Settings (Subscription)', () => {
    test('Settings page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/settings`);
      await page.waitForLoadState('networkidle');

      // Either redirects to login or loads settings
      const url = page.url();
      expect(url).toMatch(/\/(login|dashboard\/settings)/);
    });
  });
});
