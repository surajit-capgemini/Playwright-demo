import { test, expect } from '@playwright/test';


test.describe("Playwright test", () => {

  test.beforeEach(async ({ page }) => {
    await test.step("Navigate to the Playwright homepage", async () => {
      await page.goto('https://playwright.dev/');
    })
  })


  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('get started link', async ({ page }) => {

    await test.step("Click the get started link", async () => {
      await page.getByRole('link', { name: 'Get started' }).click();
    })

    await test.step("Expects page to have a heading with the name of Installation", async () => {
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    })
  });
});