/* Ponto de entrada: conecta no MongoDB, sobe HTTP + Socket.IO e encerra com elegância */
const http = require("node:http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { loadConfig } = require("./config");
const { createApp } = require("./app");
const { createMongoRepo } = require("./repositories/mongo");

/* Inicializa dependências e servidor */
async function main() {
  const config = loadConfig();
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  let io;
  const app = createApp({ repo: createMongoRepo(), config, emit: (event, data) => io.emit(event, data) });
  const server = http.createServer(app);
  io = new Server(server, { cors: { origin: config.corsOrigins } });
  server.listen(config.port, () => console.log(`API em http://localhost:${config.port}`));
  const stop = () => server.close(() => mongoose.disconnect().finally(() => process.exit(0)));
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

main().catch((err) => {
  console.error("Falha ao iniciar:", err.message);
  process.exit(1);
});
/* Fim de server.js */
