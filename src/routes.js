const express = require('express');
const PostController = require('./controllers/PostController');
const multer = require('multer');

const routes = new express.Router();
const upload = multer();

routes.post('/posts', upload.single('image'), PostController.store);

module.exports = routes;