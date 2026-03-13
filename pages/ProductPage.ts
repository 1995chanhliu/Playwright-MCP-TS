import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  private readonly cartIcon: Locator;
  private readonly inventoryItem: Locator;

  /**
   * @param page  The Playwright `Page` instance injected from the test fixture.
   */
  constructor(page: Page) {
    super(page);
    this.cartIcon = this.page.locator('.shopping_cart_link');
    this.inventoryItem = this.page.locator('.inventory_item');
  }

  /**
   * Click a product title link to navigate to its details page.
   *
   * @param productName  The exact visible name of the product to navigate to.
   */
  async gotoProductDetails(productName: string) {
    await this.clickLink(productName);
  }

  /**
   * Add a specific product to the cart directly from the product listing page.
   *
   * @param productName  The exact visible name of the product to add.
   */
  async addToCart(productName: string) {
    const productContainer = this.inventoryItem.filter({ hasText: productName });
    await this.clickButton('Add to cart', productContainer);
  }

  /**
   * Click the top-right cart icon to navigate to the cart page.
   */
  async openCart() {
    await this.cartIcon.click();
  }
}
