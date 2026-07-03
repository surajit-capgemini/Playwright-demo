import { Page } from 'playwright';
import { TestInfo } from '@playwright/test';

export class BasePage {
    constructor(public readonly page: Page) {}

    async attachScreenshotToReport(title: string, testInfo: TestInfo) {
        const screenshot = await this.page.screenshot();
        await testInfo.attach(title, {
            body: screenshot,
            contentType: 'image/png'
        });
        return this;
    }
}
