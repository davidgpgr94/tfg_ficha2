'use strict'

var mongoose = require('mongoose');
var colors = require('./utils/chalk_colors');

var connected = colors.connected;
var error = colors.error;
var disconnected = colors.disconnected;

module.exports = function() {
    mongoose.Promise = global.Promise;
    mongoose.connect(`${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    
    mongoose.connection.on('connected', () => {
        console.log(connected('Conexión a la base de datos ha sido establecida correctamente'));
    });

    mongoose.connection.on('error', (err) => {
        console.log(error('Error en la conexion a la base de datos > ' + err));
        process.exit(0);
    });

    mongoose.connection.on('disconnected', () => {
        console.log(disconnected('La base de datos no está conectada!!'));
    });
}