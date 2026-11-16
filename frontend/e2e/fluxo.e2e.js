/* Fluxo principal na tela: publicar uma foto, vê-la no feed e ver a curtida chegar em outra página sem recarregar */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const FOTO = new URL("./fixtures/foto.png", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const autor = `Teste ${Date.now().toString(36)}`;

/* axe sem violações nas regras WCAG A e AA */
async function semViolacoes(page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
}

test("publica uma foto, vê no feed e a curtida chega na outra página", async ({ page, context }) => {
  await page.goto("/new");
  await expect(page.getByRole("heading", { name: "Nova publicação" })).toBeVisible();
  await semViolacoes(page);

  await page.locator("#image").setInputFiles(FOTO);
  await expect(page.getByAltText("Pré-visualização da imagem escolhida")).toBeVisible();
  await page.getByLabel("Seu nome").fill(autor);
  await page.getByLabel("Onde foi?").fill("Mercado Central, BH");
  await page.getByLabel("Conta o causo").fill("Teste do fluxo");
  await page.getByLabel("Hashtags").fill("#teste");
  await page.getByRole("button", { name: "Publicar" }).click();

  await expect(page).toHaveURL(/\/$/);
  const foto = page.getByAltText(`Foto de ${autor}: Teste do fluxo`);
  await expect(foto).toBeVisible();
  await expect.poll(() => foto.evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
  const post = page.locator("article.post").filter({ has: foto });
  await expect(post).toContainText("0 curtidas");
  await semViolacoes(page);

  const outra = await context.newPage();
  await outra.goto("/");
  const postNaOutra = outra.locator("article.post").filter({ has: outra.getByAltText(`Foto de ${autor}: Teste do fluxo`) });
  await expect(postNaOutra).toContainText("0 curtidas");

  await post.getByRole("button", { name: `Curtir a foto de ${autor}` }).click();
  await expect(post).toContainText("1 curtida");
  await expect(postNaOutra).toContainText("1 curtida");
});

test("o primeiro Tab no feed mostra o foco", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focado = page.locator(":focus");
  await expect(focado).toBeVisible();
  const outline = await focado.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});
