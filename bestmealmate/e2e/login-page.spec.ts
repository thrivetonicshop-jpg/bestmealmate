import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('displays the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });

  test('has sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('has Google OAuth button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
  });

  test('can toggle between sign in and sign up', async ({ page }) => {
    // Should start with sign in view
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    // Click to switch to sign up
    await page.getByRole('button', { name: /sign up for free/i }).click();

    // Should now show sign up view
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();

    // Click to switch back to sign in
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should be back to sign in view
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('shows validation for empty form submission', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // HTML5 validation should prevent submission - check email field is invalid
    const emailInput = page.getByPlaceholder('you@example.com');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('has remember me checkbox', async ({ page }) => {
    await expect(page.getByRole('checkbox')).toBeVisible();
    await expect(page.locator('text=Remember me')).toBeVisible();
  });

  test('has forgot password link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
  });

  test('displays feature highlights on desktop', async ({ page, viewport }) => {
    // Skip for mobile viewport
    if (viewport && viewport.width < 1024) {
      test.skip();
    }

    await expect(page.locator('text=Plan meals your whole family will love')).toBeVisible();
    await expect(page.locator('text=Personalized for each family member')).toBeVisible();
  });

  test('logo links back to home page', async ({ page }) => {
    await page.getByRole('link', { name: /bestmealmate/i }).click();
    await expect(page).toHaveURL('/');
  });
});
