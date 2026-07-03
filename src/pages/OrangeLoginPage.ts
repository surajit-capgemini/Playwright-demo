import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class OrangeLoginPage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────
    async open(testInfo: TestInfo) {
        await this.page.goto('/web/index.php/auth/login');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
        await this.attachScreenshotToReport('Login Page Opened', testInfo);
        return this;
    }

    async enterUsername(username: string) {
        await this.page.getByPlaceholder('Username').fill(username);
        return this;
    }

    async enterPassword(password: string) {
        await this.page.getByPlaceholder('Password').fill(password);
        return this;
    }

    async clickSubmit() {
        await this.page.getByRole('button', { name: 'Login' }).click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    // ── COMPOSITE METHODS ────────────────────────────────────────────────────
    async performLogin(username: string, password: string, testInfo: TestInfo) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickSubmit();
        await this.attachScreenshotToReport('After Login Attempt', testInfo);
        return this;
    }
}
