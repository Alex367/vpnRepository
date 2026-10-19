import { Locator, Page } from "@playwright/test";
import { CommonObjects } from "./common.page";

type Gateway = "stripe" | "crypto";

export class PaymentMethodPage extends CommonObjects {
    readonly page: Page;
    readonly header = "Choose payment method";

    readonly termsCheckbox: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.termsCheckbox = page.locator("#qa-checkbox-terms");
    }

    getGatewayLabel(gateway: Gateway): Locator {
        return this.page
            .locator("label")
            .filter({ has: this.page.locator(`input[name="gateway"][value="${gateway}"]`) });
    }

    async selectGateway(gateway: Gateway): Promise<void> {
        await this.getGatewayLabel(gateway).click();
    }

    async acceptTerms(): Promise<void> {
        await this.termsCheckbox.focus();
        await this.page.keyboard.press("Space");
    }
}
