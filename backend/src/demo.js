/* Demonstração local e teste de ponta a ponta: a mesma API, com repositório em memória e sem banco */
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { Server } = require("socket.io");
const { loadConfig } = require("./config");
const { createApp } = require("./app");
const { createMemoryRepo } = require("./repositories/memory");

/* Imagens numa pasta temporária, para não sujar uploads/ */
const config = loadConfig({ ...process.env, NODE_ENV: "development", UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(os.tmpdir(), "alo-uai-demo") });
let io;
const app = createApp({ repo: createMemoryRepo(), config, emit: (event, data) => io.emit(event, data) });
const server = http.createServer(app);
io = new Server(server, { cors: { origin: config.corsOrigins } });
server.listen(config.port, () => console.log(`API de demonstração (memória) em http://localhost:${config.port}`));
/* Fim de demo.js */
