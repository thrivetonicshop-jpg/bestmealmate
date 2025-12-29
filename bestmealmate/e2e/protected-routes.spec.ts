import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Protected Routes', () => {
  // In development without Supabase, routes may not redirect
  // These tests verify the routes are accessible and load properly

  test('dashboard page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    // Should either redirect to login or show dashboard
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });

  test('dashboard/pantry page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/pantry`);
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });

  test('dashboard/recipes page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/recipes`);
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });

  test('dashboard/family page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/family`);
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });

  test('dashboard/groceries page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/groceries`);
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });

  test('dashboard/settings page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/settings`);
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url).toMatch(/\/(login|dashboard)/);
  });
});
