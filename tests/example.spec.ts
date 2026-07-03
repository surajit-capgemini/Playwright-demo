import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {

  await test.step("Navigate to the Playwright homepage", async () => {
     await page.goto('https://playwright.dev/');
  })

  // await test.step("Expect a title 'to contain' a substring.", async () => {
    await expect(page).toHaveTitle(/Playwright/);
  // })
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
