/* Validação do post (zod) e normalização de hashtags */
const { z } = require("zod");

/* "#react node, #js" → "#react #node #js" (sem repetição, até 10) */
function normalizeHashtags(input) {
  const seen = new Set();
  const tags = String(input || "").split(/[\s,]+/).map((t) => t.replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "")).filter((t) => {
    const k = t.toLowerCase();
    if (!t || t.length > 30 || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return tags.slice(0, 10).map((t) => `#${t}`).join(" ");
}

const post = z.object({
  author: z.string().trim().min(1, "Informe o autor.").max(40, "Autor com no máximo 40 caracteres."),
  place: z.string().trim().max(60, "Local com no máximo 60 caracteres.").default(""),
  description: z.string().trim().max(500, "Descrição com no máximo 500 caracteres.").default(""),
  hashtags: z.string().default("").transform(normalizeHashtags),
});

/* Mensagens legíveis de um erro do zod */
const messages = (error) => error.issues.map((i) => i.message);

module.exports = { post, normalizeHashtags, messages };
/* Fim de validation.js */
