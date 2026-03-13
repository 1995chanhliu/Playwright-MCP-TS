import { test } from '../fixtures/fixture';
import { Validation } from '../utils/Validation';

test.describe('Product Checkout', () => {

  test('Complete checkout flow for a single product', async ({
    productPage,
    productDetailsPage,
    checkoutPage,
  }) => {
    await test.step('1. Login with valid password (Handled automatically by fixture)', async () => {
      // Handled automatically by the 'autoLogin' fixture from fixture.ts
    });

    await test.step('2. On Product page, click on Sauce Labs Bike Light product', async () => {
      await productPage.gotoProductDetails('Sauce Labs Bike Light');
    });

    await test.step('3. Click Add to cart on Product details page', async () => {
      await productDetailsPage.addToCart();
    });

    await test.step('4. Click open cart icon on top right corner', async () => {
      await productDetailsPage.openCart();
    });

    await test.step('5. On Checkout page, click Checkout', async () => {
      await checkoutPage.startCheckout();
    });

    await test.step('6. Input First name: Tommy, Last name: Teo, Zip: 70000 then click Continue', async () => {
      await checkoutPage.fillShippingInfo('Tommy', 'Teo', '70000');
    });

    await test.step('7. Click Finish', async () => {
      await checkoutPage.finishCheckout();
    });

    await test.step('8. Verify order completed strongly then Back Home', async () => {
      const message = await checkoutPage.getCompletedMessage();
      Validation.verifyEqual(message, 'Thank you for your order!');
      await checkoutPage.backHome();
    });
  });

  test('Add 3 products to cart, remove 1, and checkout the remaining 2', async ({
    productPage,
    checkoutPage,
  }) => {
    await test.step('1. Add 3 products to cart', async () => {
      await productPage.addToCart('Sauce Labs Backpack');
      await productPage.addToCart('Sauce Labs Bike Light');
      await productPage.addToCart('Sauce Labs Bolt T-Shirt');
    });

    await test.step('2. Open cart', async () => {
      await productPage.openCart();
    });

    await test.step('3. Remove 1 product from cart', async () => {
      await checkoutPage.removeProductFromCart('Sauce Labs Backpack');
    });

    await test.step('4. Verify 2 products remain in cart and proceed to checkout', async () => {
      const remainingItems = await checkoutPage.getCartItemsCount();
      Validation.verifyEqual(remainingItems, 2);
      await checkoutPage.startCheckout();
    });

    await test.step('5. Fill shipping info', async () => {
      await checkoutPage.fillShippingInfo('Jane', 'Doe', '90210');
    });

    await test.step('6. Verify checkout overview still has 2 products and finish', async () => {
      const itemsInOverview = await checkoutPage.getCartItemsCount();
      Validation.verifyEqual(itemsInOverview, 2);
      await checkoutPage.finishCheckout();
    });

    await test.step('7. Verify successful checkout', async () => {
      const message = await checkoutPage.getCompletedMessage();
      Validation.verifyEqual(message, 'Thank you for your order!');
      await checkoutPage.backHome();
    });
  });
});
