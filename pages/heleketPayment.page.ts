import { Locator, Page } from "@playwright/test";

export class HeleketPaymentPage {
    readonly page: Page;
    readonly url = /https:\/\/pay\.heleket\.com\/pay/;
    readonly expectedText = "Time remaining for payment:";
    readonly root: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator("body");
    }
}
