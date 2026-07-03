import { test } from '@playwright/test';
import { OrangeLoginPage } from '../../src/pages/OrangeLoginPage';
import { OrangeDashboardPage } from '../../src/pages/OrangeDashboardPage';
import { OrangeClaimsPage } from '../../src/pages/OrangeClaimsPage';
import testData from '../../testdata/OrangeHRM/addEmployeeToClaimE2E_flow.json';

// ── TEST CONFIG ──────────────────────────────────────────────────────────────
test.use({ baseURL: 'https://opensource-demo.orangehrmlive.com' });

// ── TEST SCENARIO ────────────────────────────────────────────────────────────

test('OrangeHRM Add Employee to Claim E2E Flow', async ({ page }, testInfo) => {
    test.setTimeout(90000);
    console.log('▶ Starting: OrangeHRM Add Employee to Claim E2E Flow');

    const loginPage = new OrangeLoginPage(page);
    const dashboardPage = new OrangeDashboardPage(page);
    const claimsPage = new OrangeClaimsPage(page);

    // Phase: Login
    console.log('→ Phase: Login to OrangeHRM');
    console.log('  ↳ Step: Navigate to login page');
    await loginPage.open(testInfo);
    
    console.log('  ↳ Step: Enter credentials and click login');
    await loginPage.performLogin(testData.username, testData.password, testInfo);

    // Phase: Dashboard Navigation
    console.log('→ Phase: Navigate to Claims module');
    console.log('  ↳ Step: Verify dashboard is loaded successfully');
    await dashboardPage.verifyDashboardLoaded(testInfo);
    
    console.log('  ↳ Step: Go directly to Claims module');
    await dashboardPage.navigateToClaimPageDirectly();

    // Phase: Assign Claim Request
    console.log('→ Phase: Create Claim Request');
    console.log('  ↳ Step: Click Assign Claim from navigation bar');
    await claimsPage.clickAssignClaim();
    
    console.log('  ↳ Step: Fill and submit Assign Claim Request form');
    await claimsPage.performCreateClaim(
        testData.employeeName,
        testData.claimEvent,
        testData.currency,
        testData.remarks,
        testInfo
    );

    // Phase: Verify Claim Creation & Add Expense
    console.log('→ Phase: Add Expense to Claim');
    console.log('  ↳ Step: Verify claim details page is loaded');
    await claimsPage.verifyClaimDetailsPageLoaded(testInfo);
    
    console.log('  ↳ Step: Fill and submit Add Expense form');
    await claimsPage.performAddExpense(
        testData.expenseType,
        testData.expenseDate,
        testData.expenseAmount,
        testData.expenseRemarks,
        testInfo
    );

    // Phase: Verify Expense & Submit Claim
    console.log('→ Phase: Submit Claim');
    console.log('  ↳ Step: Verify expense is displayed in the expenses table');
    await claimsPage.verifyExpenseAdded(testData.expenseType, testData.expenseAmount, testInfo);
    
    console.log('  ↳ Step: Click Submit button to submit the claim');
    await claimsPage.clickSubmitClaim();

    // Phase: Verification
    console.log('→ Phase: Verify Claim Status');
    console.log('  ↳ Step: Verify claim status is updated to Submitted');
    await claimsPage.verifyClaimStatus(testData.expectedStatus, testInfo);

    console.log('✅ Complete: OrangeHRM Add Employee to Claim E2E Flow');
});
