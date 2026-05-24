import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Atap Kreatif Manajemen landing page.
 *
 * - Two projects per task 10.2: a desktop Chromium project and a mobile Pixel 5 project.
 * - The web server boots the production build via `npm run start` on port 3000;
 *   when running outside CI an already-running server is reused so iteration is fast.
 * - Test sources live under `tests/e2e/` so they do not collide with the Vitest
 *   unit/property tests under `tests/` configured in task 10.1.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
