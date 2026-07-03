import { test } from '@playwright/test';
import { RedditHomePage } from '../../src/pages/RedditHomePage';
import { RedditCommunityPage } from '../../src/pages/RedditCommunityPage';
import { RedditPostPage } from '../../src/pages/RedditPostPage';
import testData from '../../testdata/reddit/search.json';

test.describe('Reddit Community and Comments Search Validation', () => {

    test('Verify subreddit navigation and comment search on Reddit', async ({ page }, testInfo) => {
        console.log('▶ Starting: Reddit Search Test');

        const homePage = new RedditHomePage(page);
        const communityPage = new RedditCommunityPage(page);
        const postPage = new RedditPostPage(page);

        // Phase: Open Reddit Home Page
        console.log('→ Phase: Open Reddit Home Page');
        console.log('  ↳ Step: Navigate to reddit home page');
        await homePage.open(testInfo);

        // Phase: Verify Home Page Open
        console.log('→ Phase: Verify Home Page Open');
        console.log('  ↳ Step: Verify reddit home page is open');
        await homePage.verifyHomePageOpen(testInfo);

        // Phase: Search Subreddit Community
        console.log('→ Phase: Search Subreddit Community');
        console.log(`  ↳ Step: Search and select community "${testData.communityName}"`);
        await homePage.searchAndSelectCommunity(testData.communityName, testInfo);

        // Phase: Verify Subreddit Community Landing Page
        console.log('→ Phase: Verify Subreddit Community Landing Page');
        console.log(`  ↳ Step: Verify URL contains "${testData.subredditPath}"`);
        await communityPage.verifySubredditUrl(testData.subredditPath, testInfo);
        console.log('  ↳ Step: Verify "Best" sort option is selected');
        await communityPage.verifyBestSortSelected(testInfo);

        // Phase: Open Subreddit Post
        console.log('→ Phase: Open Subreddit Post');
        console.log('  ↳ Step: Click on the first post in the subreddit feed');
        await communityPage.openAndVerifyFirstPost(testInfo);

        // Phase: Verify Post Content
        console.log('→ Phase: Verify Post Content');
        console.log('  ↳ Step: Verify post title is string and visible');
        await postPage.verifyPostTitleVisible(testInfo);

        // Phase: Search Comments
        console.log('→ Phase: Search Comments');
        console.log(`  ↳ Step: Scroll and search comments for query "${testData.searchQuery}"`);
        await postPage.searchComments(testData.searchQuery, testInfo);

        // Phase: Verify No Comments Search Results
        console.log('→ Phase: Verify No Comments Search Results');
        console.log(`  ↳ Step: Verify message "${testData.noResultsMessage}" is displayed`);
        await postPage.verifyNoCommentsResults(testData.noResultsMessage, testInfo);

        console.log('✅ Complete: Reddit Search Test');
    });

});
