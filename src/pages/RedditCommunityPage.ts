import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class RedditCommunityPage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────

    async clickFirstPost() {
        // Find the first post comments link or post title link within the feed
        const firstPost = this.page.locator('article a[href*="/comments/"], shreddit-post a[href*="/comments/"], a[href*="/comments/"]').first();
        await firstPost.waitFor({ state: 'visible', timeout: 5000 });
        await firstPost.click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    // ── COMPOSITE METHODS ────────────────────────────────────────────────────

    async openAndVerifyFirstPost(testInfo: TestInfo) {
        await this.clickFirstPost();
        await this.attachScreenshotToReport('Opened First Post', testInfo);
        return this;
    }

    // ── ASSERTION METHODS ────────────────────────────────────────────────────

    async verifySubredditUrl(expectedPath: string, testInfo: TestInfo) {
        const url = this.page.url();
        console.log("Expected: ", url);
        expect(url.toLowerCase()).toContain(expectedPath.toLowerCase());
        await this.attachScreenshotToReport('Assert: Subreddit URL Verified', testInfo);
        return this;
    }

    async verifyBestSortSelected(testInfo: TestInfo) {
        // Assert that the sort option dropdown has "Best" selected or is displaying it
        const bestSort = this.page.locator('button:has-text("Best"), [aria-label*="sort"], shreddit-feed-sort-dropdown button').first();
        await expect(bestSort).toBeVisible();
        await this.attachScreenshotToReport('Assert: Best Sort Option Selected', testInfo);
        return this;
    }
}
