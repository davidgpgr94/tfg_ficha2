'use strict'

var facade = require('../persistence/facade');
var HttpStatus = require('http-status');


var Request = require('express').request;
var Response = require('express').response;

/**
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
async function getEmployees(req, res) {

    if (!req.employee.is_admin) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Función solo disponible para administradores" });
    }

    let employees;
    try {
        employees = await facade.getEmployees();
        return res.status(HttpStatus.OK).send(employees);
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return res.status(e.code).send({ message: e.message });
    }
}

module.exports = {
    getEmployees
}