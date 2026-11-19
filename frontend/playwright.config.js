/* Teste de ponta a ponta no navegador: sobe a API de demonstração (em memória) e o web do Vite */
import { defineConfig, devices } from "@playwright/test";

/* Portas por variável, para rodar com 3333 ou 5173 ocupadas (ex.: E2E_API_PORT=4140 E2E_WEB_PORT=4141) */
const apiPort = Number(process.env.E2E_API_PORT) || 3333;
const webPort = Number(process.env.E2E_WEB_PORT) || 5173;
const apiUrl = `http://localhost:${apiPort}`;
const webUrl = `http://localhost:${webPort}`;

export default defineConfig({
  testDir: "e2e",
  testMatch: /.*\.e2e\.js$/,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: webUrl, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run demo --prefix ../backend",
      url: `${apiUrl}/health`,
      env: { PORT: String(apiPort), CORS_ORIGINS: webUrl, PUBLIC_URL: apiUrl },
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: `npm run dev -- --port ${webPort} --strictPort`,
      url: webUrl,
      env: { VITE_API_URL: apiUrl },
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
/* Fim de playwright.config.js */
