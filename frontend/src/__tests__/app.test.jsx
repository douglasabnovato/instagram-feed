/* Testes do alô, uai (web): feed com estados, curtida, publicação, marca e formatação dos posts */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { upsert } from "../pages/Feed";
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
