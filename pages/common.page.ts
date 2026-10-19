import { Locator, Page } from "@playwright/test";

export class CommonObjects {
    readonly page: Page;
    readonly headerSecondary: Locator;
    readonly payButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headerSecondary = page.locator("h2");
        this.payButton = page.getByLabel("Pay");
    }
}
