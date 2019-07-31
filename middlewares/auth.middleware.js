'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var HttpStatus = require('http-status');

var secret_key = process.env.AUTH_SECRET_KEY;

var Request = require('express').request;
var Response = require('express').response;

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.ensureAuth = function(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(HttpStatus.FORBIDDEN).send({ message: 'La petición no tiene la cabecera de autenticación' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret_key);

        if (payload.exp <= moment().unix()) {
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'El token ha expirado' });
        }
    } catch (e) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Token no válido' });
    }

    req.employee = payload;
    next();
}