import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 0 : 0,

  // Number of workers
  workers: process.env.CI ? 1 : undefined,

  // Global test timeout
  timeout: 30_000,

  // Expect timeout
  expect: {
    timeout: 5_000,
  },

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Shared settings for all tests
  use: {
    // Base URL for navigation
    baseURL: 'https://www.saucedemo.com',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Browser viewport
    viewport: { width: 1280, height: 720 },

    // Headless by default
    headless: process.env.CI ? true : false,

    // Suppress Chrome popups (save password, breach warnings, etc.)
    launchOptions: {
      args: [
        '--disable-save-password-bubble',        // No "Save password?" popup
        '--disable-features=PasswordLeakDetection,AutofillServerCommunication', // No breach warnings
        '--password-store=basic',                // Disable OS keychain integration
        '--no-default-browser-check',            // No "Set as default browser" prompts
        '--disable-notifications',               // No browser notification prompts
        '--disable-popup-blocking',              // Prevent popup blockers from interfering
      ],
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
