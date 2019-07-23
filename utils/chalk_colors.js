'use strict'

var chalk = require('chalk');

exports.connected = chalk.bold.cyan;
exports.listening = chalk.bold.cyan;
exports.error = chalk.bold.yellow;
exports.advice = chalk.bold.yellow;
exports.disconnected = chalk.bold.red;