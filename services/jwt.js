'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret_key = process.env.AUTH_SECRET_KEY;

exports.createEmployeeToken = function(employee) {
    var payload = {
        _id: employee._id,
        name: employee.name,
        surname: employee.surname,
        login: employee.login,
        is_admin: employee.is_admin,
        iat: moment().unix(),
        exp: moment().add(process.env.TOKEN_EXP, 'days').unix()
    };

    return jwt.encode(payload, secret_key);
}