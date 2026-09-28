/* Processamento de imagem: valida o tipo pelo conteúdo, corrige a rotação e grava JPEG de até 500 px com nome aleatório */
const sharp = require("sharp");
const path = require("node:path");
const fs = require("node:fs");
const { randomUUID } = require("node:crypto");

const MAX_BYTES = 5 * 1024 * 1024;
const FORMATS = new Set(["jpeg", "png", "webp", "heif", "gif"]);

/* Converte o buffer enviado e devolve o nome do arquivo gravado; lança erro 400 se não for imagem */
async function saveImage(buffer, dir) {
  let meta;
  try { meta = await sharp(buffer).metadata(); } catch { meta = null; }
  if (!meta || !FORMATS.has(meta.format)) {
    const err = new Error("Envie uma imagem JPEG, PNG, WebP, HEIC ou GIF.");
    err.status = 400;
    throw err;
  }
  fs.mkdirSync(dir, { recursive: true });
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.jpg`;
  await sharp(buffer).rotate().resize({ width: 500, withoutEnlargement: true }).jpeg({ quality: 70, mozjpeg: true }).toFile(path.join(dir, name));
  return name;
}

module.exports = { saveImage, MAX_BYTES };
/* Fim de images.js */
