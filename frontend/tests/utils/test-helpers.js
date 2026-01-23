
import { expect } from '@playwright/test';

// --- TEST DATA FIXTURES ---

export const TEST_USER = {
  email: 'test.user@infinity.ai',
  password: 'Password123!',
  name: 'Test Architect',
  company: 'Future Corp'
};

export const TEST_AGENT = {
  name: 'Alpha One',
  role: 'Strategic Planner',
  industry: 'Technology',
  description: 'An AI designed to optimize strategic decision making.'
};

export const MOCK_API_RESPONSES = {
  success: { status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) },
  unauthorized: { status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Unauthorized' }) },
  serverError: { status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal Server Error' }) }
};

// --- HELPER FUNCTIONS ---

/**
 * Logs in a user via the UI
 */
export async function loginUser(page) {
  await page.goto('/auth');
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL('/admin'); // Assuming redirect to admin for this suite
}

/**
 * Mocks Google OAuth Flow
 */
export async function mockGoogleAuth(page) {
  await page.route('**/auth/google', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ token: 'mock_google_token_123' })
    });
  });
}

/**
 * Mocks Stripe Payment Flow
 */
export async function mockStripeCheckout(page) {
  await page.route('**/billing/checkout', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ url: 'https://checkout.stripe.com/mock-session' })
    });
  });
}

/**
 * Performance Benchmark Helper
 */
export async function measurePerformance(page, actionName, thresholdMs = 1000) {
  const start = Date.now();
  await page.evaluate(() => performance.mark('start'));
  
  await actionName(); // Execute the passed action
  
  await page.evaluate(() => performance.mark('end'));
  const duration = Date.now() - start;
  
  console.log(`Performance [${actionName.name || 'Anonymous'}]: ${duration}ms`);
  expect(duration).toBeLessThan(thresholdMs);
}
