import { defineConfig, devices } from "@playwright/test";

const convexUrl = process.env.VITE_CONVEX_URL ?? "http://127.0.0.1:3210";
const convexSiteUrl =
  process.env.VITE_CONVEX_SITE_URL ?? "http://127.0.0.1:3211";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    trace: "on-first-retry",
  },
  webServer: [
    {
      command:
        "bun run --cwd packages/backend dev -- --tail-logs disable --typecheck disable",
      url: convexUrl,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: `VITE_CONVEX_URL=${convexUrl} PUBLIC_CONVEX_URL=${convexUrl} VITE_CONVEX_SITE_URL=${convexSiteUrl} PUBLIC_CONVEX_SITE_URL=${convexSiteUrl} bun run dev:tanstack`,
      url: "http://localhost:3201",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
