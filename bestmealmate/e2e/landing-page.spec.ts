import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the main hero section', async ({ page }) => {
    // Check for the main heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Meal planning for');
    // Use more specific selector to avoid matching multiple elements
    await expect(page.locator('h1 >> text=real families').first()).toBeVisible();
  });

  test('displays the BestMealMate logo and branding', async ({ page }) => {
    // Target the nav link with BestMealMate text
    await expect(page.getByRole('link', { name: /BestMealMate/i }).first()).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    // Target nav links in header specifically - using anchor tags for features/pricing
    await expect(page.locator('nav a[href="#features"]')).toBeVisible();
    await expect(page.locator('nav a[href="#pricing"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible();
  });

  test('has call-to-action buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible();
    // Scroll to pricing section to find Start Planning Free
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: /start planning free/i })).toBeVisible();
  });

  test('displays feature cards', async ({ page }) => {
    // Use first() for elements that appear multiple times on page
    await expect(page.locator('text=Family Profiles').first()).toBeVisible();
    await expect(page.locator('text=Smart Pantry').first()).toBeVisible();
    await expect(page.locator('text=AI Chef').first()).toBeVisible();
    await expect(page.locator('text=Smart Grocery List').first()).toBeVisible();
  });

  test('displays pricing plans', async ({ page }) => {
    // Scroll to pricing section
    await page.locator('#pricing').scrollIntoViewIfNeeded();

    // Use exact match for prices
    await expect(page.getByText('$0', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('$9.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$14.99', { exact: true })).toBeVisible();
  });

  test('displays statistics section', async ({ page }) => {
    await expect(page.locator('text=50K+').first()).toBeVisible();
    await expect(page.locator('text=Happy Families')).toBeVisible();
  });

  test('Sign In link navigates to login page', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).first().click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('Get Started link navigates to onboarding', async ({ page }) => {
    await page.getByRole('link', { name: /get started free/i }).first().click();
    await expect(page).toHaveURL(/.*onboarding/);
  });
});
