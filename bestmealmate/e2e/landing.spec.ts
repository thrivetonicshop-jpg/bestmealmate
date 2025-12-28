import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/BestMealMate/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for login/signup links
    const loginLink = page.getByRole('link', { name: /log in|sign in/i });
    await expect(loginLink).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /log in|sign in|get started/i });
    await loginLink.click();

    await expect(page).toHaveURL(/\/(login|onboarding)/);
  });
});
