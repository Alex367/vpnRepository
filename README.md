# vpnRepository

End-to-end tests for the Planet VPN checkout at [personal.freevpnplanet.com](https://personal.freevpnplanet.com), written with Playwright and TypeScript.

The goal is to cover every available payment method and to verify that each one redirects to the correct payment provider.

## What is tested

The available payment methods depend on the currency chosen on the first page:

| Currency | Payment methods                                  | Selected by default |
| -------- | ------------------------------------------------ | ------------------- |
| USD      | Credit Card, Cryptocurrency                      | Credit Card         |
| EUR      | Credit Card, Cryptocurrency                      | Credit Card         |
| RUB      | SBP (fast payments), Credit Card, Cryptocurrency | SBP                 |

Each payment method redirects to its own provider:

| Payment method | Provider | Expected address                    | Expected text                 |
| -------------- | -------- | ----------------------------------- | ----------------------------- |
| Credit Card    | Stripe   | `https://checkout.stripe.com/c/pay` | `Payment for order`           |
| Cryptocurrency | Heleket  | `https://pay.heleket.com/pay`       | `Time remaining for payment:` |
| SBP            | X-Hub    | `https://pay.x-hub.online`          | `PRS Payment for order`       |

The tests are split into three files:

- **`tests/paymentMethods.spec.ts`** checks the payment method page for each currency: the exact list of methods, the default method, the 3% commission note shown only for SBP, and that switching from RUB to USD removes SBP. These tests never leave the Planet VPN site.
- **`tests/termsOfUse.spec.ts`** checks that payment is blocked until the terms of use are accepted.
- **`tests/redirectedProviders.spec.ts`** pays with every currency and method combination and checks that the browser lands on the right provider page.

### Scope

- Only the 1 month plan is used. The plan doesn't change which payment methods are offered, except that Cryptocurrency is disabled for the 2-day plan.
- The server location is left at its default, because it has no effect on payment methods.

## Project structure

```
data/
    testData.ts                 shared test data: email and plan
pages/
    freeVpnPlanetBase.page.ts   base class for all Planet VPN pages
    homePage.page.ts            "Choose your plan" page
    paymentMethod.page.ts       "Choose payment method" page
    stripeCheckout.page.ts      Stripe checkout page
    heleketPayment.page.ts      Heleket crypto payment page
    xHubPayment.page.ts         X-Hub SBP payment page
tests/
    paymentMethods.spec.ts
    termsOfUse.spec.ts
    redirectedProviders.spec.ts
global-setup.ts                 clears old Allure results before each run
playwright.config.ts
```

The project follows the Page Object pattern. Page objects hold locators and actions only. All checks live in the test files.

## Requirements

- Node.js 20.19 or newer. Version 22 or newer is recommended.
- npm, which comes with Node.js.

## Installation

```bash
git clone https://github.com/Alex367/vpnRepository.git
cd vpnRepository
npm ci
npx playwright install chromium
```

On Linux, install the browser's system libraries too:

```bash
npx playwright install --with-deps chromium
```

## Running tests

| Command                                                                     | What it does                                         |
| --------------------------------------------------------------------------- | ---------------------------------------------------- |
| `npm test`                                                                  | Runs all tests                                       |
| `npx playwright test tests/paymentMethods.spec.ts tests/termsOfUse.spec.ts` | Runs only the tests that stay on the Planet VPN site |
| `npx playwright test tests/redirectedProviders.spec.ts`                     | Runs only the redirect tests                         |
| `npx playwright test --headed`                                              | Runs tests with a visible browser                    |
| `npx playwright test --ui`                                                  | Opens Playwright's interactive UI mode               |
| `npx playwright show-report`                                                | Opens Playwright's HTML report of the last run       |

While tests run, the terminal shows each result as it finishes.

## Allure report

Every test run also writes Allure results to the `allure-results` folder. The folder is emptied at the start of each run by `global-setup.ts`, so a report only contains the latest run.

After a run, build and open the report:

```bash
npm run allure:generate
npm run allure:open
```

- `allure:generate` deletes the old `allure-report` folder and builds a new report there. You can zip this folder and share it.
- `allure:open` serves the report in your browser.

Always run `allure:generate` again after a new test run. The report is a snapshot and doesn't update by itself.

## Code quality

| Command                | What it does                                                |
| ---------------------- | ----------------------------------------------------------- |
| `npm run format`       | Formats all files with Prettier                             |
| `npm run format:check` | Reports files that are not formatted, without changing them |
| `npm run lint`         | Runs ESLint                                                 |
| `npm run typecheck`    | Runs the TypeScript type check                              |

Run all three checks before committing:

```bash
npm run format:check && npm run lint && npm run typecheck
```

### Prettier

Prettier keeps the code style the same on every computer. The rules are in `.prettierrc.json`: four-space indents, double quotes, semicolons, lines up to 120 characters and Unix line endings. Prettier is pinned to one exact version, so everyone formats the same way.

### ESLint

ESLint finds mistakes that formatting can't. The setup in `eslint.config.mjs` combines three rule sets:

- **JavaScript and TypeScript rules,** including a check for a missing `await`. A forgotten `await` is the most common cause of random Playwright failures.
- **Playwright rules** for the `tests` folder. They catch a leftover `test.only`, skipped tests, fixed waits and tests without checks.
- **Prettier compatibility,** which turns off ESLint's formatting rules so the two tools don't conflict.

### TypeScript

Playwright runs tests without checking their types. `npm run typecheck` checks every file in strict mode, so a wrong property name or argument type is caught before the tests run.

### VS Code

Install the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions. Then turn on format on save, with Prettier as the default formatter, to format every file automatically.

## Continuous integration

GitHub Actions runs `.github/workflows/tests.yml` on every push to `main` and on every pull request into `main`:

1. **Format, lint and type check.** If any of them fails, the tests don't run.
2. **Playwright tests** that stay on the Planet VPN site, in Chromium.

The redirect tests create real checkout sessions, so they never run automatically. To include them, open the **Actions** tab, choose **Tests**, click **Run workflow** and tick the redirect option.

Every run uploads the Playwright and Allure reports. Download them from the **Artifacts** section at the bottom of the run's page. They are kept for 14 days.
