'use strict'

var Employee = require('./employee.dto');

class Record {

    /**
     * 
     * @param {string} _id The record's id
     * @param {Employee} employee The record's employee
     * @param {Date} entry Entry's datetime
     */
    constructor(_id, employee, entry) {
        this._id = _id;
        this.employee = employee;
        this.entry = entry;
        this.exit = null;
        this.signed_by_employee = false;
        this.signed_by_admin = false;
    }

    /**
     * Specify exit datetime
     * 
     * @param {Date} exit Exit's datetime
     */
    setExit(exit) {
        this.exit = exit;
    }

    /**
     * Specify if the record is signed or not by the employee
     * 
     * @param {boolean} value true if the record is signed, false in otherwise
     */
    setSignedByEmployee(value) {
        this.signed_by_employee = value;
    }

    /**
     * Specify if the record is signed or not by an admin
     * 
     * @param {boolean} value true if the record is signed, false in otherwise
     */
    setSignedByAdmin(value) {
        this.signed_by_admin = value;
    }
}

module.exports = Record;