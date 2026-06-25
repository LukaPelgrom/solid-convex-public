import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/backend/convex/**/*.test.ts"],
    environment: "edge-runtime",
  },
});
