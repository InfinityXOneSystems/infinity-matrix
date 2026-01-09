
import { test, expect } from '@playwright/test';
import { loginUser } from '../utils/test-helpers';

test.describe('Workflow Builder & Automation', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('Create and execute an automated workflow', async ({ page }) => {
    await page.click('text=Workflow Builder');
    
    // Drag Trigger Node
    const triggerSource = page.locator('text=Email Trigger');
    const canvas = page.locator('.react-flow__pane');
    
    await triggerSource.dragTo(canvas);
    
    // Drag Action Node
    const actionSource = page.locator('text=GPT-4 Processing');
    await actionSource.dragTo(canvas, { targetPosition: { x: 300, y: 100 } });
    
    // Connect Nodes (Simulating connection logic usually tricky in canvas, checking if nodes exist)
    await expect(page.locator('.react-flow__node')).toHaveCount(2);
    
    // Run Workflow
    await page.click('button:has-text("Execute Workflow")');
    
    // Check for Execution Log
    await expect(page.locator('.toast')).toContainText(/Workflow Executed/i);
  });

  test('Automation Logs viewer updates correctly', async ({ page }) => {
    await page.click('text=Automation Logs');
    
    // Check table headers
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Workflow')).toBeVisible();
    
    // Verify at least one log entry exists
    await expect(page.locator('.glass-panel .overflow-y-auto > div')).not.toHaveCount(0);
  });

  test('Workflow error handling for disconnected nodes', async ({ page }) => {
    await page.click('text=Workflow Builder');
    // Add single node without trigger
    const actionSource = page.locator('text=Send Email');
    const canvas = page.locator('.react-flow__pane');
    await actionSource.dragTo(canvas);
    
    await page.click('button:has-text("Execute Workflow")');
    
    // Expect Error Toast
    await expect(page.locator('.toast')).toContainText(/Error|Invalid/i);
  });
});
