
import { test, expect } from '@playwright/test';
import { TEST_USER, mockStripeCheckout } from '../utils/test-helpers';

test.describe('Authentication & Subscription Flow', () => {

  test('User can sign up successfully', async ({ page }) => {
    await page.goto('/auth');
    await page.click('button:has-text("Sign Up")');
    
    await page.fill('input[placeholder="Name"]', TEST_USER.name);
    await page.fill('input[placeholder="Email"]', `new.${Date.now()}@infinity.ai`);
    await page.fill('input[placeholder="Password"]', TEST_USER.password);
    
    // Check Terms
    await page.check('input[type="checkbox"]'); 
    
    await page.click('button:has-text("Create Account")');
    
    // Expect redirection to dashboard or welcome
    await expect(page).toHaveURL(/\/admin|\//);
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('User can log in with valid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    await expect(page).toHaveURL('/admin');
  });

  test('Login fails with invalid credentials', async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', 'WrongPass');
    await page.click('button:has-text("Sign In")');
    
    await expect(page.locator('.toast')).toContainText(/error|invalid/i);
  });

  test('Subscription upgrade flow (Stripe Integration)', async ({ page }) => {
    // Setup
    await mockStripeCheckout(page);
    await page.goto('/auth'); // Login first
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');

    // Navigate to Subscriptions
    await page.goto('/admin');
    await page.click('text=Subscriptions');

    // Select Pro Plan
    const upgradeBtn = page.locator('text=Upgrade to Pro').first();
    await upgradeBtn.click();

    // Verify Toast or Redirect
    // Since we mocked the endpoint, we check if the app reacted
    await expect(page.locator('.toast')).toContainText(/Processing/i);
  });
});
