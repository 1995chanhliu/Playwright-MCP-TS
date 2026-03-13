---
name: playwright-expert
description: Use this skill when creating or debugging Playwright tests using Page Object Model.
---

### Update BasePage

- BasePage is a class that contains common methods for all page objects only.
- The methods that only use for a few pages should not be here
- Update it when you need to add a new method for all and only page objects.
- Each method should have JSDoc to explain what it does and the parameters it takes.

### Real-life Example of a Base Page:

```typescript
import { Page, Locator } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // This is correct
  clickButton(buttonName: string): Promise<void> {
    return this.page.getByRole("button", { name: buttonName }).click();
  }

  // This is not correct. This method is not used for login, checkout page
  async openCart(): Promise<void> {
    await this.click(".shopping_cart_link");
  }
}
```

## Page Object structure and creation

- **File name** ends in `Page.ts` (e.g. `LoginPage.ts`)
- **Class name** matches `[Name]Page`
- **Extends** `BasePage`
- **`private readonly`** locators are used only for elements accessed via CSS/XPath selectors that aren't covered by `BasePage` common methods
- **Button / text labels** are inlined directly into method calls (e.g. `clickButton('Login')`) — no separate `labels` object
- **Each action** is its own method; complex flows wrap those atomic methods (e.g. `login()` wraps `enterUserName()`, `enterPassword()`, `clickLoginButton()`)
7. **Every method** has a JSDoc comment describing its purpose and parameters

## Real-life Example of a Page Object:

```typescript
import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private readonly usernameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.page.locator("#username");
  }

  async enterUserName(username: string) {
    await this.enterText("Username", username);
  }

  async enterPassword(password: string) {
    await this.enterText("Password", password);
  }

  async clickLoginButton() {
    await this.clickButton("Login");
  }

  async login(username = "standard_user", password = "secret_sauce") {
    await this.enterUserName(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
```
