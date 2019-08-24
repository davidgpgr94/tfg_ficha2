'use strict'

var RepositoryRecord = require('./repositories/record.repository');
var RepositoryEmployee = require('./repositories/employee.repository');
var Record = require('../dto/record.dto');
var Employee = require('../dto/employee.dto');

class Facade {

    /**
     * Create a new record with the specified data and return the new record
     * 
     * @param {string} employeeId The record's employee's id
     * @param {Object} registry An object with at least the entry time. Exit can be undefined.
     * @param {Date} registry.entry The date and time when the employee start to work
     * @param {Date} [registry.exit] The date and time when the employee finish to work
     * @returns {Record} The stored record as record.dto
     * @throws Will throw an error if the employeeId is not in the DB or if the entry and exit collapse with other record's interval
     */
    static async newRecord(employeeId, registry) {
        let record;
        try {
            record = await RepositoryRecord.newRecord(employeeId, registry);
        } catch (e) {
            throw e;
        }
        return record;
    }

    /**
     * Update the employee's record with exit null to specify the exit
     * 
     * @param {string} employeeId The record's employee's id
     * @param {Date} exit The date and time when the employee finish to work
     * @returns {Record} The updated record as record.dto
     * @throws Will throw an error if the employeeId is not in the DB or if the entry and exit collapse with other record's interval
     */
    static async manualExit(employeeId, exit) {
        let record;
        try {
            record = await RepositoryRecord.manualExit(employeeId, exit);
        } catch (e) {
            throw e;
        }
        return record;
    }

    /**
     * Create a new record to the specified employee with entry as current time
     * 
     * @param {string} employeeId The record's employee's id
     * @returns {Record} The stored record as record.dto
     * @throws Will throw an error if the employeeId is not in the DB or if the entry and exit collapse with other record's interval
     */
    static async quickEntry(employeeId) {
        let record;
        try {
            record = await RepositoryRecord.newQuickEntry(employeeId);
        } catch (e) {
            throw e;
        }
        return record;
    }

    /**
     * Update the employee's record with exit null to specify the exit as current time
     * 
     * @param {string} employeeId The record's employee's id
     * @returns {Record} The updated record as record.dto
     * @throws Will throw an error if the employeeId is not in the DB or if the entry and exit collapse with other record's interval
     */
    static async quickExit(employeeId) {
        let record;
        try {
            record = await RepositoryRecord.addQuickExit(employeeId);
        } catch (e) {
            throw e;
        }
        return record;
    }

    /**
     * Return all records of the employee specified. If there is not query, return all records created in current day.
     * 
     * @typedef {Object} Context
     * @property {Array<Record>} records - The employee's records
     * @property {number} num_pages - The number of pages
     * @property {number} page - The current page
     * 
     * @param {string} employeeId
     * @param {Object} query
     * @param {Date} [query.from]
     * @param {Date} [query.to]
     * @param {(number | null)} page
     * @returns {Context} The employee's records
     * @throws Will throw an error if the employeeId is not in the DB
     */
    static async getRecords(employeeId, query, page) {
        let records;
        try {
            records = await RepositoryRecord.getRecords(employeeId, query, page);
        } catch (e) {
            throw e;
        }
        return records;
    }

    static async getIncompletedRecord(employeeId) {
        let record;
        try {
            record = await RepositoryRecord.getIncompletedRecord(employeeId);
        } catch (e) {
            throw e;
        }
        return record;
    }

    /**
     * Get a list of the employees in the system as employee.dto
     * 
     * @returns {Array<Employee>} The list of employees in the system
     */
    static async getEmployees() {
        let employees;
        try {
            employees = await RepositoryEmployee.getEmployees();
        } catch (e) {
            throw e;
        }
        return employees;
    }

}

module.exports = Facade;