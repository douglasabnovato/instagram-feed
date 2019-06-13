const Post = require('../models/Post');

module.exports = {
    async index(req, res){

    },

    async store(req, res){
        console.log(req.file);
        return res.json({ ok: true });
    }
};