import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('should load the homepage', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/./);
    });

    test('should have navigation visible', async ({ page }) => {
        await page.goto('/');
        const nav = page.locator('nav');
        await expect(nav).toBeVisible();
    });
});
