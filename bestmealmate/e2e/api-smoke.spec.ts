import { test, expect } from '@playwright/test';

test.describe('API Smoke Tests', () => {
  test('scan-food endpoint responds to POST request', async ({ request }) => {
    const response = await request.post('/api/scan-food', {
      data: {},
    });

    // Should get a response (even if it's an error due to missing data)
    expect(response.status()).toBeLessThan(500);
  });

  test('ai-chef endpoint responds to POST request', async ({ request }) => {
    const response = await request.post('/api/ai-chef', {
      data: {},
    });

    // Should get a response (even if it's an error due to missing data)
    expect(response.status()).toBeLessThan(500);
  });

  test('stripe checkout endpoint responds to POST request', async ({ request }) => {
    const response = await request.post('/api/stripe/checkout', {
      data: {},
    });

    // Should get a response (even if it's an error due to missing data)
    expect(response.status()).toBeLessThan(500);
  });
});
