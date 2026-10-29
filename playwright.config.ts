import { defineConfig, devices } from '@playwright/test';

// Dedicated ports so the browser test can run while `pnpm dev` is using 3000/5173.
const API_PORT = 3100;
const WEB_PORT = 5180;

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm --filter @pawprint/api build && pnpm --filter @pawprint/api start',
      env: { PORT: String(API_PORT) },
      url: `http://localhost:${API_PORT}/api/health`,
      timeout: 60_000,
    },
    {
      command: 'pnpm --filter @pawprint/web dev',
      env: { WEB_PORT: String(WEB_PORT), API_URL: `http://localhost:${API_PORT}` },
      url: `http://localhost:${WEB_PORT}`,
      timeout: 60_000,
    },
  ],
});
