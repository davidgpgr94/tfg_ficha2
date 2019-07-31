'use strict'

var express = require('express');
var LoginController = require('../controllers/login.controller');

var api = express.Router();

api.post('/login', LoginController.login);
api.post('/register', LoginController.register);

module.exports = api;