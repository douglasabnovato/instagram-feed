const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://omnistack7:omnistack7@cluster0-fygh8.mongodb.net/test?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
});

app.get('/', (req, res) => {
    return res.send(`Hello ${req.query.name}.`);
});

app.listen(3333);