/* Post do feed: autor, local, descrição, hashtags, imagem e curtidas */
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  place: String,
  description: String,
  hashtags: String,
  image: { type: String, required: true },
  likes: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", PostSchema);
/* Fim de Post.js */
