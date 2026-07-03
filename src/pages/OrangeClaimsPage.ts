import { Page } from 'playwright';
import { expect, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';

export class OrangeClaimsPage extends BasePage {

    constructor(public readonly page: Page) {
        super(page);
    }

    // ── ATOMIC METHODS ───────────────────────────────────────────────────────

    async clickAssignClaim() {
        await this.page.getByRole('link', { name: 'Assign Claim' }).click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    async enterEmployeeName(name: string) {
        // Fill employee name to trigger autocomplete search
        const employeeInput = this.page.getByPlaceholder('Type for hints...').first();
        await employeeInput.fill(name);
        
        // Wait for listbox suggestions list and select the matched option
        await this.page.waitForSelector(`role=option >> text=${name}`, { timeout: 15000 });
        await this.page.locator(`role=option >> text=${name}`).first().click();
        return this;
    }

    async selectClaimEvent(event: string) {
        // Click Event dropdown wrapper (first select in the row)
        await this.page.locator('.oxd-select-wrapper').first().click();
        await this.page.waitForSelector(`.oxd-select-dropdown >> text=${event}`, { timeout: 5000 });
        await this.page.locator(`.oxd-select-dropdown >> text=${event}`).first().click();
        return this;
    }

    async selectCurrency(currency: string) {
        // Click Currency dropdown wrapper (second select in the row)
        await this.page.locator('.oxd-select-wrapper').nth(1).click();
        await this.page.waitForSelector(`.oxd-select-dropdown >> text=${currency}`, { timeout: 5000 });
        await this.page.locator(`.oxd-select-dropdown >> text=${currency}`).first().click();
        return this;
    }

    async enterRemarks(remarks: string) {
        await this.page.locator('textarea').first().fill(remarks);
        return this;
    }

    async clickCreate() {
        await this.page.getByRole('button', { name: 'Create' }).click();
        await this.page.waitForURL('**/claim/assignClaim/id/**', { timeout: 20000 });
        return this;
    }

    async clickAddExpense() {
        await this.page.getByRole('button', { name: 'Add' }).first().click();
        return this;
    }

    async selectExpenseType(type: string) {
        // In Add Expense modal/form, select type dropdown (usually first select)
        await this.page.locator('.oxd-form-row .oxd-select-wrapper').first().click();
        await this.page.waitForSelector(`.oxd-select-dropdown >> text=${type}`, { timeout: 5000 });
        await this.page.locator(`.oxd-select-dropdown >> text=${type}`).first().click();
        return this;
    }

    async enterExpenseDate(date: string) {
        const dateInput = this.page.locator('.oxd-date-input input').first();
        await dateInput.click();
        await dateInput.press('Control+a');
        await dateInput.press('Backspace');
        await dateInput.fill(date);
        return this;
    }

    async enterExpenseAmount(amount: string) {
        await this.page.locator('.oxd-input-group:has-text("Amount") input').fill(amount);
        return this;
    }

    async enterExpenseRemarks(remarks: string) {
        await this.page.getByRole('dialog').locator('textarea, input').last().fill(remarks);
        return this;
    }

    async clickSaveExpense() {
        await this.page.getByRole('button', { name: 'Save' }).click();
        // Wait for modal to close
        await expect(this.page.locator('.oxd-dialog-container')).toBeHidden({ timeout: 5000 });
        return this;
    }

    async clickSubmitClaim() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await this.page.waitForLoadState('domcontentloaded');
        return this;
    }

    // ── COMPOSITE METHODS ────────────────────────────────────────────────────

    async performCreateClaim(employee: string, event: string, currency: string, remarks: string, testInfo: TestInfo) {
        await this.enterEmployeeName(employee);
        await this.selectClaimEvent(event);
        await this.selectCurrency(currency);
        await this.enterRemarks(remarks);
        await this.clickCreate();
        await this.attachScreenshotToReport('Claim Request Created', testInfo);
        return this;
    }

    async performAddExpense(type: string, date: string, amount: string, remarks: string, testInfo: TestInfo) {
        await this.clickAddExpense();
        await this.selectExpenseType(type);
        await this.enterExpenseDate(date);
        await this.enterExpenseAmount(amount);
        await this.enterExpenseRemarks(remarks);
        await this.clickSaveExpense();
        await this.attachScreenshotToReport('Expense Added to Claim', testInfo);
        return this;
    }

    // ── ASSERTION METHODS ────────────────────────────────────────────────────

    async verifyClaimDetailsPageLoaded(testInfo: TestInfo) {
        // Verify we are on Claim Details page (contains text Create Claim Request or similar heading)
        await expect(this.page.locator('.oxd-layout-context')).toContainText('Expenses', { timeout: 15000 });
        await this.attachScreenshotToReport('Claim Details Page Loaded', testInfo);
        return this;
    }

    async verifyExpenseAdded(expenseType: string, amount: string, testInfo: TestInfo) {
        // Verify expense type and amount are displayed in the expenses table
        const tableBody = this.page.locator('.oxd-table-body').first();
        await expect(tableBody).toContainText(expenseType);
        await expect(tableBody).toContainText(amount);
        await this.attachScreenshotToReport('Verify: Expense Added Successfully', testInfo);
        return this;
    }

    async verifyClaimStatus(expectedStatus: string, testInfo: TestInfo) {
        // Verify Claim status changes to the expected value
        const statusLocator = this.page.locator('.oxd-input-group:has-text("Status") input');
        await expect(statusLocator).toHaveValue(expectedStatus, { timeout: 10000 });
        await this.attachScreenshotToReport(`Verify Claim Status: ${expectedStatus}`, testInfo);
        return this;
    }
}
