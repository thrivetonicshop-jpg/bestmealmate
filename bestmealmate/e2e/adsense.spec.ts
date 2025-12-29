import { test, expect } from '@playwright/test';

test.describe('AdSense Configuration', () => {
  test('ads.txt is accessible and has correct content', async ({ page }) => {
    const response = await page.goto('/ads.txt');

    // Should return 200 OK
    expect(response?.status()).toBe(200);

    // Check content type header
    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('text/plain');

    // Check content
    const content = await page.textContent('body');
    expect(content).toContain('google.com');
    expect(content).toContain('pub-3073911588578821');
    expect(content).toContain('DIRECT');
    expect(content).toContain('f08c47fec0942fa0');
  });

  test('robots.txt allows AdSense crawler', async ({ page }) => {
    const response = await page.goto('/robots.txt');

    expect(response?.status()).toBe(200);

    const content = await page.textContent('body');
    expect(content).toContain('User-agent: Mediapartners-Google');
    expect(content).toContain('Allow: /');
  });

  test('homepage has AdSense meta tag', async ({ page }) => {
    await page.goto('/');

    // Check for AdSense account meta tag
    const adsenseMeta = await page.locator('meta[name="google-adsense-account"]');
    await expect(adsenseMeta).toHaveAttribute('content', 'ca-pub-3073911588578821');
  });

  test('homepage loads AdSense script', async ({ page }) => {
    await page.goto('/');

    // Check for AdSense script
    const adsenseScript = await page.locator('script[src*="pagead2.googlesyndication.com"]');
    expect(await adsenseScript.count()).toBeGreaterThan(0);
  });
});
