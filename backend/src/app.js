/* API Express 5 do alô, uai: feed paginado, publicação com imagem otimizada e curtidas em tempo real */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const v = require("./lib/validation");
const { saveImage, MAX_BYTES } = require("./images");

/* Monta a API com repositório, emissor de eventos e configuração injetados */
function createApp({ repo, config, emit = () => undefined }) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: config.corsOrigins }));
  app.use("/files", express.static(config.uploadDir, { maxAge: "30d", immutable: true, fallthrough: false }));

  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES, files: 1, fields: 10 } }).single("image");
  const postLimit = rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false, message: { errors: ["Muitas publicações. Aguarde alguns minutos."] } });
  const likeLimit = rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: "draft-7", legacyHeaders: false, message: { errors: ["Muitas curtidas seguidas. Aguarde um pouco."] } });

  /* Post no formato público, com URL absoluta da imagem */
  const out = (p) => ({ _id: p._id, author: p.author, place: p.place, description: p.description, hashtags: p.hashtags, likes: p.likes, createdAt: p.createdAt, image_url: `${config.publicUrl}/files/${p.image}` });

  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.get("/posts", async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
    const before = req.query.before && !Number.isNaN(Date.parse(req.query.before)) ? req.query.before : undefined;
    res.json((await repo.list({ before, limit })).map(out));
  });

  app.post("/posts", postLimit, (req, res, next) => upload(req, res, (err) => {
    if (!err) return next();
    const msg = err.code === "LIMIT_FILE_SIZE" ? "A imagem deve ter no máximo 5 MB." : "Falha no envio da imagem.";
    return res.status(400).json({ errors: [msg] });
  }), async (req, res) => {
    const r = v.post.safeParse(req.body || {});
    const errors = r.success ? [] : v.messages(r.error);
    if (!req.file) errors.unshift("Escolha uma imagem.");
    if (errors.length) return res.status(400).json({ errors });
    let image;
    try {
      image = await saveImage(req.file.buffer, config.uploadDir);
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ errors: [err.message] });
      throw err;
    }
    const post = out(await repo.create({ ...r.data, image }));
    emit("post", post);
    res.status(201).json(post);
  });

  app.post("/posts/:id/like", likeLimit, async (req, res) => {
    const post = await repo.like(req.params.id);
    if (!post) return res.status(404).json({ errors: ["Post não encontrado."] });
    emit("like", out(post));
    res.json(out(post));
  });

  app.use((req, res) => res.status(404).json({ errors: ["Rota não encontrada."] }));

  /* Erro inesperado: registra e responde sem detalhes internos */
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err.status === 404 || err.statusCode === 404) return res.status(404).json({ errors: ["Arquivo não encontrado."] });
    console.error(err);
    return res.status(500).json({ errors: ["Erro interno. Tente novamente."] });
  });

  return app;
}

module.exports = { createApp };
/* Fim de app.js */
