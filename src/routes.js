const express = require('express');
const PostController = require('./controllers/PostController');
const routes = new express.Router();

/** 
routes.get('', (req, res) => {
    return res.send('Hello Semana Omnistack');
});
*/

routes.post('/posts', PostController.store);

//POST http://localhost:3333/posts

module.exports = routes;