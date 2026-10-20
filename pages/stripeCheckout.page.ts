import { Locator, Page } from "@playwright/test";

export class StripeCheckoutPage {
    readonly page: Page;
    readonly url = /https:\/\/checkout\.stripe\.com\/c\/pay/;
    readonly expectedText = "Payment for order";
    readonly root: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator("body");
    }
}
