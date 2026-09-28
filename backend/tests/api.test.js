/* Testes da API (repositório em memória, imagens reais processadas pelo sharp) */
const { test, describe, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const request = require("supertest");
const sharp = require("sharp");
const { createApp } = require("../src/app");
const { createMemoryRepo } = require("../src/repositories/memory");
const { loadConfig } = require("../src/config");
const { normalizeHashtags } = require("../src/lib/validation");

const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), "alo-uai-"));
const events = [];
const app = createApp({ repo: createMemoryRepo(), config: { ...loadConfig({ PUBLIC_URL: "http://api.test" }), uploadDir }, emit: (...e) => events.push(e) });
after(() => fs.rmSync(uploadDir, { recursive: true, force: true }));

/* PNG real de 1200x800 para testar o redimensionamento */
const bigPng = () => sharp({ create: { width: 1200, height: 800, channels: 3, background: "#7159c1" } }).png().toBuffer();
/* Publica um post */
async function publish(fields = {}, file) {
  const req = request(app).post("/posts");
  for (const [k, val] of Object.entries({ author: "Douglas", place: "Rio de Janeiro", description: "Semana Omnistack", hashtags: "#react node, #react", ...fields })) req.field(k, val);
  return req.attach("image", file || (await bigPng()), { filename: "../../foto.png", contentType: "image/png" });
}

test("hashtags normalizadas sem repetição", () => {
  assert.equal(normalizeHashtags("#react node, #React ##js <b>"), "#react #node #js #b");
});

describe("posts", () => {
  test("publica, redimensiona para 500 px em JPEG com nome aleatório e avisa o feed", async () => {
    events.length = 0;
    const r = await publish();
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.hashtags, "#react #node");
    assert.match(r.body.image_url, /^http:\/\/api\.test\/files\/\d+-[0-9a-f]{8}\.jpg$/);
    const file = path.join(uploadDir, path.basename(r.body.image_url));
    const meta = await sharp(file).metadata();
    assert.equal(meta.format, "jpeg");
    assert.equal(meta.width, 500);
    assert.equal(events[0][0], "post");
    const served = await request(app).get(`/files/${path.basename(file)}`);
    assert.equal(served.status, 200);
  });

  test("recusa arquivo que não é imagem (mesmo com content-type falso) e post sem autor", async () => {
    const fake = await publish({}, Buffer.from("<script>alert(1)</script>"));
    assert.equal(fake.status, 400);
    assert.match(fake.body.errors[0], /Envie uma imagem/);
    const semAutor = await publish({ author: "  " });
    assert.deepEqual(semAutor.body.errors, ["Informe o autor."]);
    const semImagem = await request(app).post("/posts").field("author", "X");
    assert.deepEqual(semImagem.body.errors, ["Escolha uma imagem."]);
  });

  test("feed em ordem do mais recente (antes o sort usava o campo inexistente createAt)", async () => {
    await publish({ author: "Segundo" });
    const r = await request(app).get("/posts");
    assert.equal(r.body[0].author, "Segundo");
    const older = await request(app).get("/posts").query({ before: r.body[0].createdAt, limit: 1 });
    assert.equal(older.body.length, 1);
    assert.equal(older.body[0].author, "Douglas");
  });

  test("curtida incrementa, avisa o feed; post inexistente responde 404 (antes derrubava)", async () => {
    const { body } = await request(app).get("/posts");
    events.length = 0;
    const r = await request(app).post(`/posts/${body[0]._id}/like`);
    assert.equal(r.body.likes, 1);
    assert.equal(events[0][0], "like");
    assert.equal((await request(app).post("/posts/nao-existe/like")).status, 404);
  });
});
/* Fim de api.test.js */
