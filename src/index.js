const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://omnistack7:omnistack7@cluster0-oikjh.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
});

app.get('/', (req, res) => {
    return res.send('Hello Omnistack.');
});

app.listen(3333);