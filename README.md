# Playwright Automation Framework

A TypeScript-based end-to-end test automation framework built with [Playwright](https://playwright.dev/), following the **Page Object Model (POM)** pattern.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Framework Architecture](#framework-architecture)
  - [BasePage](#basepage)
  - [Page Objects](#page-objects)
  - [Fixtures](#fixtures)
  - [Assertions (Validation)](#assertions-validation)
- [Writing a New Test](#writing-a-new-test)
- [Adding a New Page Object](#adding-a-new-page-object)
- [Configuration](#configuration)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

---

## Installation

```bash
# 1. Clone or open the repository
cd "playwright MCP_antigravity"

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (first-time setup)
npx playwright install
```

---

## Project Structure

```
.
├── fixtures/
│   ├── fixture.ts        # Extended test object with all page & auto-login fixtures
│   └── index.ts          # Re-exports (placeholder for additional fixtures)
├── pages/
│   ├── BasePage.ts       # Root class with shared browser helpers
│   ├── LoginPage.ts      # Login page actions
│   ├── ProductPage.ts    # Product listing page actions
│   ├── ProductDetailsPage.ts  # Single product detail page actions
│   └── CheckoutPage.ts   # Cart & checkout flow actions
├── tests/
│   └── product.checkout.spec.ts  # Example test suite
├── utils/
│   └── Validation.ts     # Assertion helpers wrapping Playwright's expect
├── playwright.config.ts  # Playwright configuration
├── tsconfig.json         # TypeScript configuration
└── package.json
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests headlessly |
| `npm run test:headed` | Run all tests with the browser visible |
| `npm run test:ui` | Open Playwright's interactive UI mode |
| `npm run test:debug` | Run tests in debug/step-through mode |
| `npm run report` | Open the last HTML test report |
| `npm run codegen` | Launch the Playwright code generator |

### Run a Specific File

```bash
npx playwright test tests/product.checkout.spec.ts
```

### Run a Specific Test by Name

```bash
npx playwright test --grep "Complete checkout flow"
```

---

## Framework Architecture

### BasePage

[`pages/BasePage.ts`](pages/BasePage.ts) is the root class every page object extends. It wraps the Playwright `Page` instance with shared helpers: navigation (`goTo`, `reload`, `goBack/Forward`), state (`getURL`, `getTitle`), waiting (`waitForPageLoad`, `waitForSelector`), interaction (`enterText`, `clickButton`, `clickLink`), and utilities (`getText`, `getValue`, `takeScreenshot`).

> Only add methods here if they are reusable across **all** page objects.

### Page Objects

Each page object in `pages/` extends `BasePage`, uses `private readonly` locators only for CSS/XPath elements, inlines label strings directly in method calls, and wraps atomic actions into higher-level flow methods. Every method has a JSDoc comment.

### Fixtures

[`fixtures/fixture.ts`](fixtures/fixture.ts) extends Playwright's `test` with page instances (`loginPage`, `productPage`, `productDetailsPage`, `checkoutPage`) and an `autoLogin` fixture that logs in before every test.

> Always import `test` from `../fixtures/fixture`, not from `@playwright/test`.

### Assertions (Validation)

[`utils/Validation.ts`](utils/Validation.ts) provides static assertion methods (`verifyEqual`, `verifyNotEqual`, `verifyContains`, `verifyTrue`, `verifyFalse`, `verifyNull`, etc.). All accept an optional failure `message`. Use these instead of calling `expect()` directly.

---

## Writing a New Test

1. Create a file in `tests/` ending in `.spec.ts`
2. Import `test` from `../fixtures/fixture`
3. Import `Validation` from `../utils/Validation`
4. Use `test.describe` for grouping and `test.step` for readability

```typescript
import { test } from '../fixtures/fixture';
import { Validation } from '../utils/Validation';

test.describe('My Feature', () => {
  test('should do something', async ({ productPage, checkoutPage }) => {
    await test.step('1. Add a product to cart', async () => {
      await productPage.addToCart('Sauce Labs Backpack');
    });

    await test.step('2. Open cart and verify item count', async () => {
      await productPage.openCart();
      const count = await checkoutPage.getCartItemsCount();
      Validation.verifyEqual(count, 1);
    });
  });
});
```

> **Note:** Login is handled automatically by the `autoLogin` fixture — you don't need to call `loginPage.login()` in your tests.

---

## Adding a New Page Object

1. Create `pages/MyFeaturePage.ts`
2. Import `Page` (and `Locator` if needed) from `@playwright/test`
3. Extend `BasePage`
4. Add `private readonly` locators only for CSS/XPath elements
5. Inline label strings directly in method calls
6. Export and register your page in `fixtures/fixture.ts`

```typescript
// pages/MyFeaturePage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyFeaturePage extends BasePage {
  private readonly someElement: Locator;  // CSS selector — can't use BasePage helpers

  /** @param page The Playwright Page instance from the fixture. */
  constructor(page: Page) {
    super(page);
    this.someElement = this.page.locator('.my-css-class');
  }

  /** Click the Save button. */
  async clickSave() {
    await this.clickButton('Save');  // label inlined directly
  }

  /** Read the status message. */
  async getStatus(): Promise<string> {
    return this.someElement.innerText();
  }
}
```

Then register it in `fixtures/fixture.ts`:

```typescript
import { MyFeaturePage } from '../pages/MyFeaturePage';

type AppFixtures = {
  // ... existing fixtures ...
  myFeaturePage: MyFeaturePage;
};

export const test = base.extend<AppFixtures>({
  // ... existing fixture definitions ...
  myFeaturePage: async ({ page }, use) => {
    await use(new MyFeaturePage(page));
  },
});
```

---

## Configuration

Key settings in [`playwright.config.ts`](playwright.config.ts):

| Setting | Value | Description |
|---|---|---|
| `testDir` | `./tests` | Where Playwright looks for test files |
| `baseURL` | `https://www.saucedemo.com` | Default base URL for `goTo()` relative paths |
| `headless` | `false` | Runs with browser UI visible by default |
| `timeout` | `30 000 ms` | Maximum time per test |
| `retries` | `2` on CI, `0` locally | Auto-retry on failure |
| `workers` | `1` on CI, auto locally | Parallel execution |
| `trace` | `on-first-retry` | Captures traces on retry for debugging |
| `screenshot` | `only-on-failure` | Screenshots saved on test failure |
| `video` | `retain-on-failure` | Video recordings saved on test failure |
| `reporter` | `html` + `list` | HTML report in `playwright-report/` |

To view the HTML report after a test run:

```bash
npm run report
```
