import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('dashboard/pantry redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/pantry');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('dashboard/recipes redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/recipes');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('dashboard/family redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/family');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('dashboard/groceries redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/groceries');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('dashboard/settings redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard/settings');

    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });
});
