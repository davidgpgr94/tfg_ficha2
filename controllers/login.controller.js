'use strict'

var facade = require('../persistence/login.facade');
var HttpStatus = require('http-status');
var jwt = require('../services/jwt');

var Request = require('express').request;
var Response = require('express').response;

/**
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
async function login(req, res) {
    let params = req.body;
    
    if (!params.login || params.login == null || !params.password || params.password == null) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Login y password son obligatorios' });
    }

    let login = params.login;
    let password = params.password;

    let employee;
    try {
        employee = await facade.login(login, password);
        if (!employee) {
            return res.status(HttpStatus.NOT_FOUND).send({ message: 'Usuario o contraseña incorrectos' });
        }
        return res.status(HttpStatus.OK).send({ 
            token: jwt.createEmployeeToken(employee), 
            employee: employee 
        });
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return res.status(e.code).send({ message: e.message });
    }
}

/**
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
async function register(req, res) {
    let params = req.body;

    if (!params.name || params.name == null || !params.surname || params.surname == null || !params.login || params.login == null || !params.password || params.password == null || !params.is_admin || params.is_admin == null) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Faltan datos' });
    }

    let employee;
    try {
        employee = await facade.newEmployee(params.name, params.surname, params.login, params.password, params.is_admin);
        return res.status(HttpStatus.CREATED).send( employee );
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return res.status(e.code).send({ message: e.message });
    }
}

module.exports = {
    login,
    register
}