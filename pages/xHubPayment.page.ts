import { Locator, Page } from "@playwright/test";

export class XHubPaymentPage {
    readonly page: Page;
    readonly url = /https:\/\/pay\.x-hub\.online/;
    readonly expectedText = "PRS Payment for order";
    readonly root: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator("header");
    }
}
