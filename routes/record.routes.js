'use strict'

var express = require('express');
var RecordController = require('../controllers/record.controller');

var api = express.Router();

api.post('/records', RecordController.newRecord);
api.post('/manual_exit', RecordController.manualExit);
api.post('/quick_entry', RecordController.quickEntry);
api.post('/quick_exit', RecordController.quickExit);

module.exports = api;