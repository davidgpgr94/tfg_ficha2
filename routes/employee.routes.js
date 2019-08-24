'use strict'

var express = require('express');
var EmployeeController = require('../controllers/employee.controller');

var api = express.Router();

var auth = require('../middlewares/auth.middleware').ensureAuth;

api.get('/employees', auth, EmployeeController.getEmployees);

module.exports = api;