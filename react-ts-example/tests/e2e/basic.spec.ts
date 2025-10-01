import { test, expect } from '@playwright/test';

test.describe('Basic App Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title and header', async ({ page }) => {
    await expect(page).toHaveTitle('react-ts-example');

    await expect(page.locator('h1')).toContainText('GenAI-PolyInfer React Example');
    await expect(page.locator('.app-header p')).toContainText('Demonstrating all features of the genai-polyinfer package');
  });

  test('should have all navigation tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'AI Request' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Metrics' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Configuration' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Demo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Health' })).toBeVisible();
  });

  test('should switch between tabs correctly', async ({ page }) => {
    // Start with AI Request tab (should be active by default)
    await expect(page.locator('.tab-button.active')).toContainText('AI Request');

    // Switch to Metrics tab
    await page.getByRole('button', { name: 'Metrics' }).click();
    await expect(page.locator('.tab-button.active')).toContainText('Metrics');

    // Switch to Config tab
    await page.getByRole('button', { name: 'Configuration' }).click();
    await expect(page.locator('.tab-button.active')).toContainText('Configuration');

    // Switch to Demo tab
    await page.getByRole('button', { name: 'Demo' }).click();
    await expect(page.locator('.tab-button.active')).toContainText('Demo');

    // Switch to Health tab
    await page.getByRole('button', { name: 'Health' }).click();
    await expect(page.locator('.tab-button.active')).toContainText('Health');
  });
});

test.describe('AI Request Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ensure we're on the AI Request tab
    await page.getByRole('button', { name: 'AI Request' }).click();
  });

  test('should have AI request form elements', async ({ page }) => {
    await expect(page.getByLabel('Prompt:')).toBeVisible();
    await expect(page.getByLabel('Mode:')).toBeVisible();
    await expect(page.getByRole('button', { name: '🚀 Send Request' })).toBeVisible();
  });

  test('should have mode options', async ({ page }) => {
    const modeSelect = page.getByLabel('Mode:');
    await expect(modeSelect).toHaveValue('synchronous');

    // Check that the select element exists
    await expect(modeSelect).toBeVisible();
  });

  test('should disable submit button when prompt is empty', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: '🚀 Send Request' });
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when prompt has content', async ({ page }) => {
    const promptTextarea = page.getByLabel('Prompt:');
    const submitButton = page.getByRole('button', { name: '🚀 Send Request' });

    await promptTextarea.fill('Test prompt');
    await expect(submitButton).toBeEnabled();
  });
});

test.describe('Health Check Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Health' }).click();
  });

  test('should display system information', async ({ page }) => {
    await expect(page.getByText('Framework: React + TypeScript + Vite')).toBeVisible();
    await expect(page.getByText('Package: genai-polyinfer')).toBeVisible();
    await expect(page.getByText('Features: Multi-provider orchestration, caching, metrics, logging')).toBeVisible();
    await expect(page.getByText('Providers: OpenAI, Anthropic, Google Gemini, Grok, Ollama, Mock')).toBeVisible();
  });

  test('should have health check button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '🔄 Check Health' })).toBeVisible();
  });
});

test.describe('Configuration Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Configuration' }).click();
  });

  test('should display configuration information', async ({ page }) => {
    await expect(page.getByText('⚙️ Configuration')).toBeVisible();
    await expect(page.getByText(/Configurations can be updated in/)).toBeVisible();
    await expect(page.getByText('polyinfer.config.ts')).toBeVisible();
  });

  test('should have refresh config button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '🔄 Refresh Config' })).toBeVisible();
  });
});

test.describe('Demo Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Demo' }).click();
  });

  test('should display demo interface', async ({ page }) => {
    await expect(page.getByText('🎭 Demo')).toBeVisible();
    await expect(page.getByText('Test both synchronous and concurrent modes with the same prompt.')).toBeVisible();
    await expect(page.getByRole('button', { name: '🚀 Run Demo' })).toBeVisible();
  });

  test('should have example prompt buttons', async ({ page }) => {
    // Check that the example buttons are visible
    await expect(page.getByRole('button', { name: 'What is the capital of France?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Explain quantum computing in simple terms' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Write a haiku about artificial intelligence' })).toBeVisible();
  });
});

test.describe('Metrics Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Metrics' }).click();
  });

  test('should display metrics interface', async ({ page }) => {
    await expect(page.getByText('📊 Metrics')).toBeVisible();
    await expect(page.getByText('Get current performance metrics for all providers.')).toBeVisible();
  });

  test('should have metrics action buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '🔄 Refresh Metrics' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🔄 Reset Metrics' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🗑️ Clear Cache' })).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Should still show header
    await expect(page.locator('h1')).toBeVisible();

    // Navigation should be in mobile layout (vertical)
    await expect(page.getByRole('button', { name: 'AI Request' })).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Should still show header
    await expect(page.locator('h1')).toBeVisible();

    // Navigation should be in tablet layout
    await expect(page.getByRole('button', { name: 'AI Request' })).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle navigation errors gracefully', async ({ page }) => {
    await page.goto('/');

    // Try to navigate to a non-existent route
    await page.goto('/non-existent-route');

    // Should still show the main app (client-side routing should handle this)
    await expect(page.locator('h1')).toBeVisible();
  });
});
