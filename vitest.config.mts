import { defineConfig } from "vitest/config";

export default defineConfig({
  // Lets tests use the same "@/..." imports as the app.
  resolve: { tsconfigPaths: true },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // So CI still passes after you delete the example and before you write
    // your first test.
    passWithNoTests: true,
  },
});
