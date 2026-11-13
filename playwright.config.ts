import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  use: {
    viewport: { width: 1280, height: 800 },
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "pnpm --filter website-1-vanilla preview --port 6601",
      port: 6601,
      reuseExistingServer: false,
    },
    {
      command: "pnpm --filter website-2-react preview --port 6602",
      port: 6602,
      reuseExistingServer: false,
    },
    {
      command: "pnpm --filter nano66-docs preview --port 6603",
      port: 6603,
      reuseExistingServer: false,
    },
  ],
});
