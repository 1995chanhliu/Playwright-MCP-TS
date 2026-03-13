# Playwright Automation Rules

- **Language**: Always use TypeScript.
- **Pattern**: Use the **Page Object Model (POM)** for all tests.
- **Locators**: Prefer `page.getByRole()` or `page.getByText(), ...` over Xpath/CSS selectors.
- **Naming**: Test files must end in `.spec.ts`. Page objects must end in `Page.ts`.
- **Assertions**: Use method from utils/Validation.ts for any assertion like `Validation.verifyEqual(item, 2);`.
- **Waiting**: Limited use `page.waitForTimeout()`. Use auto-waiting or specific locators.