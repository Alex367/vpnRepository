import { Locator, Page } from "@playwright/test";
import { FreeVpnPlanetBasePage } from "./freeVpnPlanetBase.page";

type CountryCode = "NL" | "DE" | "US" | "TK" | "FR" | "CZ" | "ES" | "PL" | "AR" | "TA" | "KZ" | "UA";
export type CurrencyCode = "USD" | "EUR" | "RUB";
export type OfferType = "1_month" | "1_year" | "2_days";

export class HomePage extends FreeVpnPlanetBasePage {
    readonly page: Page;
    readonly title = "Your Personal VPN - Buy Static VPN and IP Address | Planet VPN";
    readonly paymentMethodUrl = /personal\.freevpnplanet\.com\/payment\//;

    readonly locationDropdown: Locator;
    readonly currencyDropdown: Locator;
    readonly offer1Month: Locator;
    readonly emailInput: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;

        this.locationDropdown = page.locator('label[data-name="location"]');
        this.currencyDropdown = page.locator('label[data-name="currency_code"]');
        this.offer1Month = page.locator("#qa-radio-offer-1-month");
        this.emailInput = page.locator("#qa-input-email");
    }

    getLocationOption(countryCode: CountryCode): Locator {
        return this.page.locator(`#qa-select-location-${countryCode.toLowerCase()}`);
    }

    getCurrencyOption(currencyCode: CurrencyCode): Locator {
        return this.page.locator(`#qa-select-currency-${currencyCode.toLowerCase()}`);
    }

    getOfferRadio(offerId: OfferType): Locator {
        return this.page.locator(`input[name="offer_id"][value="${offerId}"]`);
    }

    getOfferLabel(offerId: OfferType): Locator {
        return this.page.locator("label.radio").filter({ has: this.getOfferRadio(offerId) });
    }

    async selectServerLocation(countryCode: CountryCode): Promise<void> {
        await this.locationDropdown.click();
        await this.getLocationOption(countryCode).click();
    }

    async selectCurrency(currencyCode: CurrencyCode): Promise<void> {
        await this.currencyDropdown.click();
        await this.getCurrencyOption(currencyCode).click();
    }

    async selectOffer(offerId: OfferType): Promise<void> {
        await this.getOfferLabel(offerId).click();
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async choosePlan(currency: CurrencyCode, offer: OfferType, email: string): Promise<void> {
        await this.selectCurrency(currency);
        await this.selectOffer(offer);
        await this.fillEmail(email);
        await this.payButton.click();
    }
}
