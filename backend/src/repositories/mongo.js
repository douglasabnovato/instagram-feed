/* Repositório de posts sobre Mongoose (curtida atômica com $inc) */
const Post = require("../models/Post");

/* Documento → objeto simples */
const plain = (d) => d && { ...d, _id: String(d._id), __v: undefined };

function createMongoRepo() {
  return {
    async list({ before, limit }) {
      const q = before ? { createdAt: { $lt: new Date(before) } } : {};
      return (await Post.find(q).sort({ createdAt: -1 }).limit(limit).lean()).map(plain);
    },
    async create(data) { return plain((await Post.create(data)).toObject()); },
    async like(id) { return plain(await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).lean().catch(() => null)); },
  };
}

module.exports = { createMongoRepo };
/* Fim de mongo.js */
