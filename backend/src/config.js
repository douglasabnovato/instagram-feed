/* Configuração por variáveis de ambiente (12-Factor) */
require("dotenv").config();
const path = require("node:path");

/* Lê e valida a configuração */
function loadConfig(env = process.env) {
  if (env.NODE_ENV === "production" && !env.MONGODB_URI) throw new Error("MONGODB_URI é obrigatório em produção.");
  const port = Number(env.PORT) || 3333;
  return {
    port,
    mongoUri: env.MONGODB_URI || "mongodb://127.0.0.1:27017/alo_uai",
    corsOrigins: (env.CORS_ORIGINS || "http://localhost:5173").split(",").map((s) => s.trim()).filter(Boolean),
    publicUrl: (env.PUBLIC_URL || `http://localhost:${port}`).replace(/\/$/, ""),
    uploadDir: path.resolve(env.UPLOAD_DIR || path.join(__dirname, "..", "uploads", "resized")),
  };
}

module.exports = { loadConfig };
/* Fim de config.js */
