const express = require('express');
const PostController = require('./controllers/PostController');
const multer = require('multer');
const uploadConfig = require('./config/upload'); 

const routes = new express.Router();   
const upload = multer(uploadConfig);

routes.get('/posts', PostController.index);
routes.post('/posts', upload.single('image'), PostController.store);


module.exports = routes;