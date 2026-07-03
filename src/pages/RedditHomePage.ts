import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class RedditHomePage extends BasePage {
    public selectedSearchItem: string = '';

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────

    async open(testInfo: TestInfo) {
        await this.page.goto('/');
        await this.page.waitForLoadState('domcontentloaded');
        
        // Dismiss signup overlay/popups
        await this.page.keyboard.press('Escape');
        try {
            const closeBtn = this.page.locator('button[aria-label="Close"], shreddit-overlay-close-button button, [icon-name="close"]').first();
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
            }
        } catch (e) {
            // ignore close error
        }
        
        await this.attachScreenshotToReport('Reddit Home Page Opened', testInfo);
        return this;
    }

    async clickSearchBar() {
        // Find search container (shreddit-search-input or [role="search"]) and click it first to activate
        const searchContainer = this.page.locator('shreddit-search-input, [role="search"]').first();
        await searchContainer.click();
        
        // Then focus the inner search input
        const searchInput = this.page.locator('input[placeholder*="Find"], input[placeholder*="Search"], input[type="search"]').filter({ visible: true }).first();
        try {
            await searchInput.focus();
        } catch (e) {
            // ignore
        }
        return this;
    }

    async clickFirstTrendingItem() {
        // When search bar is clicked, trending items dropdown appears.
        // We select the first link under the search dropdown that goes to a search path.
        const trendingItem = this.page.locator('a[href*="/search/"], a[href*="q="]').first();
        
        // Wait for the trending item to be visible in the dropdown
        await trendingItem.waitFor({ state: 'visible', timeout: 5000 });

        // Store the text of the selected search item to verify it later.
        const href = await trendingItem.getAttribute('href') || '';
        let term = '';
        try {
            const searchParams = new URLSearchParams(href.split('?')[1] || '');
            term = searchParams.get('q') || '';
        } catch (e) {
            // ignore
        }
        
        if (!term) {
            const rawText = await trendingItem.textContent() || '';
            term = rawText.split('\n')[0].trim();
        }
        this.selectedSearchItem = term;
        
        await trendingItem.click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    async enterSearchQuery(query: string) {
        const searchInput = this.page.locator('input[placeholder*="Find"], input[placeholder*="Search"], input[type="search"]').filter({ visible: true }).first();
        await searchInput.fill(query);
        return this;
    }

    async clickCommunitySuggestion(communityName: string) {
        const cleanName = communityName.replace(/^r\//, '');
        const suggestion = this.page.locator(`a[href*="/r/${cleanName}"], a:has-text("${communityName}")`).first();
        await suggestion.waitFor({ state: 'visible', timeout: 5000 });
        await suggestion.click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    // ── COMPOSITE METHODS ────────────────────────────────────────────────────

    async searchFirstTrendingItem(testInfo: TestInfo) {
        await this.clickSearchBar();
        await this.clickFirstTrendingItem();
        await this.attachScreenshotToReport('After Clicking Trending Item', testInfo);
        return this;
    }

    async searchAndSelectCommunity(communityName: string, testInfo: TestInfo) {
        await this.clickSearchBar();
        await this.enterSearchQuery(communityName);
        await this.clickCommunitySuggestion(communityName);
        await this.attachScreenshotToReport(`After Navigating to ${communityName}`, testInfo);
        return this;
    }

    // ── ASSERTION METHODS ────────────────────────────────────────────────────

    async verifyHomePageOpen(testInfo: TestInfo) {
        const logo = this.page.getByRole('link', { name: 'Home' }).first();
        await expect(logo).toBeVisible();
        await this.attachScreenshotToReport('Assert: Home Page Open', testInfo);
        return this;
    }
}
