import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class OrangeDashboardPage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────
    async verifyDashboardLoaded(testInfo: TestInfo) {
        await expect(this.page).toHaveURL(/.*dashboard.*/, { timeout: 15000 });
        await expect(this.page.getByPlaceholder('Search')).toBeVisible({ timeout: 15000 });
        await this.attachScreenshotToReport('Dashboard Loaded Successfully', testInfo);
        return this;
    }

    async clickClaimSidebar() {
        await this.page.getByRole('link', { name: 'Claim' }).click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    async navigateToClaimPageDirectly() {
        await this.page.goto('/web/index.php/claim/viewClaimModule');
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }
}
