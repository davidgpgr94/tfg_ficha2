'use strict'

var facade = require('../persistence/facade');
var HttpStatus = require('http-status');


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

module.exports = {
    newRecord,
    quickEntry,
    quickExit,
    manualExit
}