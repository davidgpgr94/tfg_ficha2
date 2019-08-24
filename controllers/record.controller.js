'use strict'

var facade = require('../persistence/facade');
var HttpStatus = require('http-status');

var Request = require('express').request;
var Response = require('express').response;


async function newRecord(req, res) {
    let params = req.body;
    if (!params.entry || params.entry == null) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Faltan datos del registro' });
    }

    let record;
    try {
        let registry = {};

        registry.entry = new Date(params.entry);
        if (registry.entry >= new Date(Date.now())) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No está permitido hacer un registro de una entrada por adelantado'})
        }
        if(params.exit && params.exit !== null) {
            registry.exit = new Date(params.exit);
            if (registry.exit >= new Date(Date.now()) ) {
                return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No está permitido hacer un registro de una salida por adelantado'})
            }
        }
        if (!registry.exit && registry.entry < new Date(Date.now()).setHours(0,0,0,0) ) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Hace falta especificar la hora de salida también' })
        }


        record = await facade.newRecord(req.employee._id, registry);
        res.status(HttpStatus.CREATED).send( record );
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        res.status(e.code).send({ message: e.message });
    }
}

async function manualExit(req, res) {
    let params = req.body;
    if (!params.exit || params.exit == null) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Faltan datos para el registro de salida' });
    }

    let record;
    try {
        let exit = new Date(params.exit);
        if (exit >= new Date(Date.now())) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message: 'No está permitido hacer un registro de salida por adelantado' });
        }

        record = await facade.manualExit(req.employee._id, exit);
        res.status(HttpStatus.CREATED).send( record );
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        res.status(e.code).send({ message: e.message });
    }
}

async function quickEntry(req, res) {
    let record;
    try {
        record = await facade.quickEntry(req.employee._id);
        res.status(HttpStatus.OK).send( record );
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        res.status(e.code).send({ message: e.message });
    }
}

async function quickExit(req, res) {
    let record;
    try {
        record = await facade.quickExit(req.employee._id);
        res.status(HttpStatus.OK).send( record );
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        res.status(e.code).send({ message: e.message });
    }
}

/**
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
async function getRecords(req, res) {
    let context;
    let employee_id;
    if (req.query && req.query.employee) {
        if (req.employee.is_admin) {
            employee_id = req.query.employee;
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: "Función solo disponible para administradores" });
        }
    } else {
        employee_id = req.employee._id;
    }

    let query = {};
    if (req.query && req.query.from) {
        query.from = new Date(req.query.from);
    }
    if (req.query && req.query.to) {
        query.to = new Date(req.query.to);
    }

    if (query.from && query.to && (query.to < query.from) ) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: 'El intervalo de búsqueda es erróneo' });
    }
    
    try {
        context = await facade.getRecords(employee_id, query, req.query.page);
        res.status(HttpStatus.OK).send(context);
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        res.status(e.code).send({ message: e.message });
    }
}

/**
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
async function getIncompletedRecord(req, res) {
    let employee_id = req.employee._id;
    let record;
    try {
        record = await facade.getIncompletedRecord(employee_id);
        if (record == null) {
            return res.status(HttpStatus.NO_CONTENT).end();    
        } else {
            return res.status(HttpStatus.OK).send(record);
        }
    } catch (e) {
        if (!e.code) {
            e.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        res.status(e.code).send({ message: e.message });
    }
}

module.exports = {
    newRecord,
    quickEntry,
    quickExit,
    manualExit,
    getRecords,
    getIncompletedRecord
}