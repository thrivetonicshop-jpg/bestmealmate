import { test, expect } from '@playwright/test';

/**
 * Playwright automation to fix Vercel Deployment Protection
 * This script navigates to Vercel dashboard and disables protection on production
 */
test.describe('Fix Vercel Deployment Protection', () => {

  test('Navigate to Vercel and disable deployment protection', async ({ page }) => {
    // Go to Vercel dashboard
    await page.goto('https://vercel.com/login');

    // Wait for login page to load
    await expect(page).toHaveURL(/vercel\.com/);

    console.log('=== VERCEL LOGIN PAGE ===');
    console.log('Please log in manually if prompted.');
    console.log('');

    // Take a screenshot of what we see
    await page.screenshot({ path: 'vercel-login.png', fullPage: true });

    // Check if we're already logged in or need to log in
    const pageContent = await page.content();

    if (pageContent.includes('Log In') || pageContent.includes('Sign Up')) {
      console.log('Login required. Please authenticate in the browser.');
      // Pause for manual login
      await page.pause();
    }

    // Navigate to the bestmealmate project settings
    await page.goto('https://vercel.com/dashboard');
    await page.screenshot({ path: 'vercel-dashboard.png', fullPage: true });

    // Look for the bestmealmate project
    const projectLink = page.locator('a:has-text("bestmealmate")').first();
    if (await projectLink.isVisible()) {
      await projectLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Go to Settings
    await page.click('a:has-text("Settings")');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'vercel-settings.png', fullPage: true });

    // Go to Deployment Protection
    await page.click('a:has-text("Deployment Protection")');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'vercel-protection-before.png', fullPage: true });

    console.log('=== DEPLOYMENT PROTECTION SETTINGS ===');
    console.log('Current page URL:', page.url());

    // Look for Vercel Authentication toggle/selector
    // Try to find and change to "Only Preview Deployments"
    const authSection = page.locator('text=Vercel Authentication').first();
    if (await authSection.isVisible()) {
      console.log('Found Vercel Authentication section');

      // Look for dropdown or radio buttons
      const dropdown = page.locator('select, [role="listbox"], [role="combobox"]').first();
      if (await dropdown.isVisible()) {
        await dropdown.click();
        await page.click('text=Only Preview Deployments');
      }

      // Or look for radio/toggle options
      const previewOnlyOption = page.locator('text=Only Preview Deployments, label:has-text("Preview")').first();
      if (await previewOnlyOption.isVisible()) {
        await previewOnlyOption.click();
      }
    }

    // Save changes if there's a save button
    const saveButton = page.locator('button:has-text("Save")').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
    }

    await page.screenshot({ path: 'vercel-protection-after.png', fullPage: true });

    console.log('=== DONE ===');
    console.log('Screenshots saved. Check the protection settings.');
  });
});
