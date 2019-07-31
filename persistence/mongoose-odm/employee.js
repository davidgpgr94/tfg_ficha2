'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = Schema({
    name: {
        type: String,
        lowercase: true
    },
    surname: {
        type: String,
        lowercase: true
    },
    login: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    is_admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Employee', EmployeeSchema);