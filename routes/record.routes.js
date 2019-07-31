'use strict'

var express = require('express');
var RecordController = require('../controllers/record.controller');

var api = express.Router();

var auth = require('../middlewares/auth.middleware').ensureAuth;

api.post('/records', auth, RecordController.newRecord);
api.post('/manual_exit', auth, RecordController.manualExit);
api.post('/quick_entry', auth, RecordController.quickEntry);
api.post('/quick_exit', auth, RecordController.quickExit);

module.exports = api;