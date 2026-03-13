import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Define the types for our fixtures
type AppFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  productDetailsPage: ProductDetailsPage;
  checkoutPage: CheckoutPage;
  autoLogin: void; // setup fixture for automatic login
};

// Extend the base test with our fixtures
export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  
  // Create an autoLogin fixture that runs before every test automatically
  autoLogin: [
    async ({ loginPage, page }, use) => {
      // 1. Go to login page
      await loginPage.goto();
      
      // 2. Perform login
      await loginPage.login();
      
      // 3. Wait for the redirect to complete
      await page.waitForURL('**/inventory.html');
      
      // 4. Continue with the test
      await use();
    },
    { auto: true } // This option enables the fixture automatically for all tests
  ],
});

// Re-export expect so we can use it directly from the fixture
export { expect } from '@playwright/test';
