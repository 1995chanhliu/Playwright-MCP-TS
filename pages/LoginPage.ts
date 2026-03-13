import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;

  /**
   * @param page  The Playwright `Page` instance injected from the test fixture.
   */
  constructor(page: Page) {
    super(page);
    this.errorMessage = this.page.locator('[data-test="error"]');
    this.errorCloseButton = this.page.locator('.error-button');
  }

  /**
   * Navigate to the Saucedemo login page.
   */
  async goto() {
    await this.goTo('https://www.saucedemo.com/');
  }

  /**
   * Type the given username into the Username field.
   *
   * @param username  The username string to enter.
   */
  async enterUserName(username: string) {
    await this.enterText('Username', username);
  }

  /**
   * Type the given password into the Password field.
   *
   * @param password  The password string to enter.
   */
  async enterPassword(password: string) {
    await this.enterText('Password', password);
  }

  /**
   * Click the Login submit button.
   */
  async clickLoginButton() {
    await this.clickButton('Login');
  }

  /**
   * Full login flow: enter credentials then click Login.
   *
   * @param username  Username to log in with. Defaults to `'standard_user'`.
   * @param password  Password to log in with. Defaults to `'secret_sauce'`.
   */
  async login(username = 'standard_user', password = 'secret_sauce') {
    await this.enterUserName(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Retrieve the text from the login error banner.
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.innerText()) ?? '';
  }

  /**
   * Click the close (X) button on the error banner.
   */
  async dismissError() {
    await this.errorCloseButton.click();
  }
}
