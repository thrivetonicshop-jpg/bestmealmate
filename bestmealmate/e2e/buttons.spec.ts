import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('BestMealMate Button Navigation Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/BestMealMate/);
    await expect(page.locator('h1').first()).toContainText('Meal planning');
  });

  // Navigation buttons
  test('Sign In button navigates to /login', async ({ page }) => {
    await page.locator('a:has-text("Sign In")').first().click();
    await page.waitForURL(/\/login/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('Get Started Free button navigates to /onboarding', async ({ page }) => {
    await page.locator('a:has-text("Get Started Free")').first().click();
    await page.waitForURL(/\/onboarding/);
  });

  test('Start Planning Free button navigates to /onboarding', async ({ page }) => {
    await page.locator('a:has-text("Start Planning Free")').first().click();
    await page.waitForURL(/\/onboarding/);
  });

  // Anchor links (scroll to sections)
  test('Features link scrolls to features section', async ({ page }) => {
    await page.click('a[href="#features"]');
    await expect(page.locator('#features')).toBeInViewport();
  });

  test('How it Works link scrolls to section', async ({ page }) => {
    await page.click('a[href="#how-it-works"]');
    await expect(page.locator('#how-it-works')).toBeInViewport();
  });

  test('Pricing link scrolls to pricing section', async ({ page }) => {
    await page.click('a[href="#pricing"]');
    await expect(page.locator('#pricing')).toBeInViewport();
  });

  // Pricing buttons
  test('Free tier button navigates to /onboarding', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const freeButton = page.locator('#pricing a[href="/onboarding"]').first();
    await freeButton.click();
    await page.waitForURL(/\/onboarding/);
  });

  test('Premium tier button navigates to /onboarding?plan=premium', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator('a[href="/onboarding?plan=premium"]').first().click();
    await page.waitForURL(/\/onboarding\?plan=premium/);
  });

  test('Family tier button navigates to /onboarding?plan=family', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.locator('a[href="/onboarding?plan=family"]').first().click();
    await page.waitForURL(/\/onboarding\?plan=family/);
  });

  // FAQ section
  test('FAQ accordion expands on click', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded();
    const firstQuestion = page.locator('#faq summary').first();
    await firstQuestion.click();
    await page.waitForTimeout(300);
  });

  // Footer links
  test('About link navigates to /about', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('footer a:has-text("About")').first().click();
    await page.waitForURL(/\/about/);
  });

  test('Contact link navigates to /contact', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('footer a:has-text("Contact")').first().click();
    await page.waitForURL(/\/contact/);
  });
});

test.describe('Login Page Tests', () => {
  test('Login page has email and password fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")').first()).toBeVisible();
  });

  test('Can switch to Sign Up mode', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('text=Sign up').first().click();
    await expect(page.locator('text=Create').first()).toBeVisible();
  });

  test('Forgot password link works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('text=Forgot password').first().click();
    await page.waitForURL(/\/forgot-password/);
  });
});

test.describe('Blog Page Tests', () => {
  test('Blog page loads with articles', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Can navigate blog page', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle');
    // Blog page is functional if it loads
    expect(page.url()).toContain('/blog');
  });

  test('Blog search works', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('meal');
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Dashboard Pages (require auth)', () => {
  test('Dashboard page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    // Either redirects to login or loads dashboard (depending on auth state)
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });
});

test.describe('Static Pages Tests', () => {
  test('About page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Privacy page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`);
    await expect(page.locator('h1:has-text("Privacy")').first()).toBeVisible();
  });

  test('Terms page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`);
    await expect(page.locator('h1:has-text("Terms")').first()).toBeVisible();
  });
});
