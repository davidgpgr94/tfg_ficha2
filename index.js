'use strict'

require('dotenv').config();
var db = require('./database');
var app = require ('./app');

var colors = require('./utils/chalk_colors');
var listening = colors.listening;

var port = process.env.PORT || 3977;

start();

async function start() {
    db();
    await app.listen(port, function() {
        console.log(listening('API Rest Server is listening in ' + colors.advice(port) + ' port'));
    });
}