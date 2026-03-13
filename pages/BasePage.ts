import { Page, Locator } from '@playwright/test';

/**
 * BasePage
 * --------
 * The root Page Object that every other page class should extend.
 * It wraps the Playwright `Page` instance and provides common
 * browser-level helpers so individual pages stay focused on
 * their own selectors and actions.
 *
 * Rules:
 * - Only add methods here that are reusable across ALL page objects.
 * - Methods specific to only a few pages belong in those page objects.
 * - Every method must have JSDoc describing its purpose and parameters.
 */

export class BasePage {
  protected readonly page: Page;

  /**
   * @param page  The Playwright `Page` instance injected from the test fixture.
   */
  constructor(page: Page) {
    this.page = page;
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigate to a URL.
   * If a relative path is given, the `baseURL` from `playwright.config.ts` is prepended.
   *
   * @param url  Absolute or relative URL to navigate to.
   */
  async goTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Reload the current page and wait until the network is idle.
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Go back one entry in the browser history.
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward one entry in the browser history.
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  // ─── Page Information ─────────────────────────────────────────────────────────

  /**
   * Returns the current page URL.
   *
   * @returns The full URL string of the currently loaded page.
   */
  getURL(): string {
    return this.page.url();
  }

  /**
   * Returns the current page title.
   *
   * @returns A promise that resolves to the page `<title>` text.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ─── Waiting ──────────────────────────────────────────────────────────────────

  /**
   * Wait for the page to reach a specific load state.
   *
   * @param state  The load state to wait for.
   *               - `'load'`             – fired when the `load` event fires.
   *               - `'domcontentloaded'` – fired when the DOM is parsed (default).
   *               - `'networkidle'`      – fired when there are no more than 0 network connections for at least 500 ms.
   */
  async waitForPageLoad(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Wait for a CSS selector to become visible on the page.
   * Prefer semantic locators (`getByRole`, `getByLabel`) when possible.
   *
   * @param selector  CSS / XPath selector string to wait for.
   * @param timeout   Maximum wait time in milliseconds. Defaults to `10 000`.
   */
  async waitForSelector(selector: string, timeout = 10_000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Pause execution for a fixed number of milliseconds.
   * Use sparingly — prefer `waitForSelector` or `waitForPageLoad` wherever possible.
   *
   * @param ms  Duration to wait in milliseconds.
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  // ─── Element Queries ──────────────────────────────────────────────────────────

  /**
   * Read the inner text content of an element matched by a CSS selector.
   *
   * @param selector  CSS selector string that identifies the target element.
   * @returns A promise that resolves to the element's visible text, or an empty string if not found.
   */
  async getText(selector: string): Promise<string> {
    return (await this.page.innerText(selector)) ?? '';
  }

  /**
   * Read the current value of an `<input>` element matched by a CSS selector.
   *
   * @param selector  CSS selector string that identifies the target input element.
   * @returns A promise that resolves to the current value of the input field.
   */
  async getValue(selector: string): Promise<string> {
    return this.page.inputValue(selector);
  }

  // ─── Common Actions ────────────────────────────────────────────────────────────

  /**
   * Fill a text field identified by its visible label, placeholder, or accessible role name.
   * Tries `getByPlaceholder` → `getByLabel` → `getByRole('textbox')` in order and uses the first match.
   *
   * @param labelOrPlaceholder  The visible label text or placeholder text of the input.
   * @param text                The value to enter into the field.
   * @param parentLocator       Optional parent locator to scope the search (useful when the same label appears multiple times).
   */
  async enterText(labelOrPlaceholder: string, text: string, parentLocator?: Locator): Promise<void> {
    const root = parentLocator || this.page;
    const locator = root.getByPlaceholder(labelOrPlaceholder)
      .or(root.getByLabel(labelOrPlaceholder))
      .or(root.getByRole('textbox', { name: labelOrPlaceholder }));

    await locator.first().fill(text);
  }

  /**
   * Click a button identified by its visible name or submit input value.
   * Tries `getByRole('button')` first, then falls back to `input[type="submit"][value="..."]`.
   *
   * @param buttonName    The visible text or value of the button to click.
   * @param parentLocator Optional parent locator to scope the search (useful in lists or modals).
   */
  async clickButton(buttonName: string, parentLocator?: Locator): Promise<void> {
    const root = parentLocator || this.page;
    const locator = root.getByRole('button', { name: buttonName })
      .or(root.locator(`input[type="submit"][value="${buttonName}"]`));

    await locator.first().click();
  }

  /**
   * Click a link identified by its exact visible text.
   *
   * @param linkText      The exact visible label of the link to click.
   * @param parentLocator Optional parent locator to scope the search.
   */
  async clickLink(linkText: string, parentLocator?: Locator): Promise<void> {
    const root = parentLocator || this.page;
    await root.getByRole('link', { name: linkText, exact: true }).first().click();
  }

  // ─── Screenshots ──────────────────────────────────────────────────────────────

  /**
   * Take a full-page screenshot and save it to the given file path.
   *
   * @param path  Destination file path for the screenshot (e.g. `'screenshots/home.png'`).
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }
}
