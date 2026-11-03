/* Testes do alô, uai (web): feed com estados, curtida, publicação, marca e formatação dos posts */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { upsert, appendPage, PAGE_SIZE } from "../pages/Feed";
import { corDoAvatar, iniciais, separarHashtags, tempoRelativo } from "../lib/format";

vi.mock("socket.io-client", () => ({ io: () => ({ on: vi.fn(), disconnect: vi.fn() }) }));

let routes;
beforeEach(() => {
  cleanup();
  routes = {};
  globalThis.fetch = vi.fn(async (url, opts = {}) => {
    const [status, body] = routes[`${opts.method || "GET"} ${new URL(url).pathname}`] || [404, { errors: ["Rota não encontrada."] }];
    return { ok: status < 400, status, json: async () => body };
  });
});
const renderAt = (path) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
const POST = { _id: "p1", author: "Douglas", place: "Juiz de Fora", description: "Pão de queijo", hashtags: "#react, #minas", likes: 1, image_url: "http://x/a.jpg", createdAt: new Date().toISOString() };

describe("feed", () => {
  it("upsert substitui post existente e insere novo no topo", () => {
    expect(upsert([POST], { ...POST, likes: 2 })[0].likes).toBe(2);
    expect(upsert([POST], { ...POST, _id: "p2" }).map((p) => p._id)).toEqual(["p2", "p1"]);
  });

  it("mostra posts com texto alternativo e curte", async () => {
    routes["GET /posts"] = [200, [POST]];
    routes["POST /posts/p1/like"] = [200, { ...POST, likes: 2 }];
    renderAt("/");
    expect(await screen.findByAltText("Foto de Douglas: Pão de queijo")).toBeTruthy();
    expect(screen.getByText("1 curtida")).toBeTruthy();
    expect(screen.getByText("DO")).toBeTruthy();
    expect(screen.getByText("Juiz de Fora · agora")).toBeTruthy();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["#react", "#minas"]);
    await userEvent.click(screen.getByRole("button", { name: "Curtir a foto de Douglas" }));
    expect(await screen.findByText("2 curtidas")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Curtir a foto de Douglas" }).className).toContain("liked");
  });

  it("feed vazio e erro de conexão têm mensagem", async () => {
    routes["GET /posts"] = [200, []];
    renderAt("/");
    expect(await screen.findByText(/Tá quietim por aqui/)).toBeTruthy();
    cleanup();
    globalThis.fetch = vi.fn(async () => { throw new TypeError("offline"); });
    renderAt("/");
    expect((await screen.findByRole("alert")).textContent).toMatch(/Sem conexão/);
  });
});

describe("falhas e paginação do feed", () => {
  it("erro 500 mostra a mensagem do servidor e \"Tentar novamente\" recarrega", async () => {
    routes["GET /posts"] = [500, { errors: ["Banco fora do ar."] }];
    renderAt("/");
    expect((await screen.findByRole("alert")).textContent).toMatch(/Banco fora do ar/);
    routes["GET /posts"] = [200, [POST]];
    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByAltText("Foto de Douglas: Pão de queijo")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("curtida que falha desfaz o coração e avisa", async () => {
    routes["GET /posts"] = [200, [POST]];
    routes["POST /posts/p1/like"] = [429, { errors: ["Muitas curtidas seguidas. Aguarde um pouco."] }];
    renderAt("/");
    const botao = await screen.findByRole("button", { name: "Curtir a foto de Douglas" });
    await userEvent.click(botao);
    expect((await screen.findByRole("alert")).textContent).toMatch(/A curtida não foi registrada\. Muitas curtidas/);
    expect(screen.getByRole("button", { name: "Curtir a foto de Douglas" }).className).not.toContain("liked");
    expect(screen.getByText("1 curtida")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Tentar novamente" })).toBeNull();
  });

  it("appendPage junta sem repetir", () => {
    expect(appendPage([POST], [POST, { ...POST, _id: "p2" }]).map((p) => p._id)).toEqual(["p1", "p2"]);
  });

  it("\"Carregar mais\" pede posts anteriores ao último e some no fim", async () => {
    const base = Date.parse("2026-11-01T12:00:00Z");
    const pagina = Array.from({ length: PAGE_SIZE }, (_, i) => ({ ...POST, _id: `a${i}`, author: `Pessoa ${i}`, createdAt: new Date(base - i * 60_000).toISOString() }));
    const antigos = [{ ...POST, _id: "velho", author: "Antiga", createdAt: new Date(base - 999 * 60_000).toISOString() }];
    routes["GET /posts"] = [200, pagina];
    renderAt("/");
    const mais = await screen.findByRole("button", { name: "Carregar mais fotos" });
    routes["GET /posts"] = [200, antigos];
    await userEvent.click(mais);
    expect(await screen.findByAltText("Foto de Antiga: Pão de queijo")).toBeTruthy();
    const url = new URL(fetch.mock.calls.at(-1)[0]);
    expect(url.searchParams.get("before")).toBe(pagina.at(-1).createdAt);
    expect(screen.getAllByRole("article")).toHaveLength(PAGE_SIZE + 1);
    expect(screen.queryByRole("button", { name: "Carregar mais fotos" })).toBeNull();
    expect(screen.getByText(`${PAGE_SIZE + 1} fotos no feed`)).toBeTruthy();
  });

  it("feed curto não mostra \"Carregar mais\"", async () => {
    routes["GET /posts"] = [200, [POST]];
    renderAt("/");
    await screen.findByAltText("Foto de Douglas: Pão de queijo");
    expect(screen.queryByRole("button", { name: "Carregar mais fotos" })).toBeNull();
  });
});

describe("nova publicação", () => {
  it("exige imagem e autor antes de enviar", async () => {
    renderAt("/new");
    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));
    expect(screen.getByRole("alert").textContent).toBe("Escolha uma imagem.");
    await userEvent.upload(screen.getByLabelText(/Imagem/), new File(["x"], "a.png", { type: "image/png" }));
    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));
    expect(screen.getByRole("alert").textContent).toBe("Informe seu nome.");
    expect(fetch).not.toHaveBeenCalled();
  });
});
describe("marca e formatação", () => {
  it("mostra a marca alô, uai, o botão de publicar e o aviso de demonstração", () => {
    routes["GET /posts"] = [200, []];
    renderAt("/");
    expect(screen.getByRole("link", { name: "alô, uai — ir para o feed" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Publicar" }).getAttribute("href")).toBe("/new");
    expect(screen.getByText(/não envie fotos de pessoas/)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/instagram/i);
  });

  it("iniciais, cor estável, tempo relativo e hashtags", () => {
    expect(iniciais("maria das dores")).toBe("MD");
    expect(iniciais("zé")).toBe("ZÉ");
    expect(iniciais("  ")).toBe("?");
    expect(corDoAvatar("Douglas")).toBe(corDoAvatar("Douglas"));
    const agora = Date.parse("2026-09-27T12:00:00Z");
    expect(tempoRelativo("2026-09-27T11:59:30Z", agora)).toBe("agora");
    expect(tempoRelativo("2026-09-27T11:55:00Z", agora)).toBe("há 5 minutos");
    expect(tempoRelativo("2026-09-26T12:00:00Z", agora)).toBe("ontem");
    expect(tempoRelativo("não é data", agora)).toBe("");
    expect(separarHashtags("#a, b;#a  ##c")).toEqual(["#a", "#b", "#c"]);
  });
});
/* Fim de app.test.jsx */
