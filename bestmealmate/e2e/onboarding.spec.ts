import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test('should display onboarding page', async ({ page }) => {
    await page.goto('/onboarding');

    // Should show onboarding content
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('should show subscription options', async ({ page }) => {
    await page.goto('/onboarding');

    // Should display pricing plans
    const premiumPlan = page.getByText(/\$9\.99|premium/i);
    const familyPlan = page.getByText(/\$14\.99|family/i);

    // At least one pricing option should be visible
    await expect(premiumPlan.or(familyPlan)).toBeVisible();
  });
});
