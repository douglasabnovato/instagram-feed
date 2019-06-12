const express = require('express');

const routes = new express.Router();

routes.get('', (req, res) => {
    return res.send('Hello Semana Omnistack');
});

module.exports = routes;