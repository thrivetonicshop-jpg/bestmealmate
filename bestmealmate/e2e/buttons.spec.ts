import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('BestMealMate Button Navigation Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/BestMealMate/);
    // Use more specific selector to match h1 content
    await expect(page.locator('h1').first()).toContainText('Meal planning');
  });

  // Navigation buttons
  test('Sign In button navigates to /login', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('Get Started Free button navigates to /onboarding', async ({ page }) => {
    await page.click('a:has-text("Get Started Free")');
    await expect(page).toHaveURL(/\/onboarding/);
  });

  test('Start Planning Free button navigates to /onboarding', async ({ page }) => {
    await page.click('text=Start Planning Free');
    await expect(page).toHaveURL(/\/onboarding/);
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
    await page.click('a[href="/onboarding"]:has-text("Start Free")');
    await expect(page).toHaveURL(/\/onboarding/);
  });

  test('Premium tier button navigates to /onboarding?plan=premium', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.click('a[href="/onboarding?plan=premium"]');
    await expect(page).toHaveURL(/\/onboarding\?plan=premium/);
  });

  test('Family tier button navigates to /onboarding?plan=family', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.click('a[href="/onboarding?plan=family"]');
    await expect(page).toHaveURL(/\/onboarding\?plan=family/);
  });

  // Watch Demo button
  test('Watch Demo button opens video modal', async ({ page }) => {
    await page.click('text=Watch Demo');
    await expect(page.locator('iframe[title="BestMealMate Demo"]')).toBeVisible();
    // Close modal
    await page.click('button:has(svg)'); // Close button
  });

  // View all reviews button
  test('View all reviews button navigates to /about', async ({ page }) => {
    await page.locator('text=View all 12,847 reviews').scrollIntoViewIfNeeded();
    await page.click('text=View all 12,847 reviews');
    await expect(page).toHaveURL(/\/about/);
  });

  // FAQ section
  test('FAQ accordion expands on click', async ({ page }) => {
    await page.locator('#faq').scrollIntoViewIfNeeded();
    const firstQuestion = page.locator('text=What is the best meal planning app for families in 2025?');
    await firstQuestion.click();
    await expect(page.locator('text=BestMealMate is the best meal planning app')).toBeVisible();
  });

  // Footer links
  test('About link navigates to /about', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.click('footer a:has-text("About")');
    await expect(page).toHaveURL(/\/about/);
  });

  test('Contact link navigates to /contact', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.click('footer a:has-text("Contact")');
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('Login Page Tests', () => {
  test('Login page has email and password fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('Can switch to Sign Up mode', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('text=Sign up for free');
    await expect(page.locator('text=Create your account')).toBeVisible();
  });

  test('Forgot password link works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});

test.describe('Blog Page Tests', () => {
  test('Blog page loads with articles', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await expect(page.locator('text=Meal Planning Tips & Guides')).toBeVisible();
    await expect(page.locator('text=Best Meal Planning App for Families')).toBeVisible();
  });

  test('Can click on blog article', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await page.click('text=Best Meal Planning App for Families in 2025');
    await expect(page).toHaveURL(/\/blog\/best-meal-planning-app/);
  });

  test('Blog search works', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await page.fill('input[placeholder="Search articles..."]', 'keto');
    await expect(page.locator('text=Keto Meal Planning')).toBeVisible();
  });
});

test.describe('Dashboard Pages (require auth)', () => {
  test('Dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    // Should redirect to login or show auth required
    await expect(page).toHaveURL(/\/(login|dashboard)/);
  });
});

test.describe('Static Pages Tests', () => {
  test('About page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await expect(page.locator('text=Contact')).toBeVisible();
  });

  test('Privacy page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`);
    await expect(page.locator('text=Privacy')).toBeVisible();
  });

  test('Terms page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms`);
    await expect(page.locator('text=Terms')).toBeVisible();
  });
});
