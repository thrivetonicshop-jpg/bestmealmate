import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Authentication Flow Tests', () => {
  test.describe('Signup Flow', () => {
    test('onboarding page loads with all elements', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      // Check for welcome screen elements
      await expect(page.locator('text=BestMealMate')).toBeVisible();
      await expect(page.locator('text=5 FREE Food Scans')).toBeVisible();
      await expect(page.locator('text=Try 5 Free Scans Now')).toBeVisible();
      await expect(page.locator('text=Create Free Account')).toBeVisible();
    });

    test('can navigate to signup form from onboarding', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      // Click "Create Free Account" button
      await page.locator('button:has-text("Create Free Account")').click();

      // Wait for signup form to appear
      await expect(page.locator('text=Quick Setup')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('signup form has validation', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      // Go to signup step
      await page.locator('button:has-text("Create Free Account")').click();
      await page.waitForTimeout(300);

      // Check that submit button is disabled without input
      const submitButton = page.locator('button:has-text("Start Cooking")');
      await expect(submitButton).toBeDisabled();

      // Enter email
      await page.fill('input[type="email"]', 'test@example.com');

      // Button should still be disabled without password
      await expect(submitButton).toBeDisabled();

      // Enter short password
      await page.fill('input[type="password"]', '12345');
      await expect(submitButton).toBeDisabled();

      // Enter valid password
      await page.fill('input[type="password"]', '123456');
      await expect(submitButton).not.toBeDisabled();
    });

    test('can select household size', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      // Go to signup step
      await page.locator('button:has-text("Create Free Account")').click();
      await page.waitForTimeout(300);

      // Click on household size 4
      await page.locator('button:has-text("4")').click();

      // Verify selection
      const selectedButton = page.locator('button:has-text("4")');
      await expect(selectedButton).toHaveClass(/bg-brand-600/);
    });

    test('can select dietary preference', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      // Go to signup step
      await page.locator('button:has-text("Create Free Account")').click();
      await page.waitForTimeout(300);

      // Click on Vegetarian diet
      await page.locator('button:has-text("Vegetarian")').click();

      // Verify selection
      const selectedDiet = page.locator('button:has-text("Vegetarian")');
      await expect(selectedDiet).toHaveClass(/bg-brand-600/);
    });

    test('can go back from signup to welcome', async ({ page }) => {
      await page.goto(`${BASE_URL}/onboarding`);
      await page.waitForLoadState('networkidle');

      // Go to signup step
      await page.locator('button:has-text("Create Free Account")').click();
      await page.waitForTimeout(300);

      // Click back button
      await page.locator('button:has-text("Back")').click();

      // Should be back on welcome screen
      await expect(page.locator('text=Try 5 Free Scans Now')).toBeVisible();
    });
  });

  test.describe('Login Flow', () => {
    test('login page loads correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('h1:has-text("Welcome back")')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });

    test('login form shows validation for empty submission', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Try to submit empty form
      await page.locator('button:has-text("Sign In")').click();

      // HTML5 validation should prevent submission
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toHaveAttribute('required', '');
    });

    test('can switch between login and signup modes', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Initially in login mode
      await expect(page.locator('h1:has-text("Welcome back")')).toBeVisible();

      // Switch to signup
      await page.locator('button:has-text("Sign up for free")').click();
      await expect(page.locator('h1:has-text("Create your account")')).toBeVisible();

      // Switch back to login
      await page.locator('button:has-text("Sign in")').first().click();
      await expect(page.locator('h1:has-text("Welcome back")')).toBeVisible();
    });

    test('remember me checkbox works', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      const checkbox = page.locator('input[type="checkbox"]');
      await expect(checkbox).not.toBeChecked();

      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });

    test('forgot password link navigates correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.locator('a:has-text("Forgot password")').click();
      await page.waitForURL(/\/forgot-password/);

      await expect(page.locator('h1:has-text("Forgot your password")')).toBeVisible();
    });

    test('Google OAuth button is present', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    });
  });

  test.describe('Password Reset Flow', () => {
    test('forgot password page loads correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/forgot-password`);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('h1:has-text("Forgot your password")')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button:has-text("Send Reset Link")')).toBeVisible();
    });

    test('back to login link works', async ({ page }) => {
      await page.goto(`${BASE_URL}/forgot-password`);

      await page.locator('a:has-text("Back to login")').click();
      await page.waitForURL(/\/login/);
    });

    test('send reset link button is disabled without email', async ({ page }) => {
      await page.goto(`${BASE_URL}/forgot-password`);

      const submitButton = page.locator('button:has-text("Send Reset Link")');
      await expect(submitButton).toBeDisabled();
    });

    test('send reset link button is enabled with email', async ({ page }) => {
      await page.goto(`${BASE_URL}/forgot-password`);

      await page.fill('input[type="email"]', 'test@example.com');

      const submitButton = page.locator('button:has-text("Send Reset Link")');
      await expect(submitButton).not.toBeDisabled();
    });

    test('reset password page shows loading state', async ({ page }) => {
      await page.goto(`${BASE_URL}/reset-password`);

      // Should show loading/verification state
      await expect(page.locator('text=Verifying your reset link')).toBeVisible();
    });

    test('reset password page shows invalid link message without token', async ({ page }) => {
      await page.goto(`${BASE_URL}/reset-password`);

      // Wait for verification to complete
      await page.waitForTimeout(4000);

      // Should show invalid link message
      await expect(page.locator('text=Invalid or Expired Link')).toBeVisible();
      await expect(page.locator('a:has-text("Request New Link")')).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('dashboard redirects to login when not authenticated', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForURL(/\/login/);

      // Should have redirect parameter
      const url = new URL(page.url());
      expect(url.searchParams.get('redirect')).toBe('/dashboard');
    });

    test('settings page redirects to login when not authenticated', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/settings`);
      await page.waitForURL(/\/login/);
    });

    test('pantry page redirects to login when not authenticated', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/pantry`);
      await page.waitForURL(/\/login/);
    });

    test('recipes page redirects to login when not authenticated', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/recipes`);
      await page.waitForURL(/\/login/);
    });

    test('grocery page redirects to login when not authenticated', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard/groceries`);
      await page.waitForURL(/\/login/);
    });
  });
});
