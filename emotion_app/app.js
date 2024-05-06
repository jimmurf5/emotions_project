const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const myrouter = require('./routes/myroutes');
const path = require('path');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

// Use body-parser middleware at the application level
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
    secret: 'alongandrandomstring123/*/*/*',
    resave: false,
    saveUninitialized: false
}));
app.use(morgan('tiny'));
app.use('/', myrouter);


module.exports = app;