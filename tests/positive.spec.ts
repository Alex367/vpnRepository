import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/homePage.page";
import { PaymentMethodPage } from "../pages/paymentMethod.page";

let homePage: HomePage;
let paymentMethodPage: PaymentMethodPage;

test.describe("Positive tests", () => {
    test.beforeEach("Positive tests pre-conditions", async ({ page }) => {
        homePage = new HomePage(page);
        paymentMethodPage = new PaymentMethodPage(page);

        await page.goto("https://personal.freevpnplanet.com/");
    });

    test("has title", async ({ page }) => {
        await expect(page).toHaveTitle(homePage.title);

        await homePage.selectServerLocation("DE");
        await homePage.selectCurrency("EUR");

        await homePage.selectOffer("1_month");

        await homePage.fillEmail("alex@google.com");

        await homePage.payButton.click();

        await expect(homePage.headerSecondary).toContainText("Choose payment method");

        await expect(page).toHaveURL(/https:\/\/personal\.freevpnplanet\.com\/payment/);

        await paymentMethodPage.selectGateway("crypto");

        await paymentMethodPage.acceptTerms();
        await paymentMethodPage.payButton.click();
        await expect(page).toHaveURL(/https:\/\/pay\.heleket\.com\/pay/);

    });
});
