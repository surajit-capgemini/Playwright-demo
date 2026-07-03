import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class GooglePage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────
    // One action each. No screenshots. Navigation atomics wait for domcontentloaded.

    async open(testInfo: TestInfo) {
        await this.page.goto('/');
        await this.page.waitForLoadState('domcontentloaded');
        await this.attachScreenshotToReport('Google Page Opened', testInfo);
        return this;
    }

    // ── COMPOSITE METHODS ────────────────────────────────────────────────────
    // Group related atomics. Screenshot at end — always.

    // ── ASSERTION METHODS ────────────────────────────────────────────────────
    // Always: expect() + attachScreenshotToReport. Always takes testInfo.

    async verifyTitle(expectedTitle: string, testInfo: TestInfo) {
        await expect(this.page).toHaveTitle(expectedTitle);
        await this.attachScreenshotToReport('Assert: Google Page Title', testInfo);
        return this;
    }

    async verifySearchBoxVisible(testInfo: TestInfo) {
        await expect(this.page.getByRole('combobox', { name: 'Search' })).toBeVisible();
        await this.attachScreenshotToReport('Assert: Search Box Visible', testInfo);
        return this;
    }
}
