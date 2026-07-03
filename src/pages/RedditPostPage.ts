import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class RedditPostPage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────

    async clickSearchCommentsBox() {
        // Find the comments search button and click it to reveal the input field
        const searchBtn = this.page.locator('button:has-text("Search Comments")').first();
        await searchBtn.waitFor({ state: 'visible', timeout: 10000 });
        await searchBtn.scrollIntoViewIfNeeded();
        await searchBtn.click();
        return this;
    }

    async enterCommentSearchQuery(query: string) {
        // Find the native input element nested specifically inside the comments search wrapper
        const searchInput = this.page.locator('faceplate-search-input[placeholder="Search Comments"] input').first();
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill(query);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    // ── COMPOSITE METHODS ────────────────────────────────────────────────────

    async searchComments(query: string, testInfo: TestInfo) {
        await this.clickSearchCommentsBox();
        await this.enterCommentSearchQuery(query);
        await this.attachScreenshotToReport(`Comments Searched for ${query}`, testInfo);
        return this;
    }

    // ── ASSERTION METHODS ────────────────────────────────────────────────────

    async verifyPostTitleVisible(testInfo: TestInfo) {
        // Verify the post title is visible and is a string
        const titleLocator = this.page.getByRole('heading', { level: 1 }).first();
         console.log("Expected: ", await titleLocator.textContent());
        await expect(titleLocator).toBeVisible();

        const titleText = await titleLocator.textContent() || '';
        expect(typeof titleText).toBe('string');
        expect(titleText.trim().length).toBeGreaterThan(0);

        await this.attachScreenshotToReport('Assert: Post Title Visible and Valid', testInfo);
        return this;
    }

    async verifyNoCommentsResults(expectedMessage: string, testInfo: TestInfo) {
        // Assert that the no results message is displayed
        const noResultsMsg = this.page.getByText(expectedMessage, { exact: false }).first();
        console.log("Expected: ", await noResultsMsg.textContent());
        await expect(noResultsMsg).toBeVisible();
        await this.attachScreenshotToReport('Assert: No Comments Results Found', testInfo);
        return this;
    }
}
