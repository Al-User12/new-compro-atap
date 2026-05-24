import { test, expect } from "@playwright/test";

/**
 * Placeholder smoke test so Playwright's project configuration enumerates.
 * Real E2E and property-based browser tests are added in later tasks
 * (e.g. 11.x property tests and 13.1 axe-core scan).
 */
test("home page responds with 200", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
});
