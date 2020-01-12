'use strict'

var express = require('express');
var LoginController = require('../controllers/login.controller');

var api = express.Router();

var auth = require('../middlewares/auth.middleware').ensureAuth;

api.post('/login', LoginController.login);
api.post('/register', LoginController.register);
api.put('/change_password', auth, LoginController.changePassword);

module.exports = api;