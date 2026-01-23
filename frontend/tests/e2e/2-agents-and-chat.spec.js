
import { test, expect } from '@playwright/test';
import { loginUser, TEST_AGENT } from '../utils/test-helpers';

test.describe('Agent Management & Conversation', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('Create a new custom agent from start to finish', async ({ page }) => {
    await page.click('text=Agent Creator'); // Sidebar nav
    
    // Step 1: Basic Info
    await page.fill('input[placeholder*="Name"]', TEST_AGENT.name);
    await page.fill('input[placeholder*="Role"]', TEST_AGENT.role);
    await page.click('button:has-text("Next")');
    
    // Step 2: Personality (interact with sliders)
    await page.locator('input[type="range"]').first().fill('80');
    await page.click('button:has-text("Next")');
    
    // Step 3: Knowledge (Skip/Default)
    await page.click('button:has-text("Next")');
    
    // Step 4: Review & Deploy
    await page.click('button:has-text("Deploy Agent")');
    
    // Verify Success
    await expect(page.locator('.toast')).toContainText(/Agent Deployed/i);
    await expect(page.locator(`text=${TEST_AGENT.name}`)).toBeVisible();
  });

  test('Agent conversation and memory persistence', async ({ page }) => {
    await page.click('text=Vision Cortex');
    
    const message = "Hello Cortex, remember the code 7749.";
    await page.fill('input[placeholder*="Enter directive"]', message);
    await page.press('input[placeholder*="Enter directive"]', 'Enter');
    
    // Expect response bubble
    await expect(page.locator('text=Processing command')).toBeVisible();
    
    // Test Memory Retrieval (simulated by checking if chat history persists on reload)
    await page.reload();
    await expect(page.locator(`text=${message}`)).toBeVisible();
  });

  test('Voice integration toggle', async ({ page }) => {
    await page.click('text=Agent Templates');
    
    // Click a voice preview button
    const playBtn = page.locator('button:has(svg.lucide-play)').first();
    await playBtn.click();
    
    // Verify visual indicator of audio playing
    await expect(page.locator('.animate-pulse')).toBeVisible();
  });

});
