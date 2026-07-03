import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class RedditSearchResultsPage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ASSERTION METHODS ────────────────────────────────────────────────────

    async verifyAiResponseShowing(testInfo: TestInfo) {
        // Verify AI generated Response is showing with "What people are saying"
        const aiResponseHeader = this.page.getByText('What people are saying', { exact: true });
        await expect(aiResponseHeader).toBeVisible();

        // Verify it is in the "All" tab
        // Normally, the "All" tab on Reddit search has role tab or contains text "All"
        const allTab = this.page.locator('[role="tab"][name="All"], [role="tab"]:has-text("All"), button:has-text("All")').first();
        await expect(allTab).toBeVisible();

        await this.attachScreenshotToReport('Assert: AI Response showing in All tab', testInfo);
        return this;
    }

    async verifySearchItemInSearchBar(expectedItem: string, testInfo: TestInfo) {
        const searchInput = this.page.locator('input[placeholder*="Find"], input[placeholder*="Search"], input[type="search"]').first();
        
        // On Reddit, the value attribute might be used or it might display as text in the search input box
        // To be robust, we check if the search input has value or contains the expectedItem
        const inputValue = await searchInput.inputValue();
        
        // Fallback check: if inputValue is empty, check if we can verify via toHaveValue or custom assertion
        if (inputValue) {
            expect(inputValue.toLowerCase()).toContain(expectedItem.toLowerCase());
        } else {
            await expect(searchInput).toHaveValue(new RegExp(expectedItem, 'i'));
        }

        await this.attachScreenshotToReport(`Assert: Search Bar has term ${expectedItem}`, testInfo);
        return this;
    }
}
