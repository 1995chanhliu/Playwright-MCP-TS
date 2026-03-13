import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  private readonly cartIcon: Locator;

  /**
   * @param page  The Playwright `Page` instance injected from the test fixture.
   */
  constructor(page: Page) {
    super(page);
    this.cartIcon = this.page.locator('.shopping_cart_link');
  }

  /**
   * Click the "Add to cart" button on the product details page.
   */
  async addToCart() {
    await this.clickButton('Add to cart');
  }

  /**
   * Click the "Remove" button to remove the product from the cart.
   */
  async removeFromCart() {
    await this.clickButton('Remove');
  }

  /**
   * Click the "Back to products" button to return to the product listing.
   */
  async backToProducts() {
    await this.clickButton('Back to products');
  }

  /**
   * Click the top-right cart icon to navigate to the cart page.
   */
  async openCart() {
    await this.cartIcon.click();
  }
}
