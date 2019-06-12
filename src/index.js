const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://omnistack7:omnistack7@cluster0-oikjh.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
});

app.use(require('./routes'));

app.listen(3333);