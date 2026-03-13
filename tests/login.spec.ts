import { test } from '../fixtures/fixture';
import { Validation } from '../utils/Validation';

test.describe.skip('Login Tests', () => {
  // We override the autoLogin fixture to do nothing for this test suite,
  // because we want to test the login page itself.
  test.use({ autoLogin: async ({}, use) => { await use(); } });

  test.beforeEach(async ({ loginPage }) => {
    // Starting state for almost all tests: Browser opened on fresh login page
    await loginPage.goto();
  });

  test('TC-LOGIN-01 — Successful Login with Standard User', async ({ page, loginPage }) => {
    await test.step('1. Verify the page title is Swag Labs', async () => {
      Validation.verifyEqual(await loginPage.getTitle(), 'Swag Labs', 'Title should be Swag Labs');
    });

    await test.step('2. Enter credentials and click Login button', async () => {
      // 5. Enter standard_user into the Username field
      await loginPage.enterUserName('standard_user');
      // 6. Enter secret_sauce into the Password field
      await loginPage.enterPassword('secret_sauce');
      // 7. Click the Login button
      await loginPage.clickLoginButton();
    });

    await test.step('3. Verify successful redirect to inventory page', async () => {
      // Wait for redirect
      await page.waitForURL('**/inventory.html');
      Validation.verifyContains(page.url(), '/inventory.html', 'Should redirect to products page');
      
      // Verify no error banner is shown - if it was shown, we would still be on login page.
    });
  });

  test('TC-LOGIN-02 — Login with Locked-Out User', async ({ page, loginPage }) => {
    await test.step('1. Enter credentials and click Login', async () => {
      await loginPage.enterUserName('locked_out_user');
      await loginPage.enterPassword('secret_sauce');
      await loginPage.clickLoginButton();
    });

    await test.step('2. Verify error banner and no redirect', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, 'Epic sadface: Sorry, this user has been locked out.', 'Error message should match');
      Validation.verifyNotContains(page.url(), '/inventory.html', 'Should not redirect');
    });
  });

  test('TC-LOGIN-03 — Login with Wrong Password', async ({ page, loginPage }) => {
    await test.step('1. Enter correct username and wrong password', async () => {
      await loginPage.enterUserName('standard_user');
      await loginPage.enterPassword('wrong_password');
      await loginPage.clickLoginButton();
    });

    await test.step('2. Verify error banner and no redirect', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, 'Epic sadface: Username and password do not match any user in this service', 'Error message should match');
      Validation.verifyNotContains(page.url(), '/inventory.html', 'Should not redirect');
    });
  });

  test('TC-LOGIN-04 — Login with Empty Username', async ({ page, loginPage }) => {
    await test.step('1. Leave Username field empty, enter Password', async () => {
      await loginPage.enterPassword('secret_sauce');
      await loginPage.clickLoginButton();
    });

    await test.step('2. Verify error banner and no redirect', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, 'Epic sadface: Username is required', 'Error message should complain about username');
      Validation.verifyNotContains(page.url(), '/inventory.html', 'Should not redirect');
    });
  });

  test('TC-LOGIN-05 — Login with Username Only (Password Empty)', async ({ page, loginPage }) => {
    await test.step('1. Enter Username, leave Password empty', async () => {
      await loginPage.enterUserName('standard_user');
      await loginPage.clickLoginButton();
    });

    await test.step('2. Verify error banner and no redirect', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, 'Epic sadface: Password is required', 'Error message should complain about password');
      Validation.verifyNotContains(page.url(), '/inventory.html', 'Should not redirect');
    });
  });

  test('TC-LOGIN-06 — Login with Both Fields Empty', async ({ page, loginPage }) => {
    await test.step('1. Click Login button with both fields empty', async () => {
      await loginPage.clickLoginButton();
    });

    await test.step('2. Verify error banner prioritizes Username and no redirect', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, 'Epic sadface: Username is required', 'Error message should validate username first');
      Validation.verifyNotContains(page.url(), '/inventory.html', 'Should not redirect');
    });
  });

  test('TC-LOGIN-07 — Login with Non-Existent Username', async ({ page, loginPage }) => {
    await test.step('1. Enter unknown user credentials', async () => {
      await loginPage.enterUserName('unknown_user');
      await loginPage.enterPassword('secret_sauce');
      await loginPage.clickLoginButton();
    });

    await test.step('2. Verify error banner and no redirect', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, 'Epic sadface: Username and password do not match any user in this service', 'Error message should match');
      Validation.verifyNotContains(page.url(), '/inventory.html', 'Should not redirect');
    });
  });

  test('TC-LOGIN-08 — Dismiss Error Banner', async ({ page, loginPage }) => {
    await test.step('1. Perform a failed login to make the error banner appear', async () => {
      await loginPage.clickLoginButton();
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, 'Epic sadface: Username is required', 'Banner must be visible initially');
    });

    await test.step('2. Click the close button on the error banner', async () => {
      await loginPage.dismissError();
    });

    await test.step('3. Verify error banner disappears', async () => {
      // Element should no longer be visible or throwing an error if we try to wait for it.
      // Wait for it to be hidden:
      await page.waitForSelector('[data-test="error"]', { state: 'hidden' });
    });
  });

  test('TC-LOGIN-09 — Login with Performance Glitch User', async ({ page, loginPage }) => {
    await test.step('1. Enter performance glitch user credentials', async () => {
      await loginPage.enterUserName('performance_glitch_user');
      await loginPage.enterPassword('secret_sauce');
      await loginPage.clickLoginButton();
    });

    await test.step('2. Verify successful redirect (may take longer)', async () => {
      // Timeout is generally 30s so the 5s glitch is covered safely.
      await page.waitForURL('**/inventory.html');
      Validation.verifyContains(page.url(), '/inventory.html', 'Should redirect to products page');
    });
  });

  test('TC-LOGIN-11 — Access Protected Page Without Login (Session Guard)', async ({ page, loginPage }) => {
    await test.step('1. Directly navigate to inventory page without session', async () => {
      await page.goto('/inventory.html');
    });

    await test.step('2. Verify redirected back to login page and error is shown', async () => {
      // Notice we are back on login page (base url).
      Validation.verifyEqual(page.url(), 'https://www.saucedemo.com/', 'Should bounce to login page');

      // Playwright `page.locator` can be used directly for simple check if we don't have loginPage injected
      const errorMsg = await loginPage.getErrorMessage();
      Validation.verifyEqual(errorMsg, "Epic sadface: You can only access '/inventory.html' when you are logged in.", 'Error message must explain the session guard');
    });
  });
});

test.describe('Login Tests - Session scenarios', () => {

  // We DO NOT override autoLogin here, so it automatically logs us in as standard_user before each test!

  test('TC-LOGIN-10 — Successful Logout', async ({ page, productPage }) => {
    await test.step('1. Verify we are on the inventory page', async () => {
      Validation.verifyContains(page.url(), '/inventory.html', 'Should be on products page');
    });

    await test.step('2. Open sidebar menu and click Logout', async () => {
      await page.getByRole('button', { name: 'Open Menu' }).click();
      await page.click('#logout_sidebar_link');
    });

    await test.step('3. Verify redirected to login page', async () => {
      await page.waitForURL('https://www.saucedemo.com/');
      Validation.verifyEqual(page.url(), 'https://www.saucedemo.com/', 'Should be returned to login page');
    });

    await test.step('4. Verify session is cleared (Session Guard)', async () => {
      // Try to go back to inventory page
      await page.goto('https://www.saucedemo.com/inventory.html');
      // Should bounce back
      Validation.verifyEqual(page.url(), 'https://www.saucedemo.com/', 'Should bounce back to login page after logout');
    });
  });
});
