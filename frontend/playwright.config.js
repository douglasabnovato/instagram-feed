/* Teste de ponta a ponta no navegador: sobe a API de demonstração (em memória) e o web do Vite */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  testMatch: /.*\.e2e\.js$/,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:5173", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    { command: "npm run demo --prefix ../backend", url: "http://localhost:3333/health", reuseExistingServer: !process.env.CI, timeout: 60_000 },
    { command: "npm run dev -- --port 5173 --strictPort", url: "http://localhost:5173", reuseExistingServer: !process.env.CI, timeout: 60_000 },
  ],
});
/* Fim de playwright.config.js */
