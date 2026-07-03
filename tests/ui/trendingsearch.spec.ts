import { test } from '@playwright/test';
import { RedditHomePage } from '../../src/pages/RedditHomePage';
import { RedditSearchResultsPage } from '../../src/pages/RedditSearchResultsPage';
import testData from '../../testdata/reddit/trendingsearch.json';

test.describe('Reddit Trending Search Validation', () => {

    test('Verify trending search item and AI response on Reddit', async ({ page }, testInfo) => {
        console.log('▶ Starting: Reddit Trending Search Test');

        const homePage = new RedditHomePage(page);
        const searchResultsPage = new RedditSearchResultsPage(page);

        // Phase: Open Reddit Home Page
        console.log('→ Phase: Open Reddit Home Page');
        console.log('  ↳ Step: Navigate to reddit home page');
        await homePage.open(testInfo);

        // Phase: Verify Home Page Open
        console.log('→ Phase: Verify Home Page Open');
        console.log('  ↳ Step: Verify reddit home page is open');
        await homePage.verifyHomePageOpen(testInfo);

        // Phase: Search First Trending Item
        console.log('→ Phase: Search First Trending Item');
        console.log('  ↳ Step: Click search bar and select first trending item');
        await homePage.searchFirstTrendingItem(testInfo);

        // Retrieve the selected trending search term
        const selectedSearchItem = homePage.selectedSearchItem;
        console.log(`  ↳ Info: Selected trending search term is "${selectedSearchItem}"`);

        // Phase: Verify Search Results & AI Response
        console.log('→ Phase: Verify Search Results & AI Response');
        console.log('  ↳ Step: Verify AI generated Response is showing with "What people are saying" in All tab');
        await searchResultsPage.verifyAiResponseShowing(testInfo);

        // Phase: Verify Search Bar Input Value
        console.log('→ Phase: Verify Search Bar Input Value');
        console.log('  ↳ Step: Verify selected search item is showing on the search bar');
        await searchResultsPage.verifySearchItemInSearchBar(selectedSearchItem, testInfo);

        console.log('✅ Complete: Reddit Trending Search Test');
    });

});
