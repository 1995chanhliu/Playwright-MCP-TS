import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly cartItem: Locator;
  private readonly completeHeader: Locator;

  /**
   * @param page  The Playwright `Page` instance injected from the test fixture.
   */
  constructor(page: Page) {
    super(page);
    this.cartItem = this.page.locator('.cart_item');
    this.completeHeader = this.page.locator('.complete-header');
  }

  /**
   * Click the Checkout button to begin the checkout flow from the Cart page.
   */
  async startCheckout() {
    await this.clickButton('Checkout');
  }

  /**
   * Remove a specific product from the Cart page by its name.
   *
   * @param productName  The exact visible name of the product to remove.
   */
  async removeProductFromCart(productName: string) {
    const productContainer = this.cartItem.filter({ hasText: productName });
    await this.clickButton('Remove', productContainer);
  }

  /**
   * Get the number of items currently visible in the cart or checkout overview.
   *
   * @returns A promise that resolves to the number of cart item rows.
   */
  async getCartItemsCount(): Promise<number> {
    return await this.cartItem.count();
  }

  /**
   * Enter the first name into the shipping info form.
   *
   * @param firstName  The first name to enter.
   */
  async enterFirstName(firstName: string) {
    await this.enterText('First Name', firstName);
  }

  /**
   * Enter the last name into the shipping info form.
   *
   * @param lastName  The last name to enter.
   */
  async enterLastName(lastName: string) {
    await this.enterText('Last Name', lastName);
  }

  /**
   * Enter the zip/postal code into the shipping info form.
   *
   * @param zipCode  The postal code to enter.
   */
  async enterPostalCode(zipCode: string) {
    await this.enterText('Zip/Postal Code', zipCode);
  }

  /**
   * Click the Continue button to proceed from Step 1 to the checkout overview.
   */
  async clickContinue() {
    await this.clickButton('Continue');
  }

  /**
   * Fill all fields in the Step 1 checkout form and proceed to the overview.
   * Wraps `enterFirstName`, `enterLastName`, `enterPostalCode`, and `clickContinue`.
   *
   * @param firstName  Shopper's first name.
   * @param lastName   Shopper's last name.
   * @param zipCode    Shopper's zip / postal code.
   */
  async fillShippingInfo(firstName: string, lastName: string, zipCode: string) {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(zipCode);
    await this.clickContinue();
  }

  /**
   * Click the Finish button to submit the order from the checkout overview page.
   */
  async finishCheckout() {
    await this.clickButton('Finish');
  }

  /**
   * Read the order-complete confirmation message from the checkout success page.
   *
   * @returns A promise that resolves to the confirmation header text.
   */
  async getCompletedMessage(): Promise<string> {
    return (await this.completeHeader.innerText()) ?? '';
  }

  /**
   * Click the Back Home button to return to the product listing after a completed order.
   */
  async backHome() {
    await this.clickButton('Back Home');
  }
}
