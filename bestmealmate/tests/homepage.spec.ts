import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')

    // Check main heading is visible
    await expect(page.getByRole('heading', { name: /meal planning for/i })).toBeVisible()

    // Check CTA button exists
    await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')

    // Click sign in link
    await page.getByRole('link', { name: /sign in/i }).first().click()

    // Should be on login page
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })

  test('should navigate to onboarding', async ({ page }) => {
    await page.goto('/')

    // Click get started button
    await page.getByRole('link', { name: /get started free/i }).first().click()

    // Should be on onboarding page
    await expect(page).toHaveURL('/onboarding')
  })

  test('should display pricing section', async ({ page }) => {
    await page.goto('/')

    // Scroll to pricing
    await page.getByRole('heading', { name: /choose your plan/i }).scrollIntoViewIfNeeded()

    // Check pricing tiers are visible
    await expect(page.getByText('$0')).toBeVisible()
    await expect(page.getByText('$9.99')).toBeVisible()
    await expect(page.getByText('$14.99')).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Mobile menu should exist
    await expect(page.getByRole('heading', { name: /meal planning for/i })).toBeVisible()
  })
})

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/login')

    // Initially shows sign in
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()

    // Click to switch to sign up
    await page.getByRole('button', { name: /sign up for free/i }).click()

    // Now shows sign up
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()
  })

  test('should have Google OAuth button', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
  })
})

test.describe('Dashboard', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/dashboard')

    // Check dashboard elements
    await expect(page.getByText(/good/i)).toBeVisible() // Good morning/afternoon/evening
    await expect(page.getByText(/tonight.*dinner/i)).toBeVisible()
  })

  test('should display meal plan section', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page.getByText(/this week.*menu/i)).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/dashboard')

    // Check sidebar navigation links
    await expect(page.getByRole('link', { name: /grocery list/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /recipes/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /family/i })).toBeVisible()
  })
})
