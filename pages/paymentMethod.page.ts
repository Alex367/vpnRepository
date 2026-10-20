import { Locator, Page } from "@playwright/test";
import { FreeVpnPlanetBasePage } from "./freeVpnPlanetBase.page";

export type Gateway = "stripe" | "crypto" | "x_hub";

export const gatewayNames: Record<Gateway, string> = {
    stripe: "Credit Card",
    crypto: "Cryptocurrency",
    x_hub: "SBP",
};

export class PaymentMethodPage extends FreeVpnPlanetBasePage {
    readonly page: Page;
    readonly header = "Choose payment method";

    readonly gatewayInputs: Locator;
    readonly commissionNote: Locator;
    readonly termsCheckbox: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.gatewayInputs = page.locator('input[name="gateway"]');
        this.commissionNote = page.getByText(/комиссия\s*3%/);
        this.termsCheckbox = page.locator("#qa-checkbox-terms");
    }

    getGatewayInput(gateway: Gateway): Locator {
        return this.page.locator(`input[name="gateway"][value="${gateway}"]`);
    }

    getGatewayLabel(gateway: Gateway): Locator {
        return this.page.locator("label").filter({ has: this.getGatewayInput(gateway) });
    }

    async selectGateway(gateway: Gateway): Promise<void> {
        await this.getGatewayLabel(gateway).click();
    }

    async acceptTerms(): Promise<void> {
        await this.termsCheckbox.focus();
        await this.page.keyboard.press("Space");
    }

    async isTermsValueMissing(): Promise<boolean> {
        return this.termsCheckbox.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    }
}
