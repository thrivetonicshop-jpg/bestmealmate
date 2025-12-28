import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the main hero section', async ({ page }) => {
    // Check for the main heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Meal planning for');
    await expect(page.locator('text=real families')).toBeVisible();
  });

  test('displays the BestMealMate logo and branding', async ({ page }) => {
    await expect(page.locator('text=BestMealMate')).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('has call-to-action buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /start planning free/i })).toBeVisible();
  });

  test('displays feature cards', async ({ page }) => {
    await expect(page.locator('text=Family Profiles')).toBeVisible();
    await expect(page.locator('text=Smart Pantry')).toBeVisible();
    await expect(page.locator('text=AI Chef')).toBeVisible();
    await expect(page.locator('text=Smart Grocery List')).toBeVisible();
  });

  test('displays pricing plans', async ({ page }) => {
    // Scroll to pricing section
    await page.locator('#pricing').scrollIntoViewIfNeeded();

    await expect(page.locator('text=$0')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    await expect(page.locator('text=$14.99')).toBeVisible();
  });

  test('displays statistics section', async ({ page }) => {
    await expect(page.locator('text=50K+')).toBeVisible();
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
