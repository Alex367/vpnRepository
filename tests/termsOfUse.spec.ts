import { test, expect } from "@playwright/test";
import { CurrencyCode, HomePage } from "../pages/homePage.page";
import { PaymentMethodPage } from "../pages/paymentMethod.page";
import { EMAIL, OFFER } from "../data/testData";

let homePage: HomePage;
let paymentMethodPage: PaymentMethodPage;

test.describe("Terms of use", () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        paymentMethodPage = new PaymentMethodPage(page);

        await page.goto("/");
    });

    for (const currency of ["USD", "RUB"] as CurrencyCode[]) {
        test(`${currency}: payment is blocked until terms are accepted`, async ({ page }) => {
            await homePage.choosePlan(currency, OFFER, EMAIL);
            await page.waitForURL(homePage.paymentMethodUrl);
            await expect(paymentMethodPage.termsCheckbox).not.toBeChecked();

            await paymentMethodPage.payButton.click();

            expect.soft(await paymentMethodPage.isTermsValueMissing()).toBe(true);
            await expect.soft(page).toHaveURL(homePage.paymentMethodUrl);
            await expect.soft(paymentMethodPage.headerSecondary).toContainText(paymentMethodPage.header);
        });
    }
});
