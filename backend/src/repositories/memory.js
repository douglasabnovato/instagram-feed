/* Repositório em memória com o mesmo contrato (testes e demonstração local) */
const { randomUUID } = require("node:crypto");

function createMemoryRepo() {
  const posts = [];
  let clock = Date.now();
  return {
    async list({ before, limit }) {
      return posts.filter((p) => !before || p.createdAt < new Date(before).toISOString()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
    },
    async create(data) {
      clock += 1;
      const p = { _id: randomUUID().replace(/-/g, "").slice(0, 24), likes: 0, ...data, createdAt: new Date(clock).toISOString() };
      posts.push(p);
      return { ...p };
    },
    async like(id) {
      const p = posts.find((x) => x._id === id);
      if (!p) return null;
      p.likes += 1;
      return { ...p };
    },
  };
}

module.exports = { createMemoryRepo };
/* Fim de memory.js */
