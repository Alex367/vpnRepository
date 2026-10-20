import { test, expect } from "@playwright/test";
import { CurrencyCode, HomePage } from "../pages/homePage.page";
import { Gateway, gatewayNames, PaymentMethodPage } from "../pages/paymentMethod.page";
import { EMAIL, OFFER } from "../data/testData";

const availableMethods: Record<CurrencyCode, Gateway[]> = {
    USD: ["stripe", "crypto"],
    EUR: ["stripe", "crypto"],
    RUB: ["x_hub", "stripe", "crypto"],
};

const defaultMethod: Record<CurrencyCode, Gateway> = {
    USD: "stripe",
    EUR: "stripe",
    RUB: "x_hub",
};

const currencies = Object.keys(availableMethods) as CurrencyCode[];

let homePage: HomePage;
let paymentMethodPage: PaymentMethodPage;

test.describe("Payment methods", () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        paymentMethodPage = new PaymentMethodPage(page);

        await page.goto("/");
    });

    for (const currency of currencies) {
        const methods = availableMethods[currency];

        test(`${currency}: shows exactly ${methods.map((g) => gatewayNames[g]).join(", ")}`, async ({ page }) => {
            await homePage.choosePlan(currency, OFFER, EMAIL);
            await page.waitForURL(homePage.paymentMethodUrl);

            await expect.soft(paymentMethodPage.gatewayInputs).toHaveCount(methods.length);
            for (const gateway of methods) {
                await expect.soft(paymentMethodPage.getGatewayLabel(gateway)).toBeVisible();
                await expect.soft(paymentMethodPage.getGatewayInput(gateway)).toBeEnabled();
            }
        });

        test(`${currency}: ${gatewayNames[defaultMethod[currency]]} is selected by default`, async ({ page }) => {
            await homePage.choosePlan(currency, OFFER, EMAIL);
            await page.waitForURL(homePage.paymentMethodUrl);

            await expect(paymentMethodPage.getGatewayInput(defaultMethod[currency])).toBeChecked();
        });
    }

    test("RUB: commission note is shown only while SBP is selected", async ({ page }) => {
        await homePage.choosePlan("RUB", OFFER, EMAIL);
        await page.waitForURL(homePage.paymentMethodUrl);
        await expect.soft(paymentMethodPage.commissionNote).toBeVisible();

        await paymentMethodPage.selectGateway("stripe");
        await expect.soft(paymentMethodPage.commissionNote).toBeHidden();

        await paymentMethodPage.selectGateway("crypto");
        await expect.soft(paymentMethodPage.commissionNote).toBeHidden();

        await paymentMethodPage.selectGateway("x_hub");
        await expect.soft(paymentMethodPage.commissionNote).toBeVisible();
    });

    for (const currency of ["USD", "EUR"] as CurrencyCode[]) {
        test(`${currency}: no commission note is shown`, async ({ page }) => {
            await homePage.choosePlan(currency, OFFER, EMAIL);
            await page.waitForURL(homePage.paymentMethodUrl);

            await expect(paymentMethodPage.commissionNote).toBeHidden();
        });
    }

    test("Changing currency from RUB to USD removes SBP", async ({ page }) => {
        await homePage.choosePlan("RUB", OFFER, EMAIL);
        await page.waitForURL(homePage.paymentMethodUrl);
        await expect(paymentMethodPage.getGatewayInput("x_hub")).toHaveCount(1);

        await page.goBack();
        await homePage.choosePlan("USD", OFFER, EMAIL);
        await page.waitForURL(homePage.paymentMethodUrl);

        await expect.soft(paymentMethodPage.getGatewayInput("x_hub")).toHaveCount(0);
        await expect.soft(paymentMethodPage.gatewayInputs).toHaveCount(availableMethods.USD.length);
    });
});
