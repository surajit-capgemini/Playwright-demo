import { test } from '@playwright/test';
import { GooglePage } from '../../src/pages/GooglePage';
import testData from '../../testdata/google/google.json';

test.use({ baseURL: testData.url });

test.describe('Google Search Validation', () => {

    test('Verify title and search box visibility on Google', async ({ page }, testInfo) => {
        console.log('▶ Starting: Google Search Validation Test');

        const googlePage = new GooglePage(page);

        // Phase: Open Google Page
        console.log('→ Phase: Open Google Page');
        console.log('  ↳ Step: Navigate to Google home page');
        await googlePage.open(testInfo);

        // Phase: Verify Google Title
        console.log('→ Phase: Verify Google Title');
        console.log(`  ↳ Step: Verify title is "${testData.expectedTitle}"`);
        await googlePage.verifyTitle(testData.expectedTitle, testInfo);

        // Phase: Verify Google Search Box
        console.log('→ Phase: Verify Google Search Box');
        console.log('  ↳ Step: Verify google search box is visible');
        await googlePage.verifySearchBoxVisible(testInfo);

        console.log('✅ Complete: Google Search Validation Test');
    });

});
