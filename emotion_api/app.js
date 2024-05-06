const express = require('express');
const morgan = require('morgan');
const router = require('./routes/apiroutes');
const session = require('express-session');


const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'alongandrandomstring123/*/*/*',
    resave: false,
    saveUninitialized: false
}));

app.use('/', router);

module.exports = app;