import { test, expect, Page } from "@playwright/test";
import { CurrencyCode, HomePage } from "../pages/homePage.page";
import { Gateway, gatewayNames, PaymentMethodPage } from "../pages/paymentMethod.page";
import { StripeCheckoutPage } from "../pages/stripeCheckout.page";
import { HeleketPaymentPage } from "../pages/heleketPayment.page";
import { XHubPaymentPage } from "../pages/xHubPayment.page";
import { EMAIL, OFFER } from "../data/testData";

type ProviderPage = StripeCheckoutPage | HeleketPaymentPage | XHubPaymentPage;

const providerPageFor: Record<Gateway, (page: Page) => ProviderPage> = {
    stripe: (page) => new StripeCheckoutPage(page),
    crypto: (page) => new HeleketPaymentPage(page),
    x_hub: (page) => new XHubPaymentPage(page),
};

const providerNames: Record<Gateway, string> = {
    stripe: "Stripe",
    crypto: "Heleket",
    x_hub: "X-Hub",
};

const redirects: { currency: CurrencyCode; gateway: Gateway }[] = [
    { currency: "USD", gateway: "stripe" },
    { currency: "USD", gateway: "crypto" },
    { currency: "EUR", gateway: "stripe" },
    { currency: "EUR", gateway: "crypto" },
    { currency: "RUB", gateway: "x_hub" },
    { currency: "RUB", gateway: "stripe" },
    { currency: "RUB", gateway: "crypto" },
];

let homePage: HomePage;
let paymentMethodPage: PaymentMethodPage;

test.describe("Redirect to payment provider", () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        paymentMethodPage = new PaymentMethodPage(page);

        await page.goto("/");
    });

    for (const { currency, gateway } of redirects) {
        test(`${currency}: ${gatewayNames[gateway]} redirects to ${providerNames[gateway]}`, async ({ page }) => {
            const providerPage = providerPageFor[gateway](page);

            await homePage.choosePlan(currency, OFFER, EMAIL);
            await expect(paymentMethodPage.headerSecondary).toContainText(paymentMethodPage.header);

            await paymentMethodPage.selectGateway(gateway);
            await paymentMethodPage.acceptTerms();
            await paymentMethodPage.payButton.click();

            await expect.soft(providerPage.root).toContainText(providerPage.expectedText, { timeout: 15000 });
            await expect.soft(page).toHaveURL(providerPage.url);
        });
    }
});
