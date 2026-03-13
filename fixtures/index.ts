import { test as base } from '@playwright/test';

// ─── Type definitions ─────────────────────────────────────────────────────────
// Extend this interface as you add more page objects or shared utilities
// to your fixture. For example:
//
//   import { ExamplePage } from '@pages/ExamplePage';
//
//   type MyFixtures = {
//     examplePage: ExamplePage;
//   };

type MyFixtures = Record<string, never>; // placeholder – add your fixture types here

// ─── Extended test object ─────────────────────────────────────────────────────
/**
 * `test` is the extended Playwright test object that carries all custom fixtures.
 *
 * Import THIS `test` (not the one from @playwright/test) in every spec file so
 * that your fixtures are available without further setup.
 *
 * Example usage once you add fixtures:
 *
 *   import { test } from '../fixtures';
 *
 *   test('my test', async ({ examplePage }) => {
 *     await examplePage.open();
 *   });
 */
export const test = base.extend<MyFixtures>({
  // Add fixture definitions here, for example:
  //
  // examplePage: async ({ page }, use) => {
  //   const examplePage = new ExamplePage(page);
  //   await use(examplePage);
  // },
});

export { expect } from '@playwright/test';
