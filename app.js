'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var BASE_API = process.env.BASE_API;
var API_VERSION = process.env.API_VERSION;
var BASE_URL = process.env.BASE_URL;

// cargamos las rutas

// middlewares comunes
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configuracion de las cabeceras
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// rutas base

module.exports = app;