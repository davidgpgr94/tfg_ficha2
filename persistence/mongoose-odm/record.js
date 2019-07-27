'use strict'

var HttpStatus = require('http-status');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordSchema = Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    entry: {
        type: Date,
        required: true
    },
    exit: {
        type: Date,
        default: null
    },
    signed_by_employee: {
        type: Boolean,
        default: false
    },
    signed_by_admin: {
        type: Boolean,
        default: false
    }
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

// La entrada no puede ser una hora/fecha futura
RecordSchema.pre('save', function(next) {
    if (this.entry > Date.now()) {
        throw new Error('La entrada no puede ser posterior a la hora y fecha actual');
    }
    next();
});

// La salida no puede ser anterior a la entrada
RecordSchema.pre('save', function(next) {
    if (this.exit !== null) {
        if (this.exit < this.entry) {
            throw new Error('La salida no puede ser anterior a la entrada');
        }
    }
    next();
});

// No puede haber solapamientos entre registros
RecordSchema.pre('save', async function(next) {
    // La entrada esta dentro del intervalo de algun registro
    // E = Entrada de un registro ya existente
    // S = Salida del registro ya existente
    // NE o NS = Entrada o salida del nuevo registro
    // ----E---NE----S-------
    // ----E---NE---NS----S--
    var solapados = await RecordODM.where('employee', this.employee).where('entry').lte(this.entry).where('exit').gte(this.entry).exec();
    if (solapados.length > 0) {
        let error = new Error('La entrada no puede pertenecer a ningún intervalo de algún registro ya creado previamente');
        error.code = HttpStatus.CONFLICT;
        throw error;
    }

    // La salida esta dentro del intervalo de algun registro
    // ----E---NS----S-------
    // ----NE---E---NS----S--
    if (this.exit !== null) {
        solapados = await RecordODM.where('employee', this.employee).where('entry').lte(this.exit).where('exit').gte(this.exit).exec();
        if (solapados.length > 0) {
            let error = new Error('La salida no puede pertenecer a ningún intervalo de algún registro ya creado previamente');
            error.code = HttpStatus.CONFLICT;
            throw error;
        }
    }
    
    // Solapamiento entre intervalos
    // ----NE---E----S---NS--
    if (this.exit !== null) {
        solapados = await RecordODM.where('employee', this.employee)
            .where('entry').gte(this.entry).where('exit').gte(this.entry)
            .where('entry').lte(this.exit).where('exit').lte(this.exit);
        if (solapados.length > 0) {
            let error = new Error('Ningún registro ya existente puede tener su intervalo dentro del intervalo del nuevo registro');
            error.code = HttpStatus.CONFLICT;
            throw error;
        }
    }
    next();
});

// Como maximo puede haber un registro con exit a null por empleado
RecordSchema.pre('save', async function(next) {
    if (this.exit) {
        return next();
    }
    var sinExit = await RecordODM.where('employee', this.employee).where('exit', null).exec();
    if (sinExit.length > 0) {
        let error = new Error('Como mucho puede haber un registro sin completar');
        error.code = HttpStatus.CONFLICT;
        throw error;
    }
    next();
});

var RecordODM = mongoose.model('Record', RecordSchema);

module.exports = RecordODM;