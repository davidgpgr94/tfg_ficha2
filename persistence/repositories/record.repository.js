'use strict'

var Record = require('../../dto/record.dto');
var Employee = require('../../dto/employee.dto');

var RecordODM = require('../mongoose-odm/record');
var EmployeeODM = require('../mongoose-odm/employee');

var HttpStatus = require('http-status');

class RepositoryRecord {

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
        try {
            let employee = await EmployeeODM.findById(employeeId).exec();
            if (!employee) {
                let error = new Error(`El empleado con id ${employeeId} no existe`);
                error.code = HttpStatus.BAD_REQUEST;
                throw error;
            }

            let mRecord = new RecordODM({
                'employee': employeeId,
                'entry': registry.entry
            });

            if (registry.exit !== undefined) {
                mRecord.exit = registry.exit;
            }

            let mSavedRecord = await mRecord.save();
            if (!mSavedRecord) {
                let error = new Error(`Algo ha fallado al crear el nuevo registro y no ha sido guardado`);
                error.code = HttpStatus.INTERNAL_SERVER_ERROR;
                throw error;
            }

            let dtoRecord = new Record(mSavedRecord._id, mSavedRecord.employee, mSavedRecord.entry);
            dtoRecord.setExit(mSavedRecord.exit);
            
            return dtoRecord;
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
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
        try {
            let employee = await EmployeeODM.findById(employeeId).exec();
            if (!employee) {
                let error = new Error(`El empleado con id ${employeeId} no existe`);
                error.code = HttpStatus.BAD_REQUEST;
                throw error;
            }

            let array_record_to_exit = await RecordODM.where('employee', employeeId).where('exit', null).exec();
            if (array_record_to_exit.length < 1) {
                let error = new Error(`Es necesario que haya un registro de entrada primero`);
                error.code = HttpStatus.BAD_REQUEST;
                throw error;
            }
            let record_to_exit = array_record_to_exit[0];
            record_to_exit.exit = exit;

            await record_to_exit.save();

            let dtoRecord = new Record(record_to_exit._id, record_to_exit.employee, record_to_exit.entry);
            dtoRecord.setExit(record_to_exit.exit);
            
            return dtoRecord;
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
    }

    /**
     * Create a new record to the specified employee with entry as current time
     * 
     * @param {string} employeeId The record's employee's id
     * @returns {Record} The stored record as record.dto
     * @throws Will throw an error if the employeeId is not in the DB or if the entry and exit collapse with other record's interval
     */
    static async newQuickEntry(employeeId) {
        try {
            let employee = await EmployeeODM.findById(employeeId).exec();
            if (!employee) {
                let error = new Error(`El empleado con id ${employeeId} no existe`);
                error.code = HttpStatus.BAD_REQUEST;
                throw error;
            }

            let mRecord = new RecordODM({
                'employee': employeeId,
                'entry': new Date(Date.now())
            });

            let mSavedRecord = await mRecord.save();
            if (!mSavedRecord) {
                let error = new Error(`Algo ha fallado al crear el nuevo registro y no ha sido guardado`);
                error.code = HttpStatus.INTERNAL_SERVER_ERROR;
                throw error;
            }

            let dtoRecord = new Record(mSavedRecord._id, mSavedRecord.employee, mSavedRecord.entry);

            return dtoRecord;
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
    }

    /**
     * Update the employee's record with exit null to specify the exit as current time
     * 
     * @param {string} employeeId The record's employee's id
     * @returns {Record} The updated record as record.dto
     * @throws Will throw an error if the employeeId is not in the DB or if the entry and exit collapse with other record's interval
     */
    static async addQuickExit(employeeId) {
        try {
            let employee = await EmployeeODM.findById(employeeId).exec();
            if (!employee) {
                let error = new Error(`El empleado con id ${employeeId} no existe`);
                error.code = HttpStatus.BAD_REQUEST;
                throw error;
            }

            let array_record_to_exit = await RecordODM.where('employee', employeeId).where('exit', null).exec();
            if (array_record_to_exit.length < 1) {
                let error = new Error(`Es necesario primero hacer un quick entry`);
                error.code = HttpStatus.BAD_REQUEST;
                throw error;
            }
            let record_to_exit = array_record_to_exit[0];

            record_to_exit.exit = new Date(Date.now());
            
            await record_to_exit.save();

            let dtoRecord = new Record(record_to_exit._id, record_to_exit.employee, record_to_exit.entry);
            dtoRecord.setExit(record_to_exit.exit);

            return dtoRecord;

        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
    }

    /**
     * Return all records of the employee specified
     * 
     * @param {string} employeeId
     * @param {Object} query
     * @param {Date} [query.from]
     * @param {Date} [query.to]
     * @returns {Array<Record>} The employee's records
     * @throws Will throw an error if the employeeId is not in the DB
     */
    static async getRecords(employeeId, query) {
        try {
            let employee = await EmployeeODM.findById(employeeId).exec();
            if (!employee) {
                let error = new Error(`El empleado con id ${employeeId} no existe`);
                error.code = HttpStatus.BAD_REQUEST;
                throw error;
            }
            
            let dtoEmployee = new Employee(employee._id, employee.name, employee.surname, employee.login, employee.is_admin);
            let find = RecordODM.where('employee', employeeId);
            if (query.from) {
                //let from = query.from.setHours(0,0,0,0);
                find.where('entry').gte(query.from);
            }
            if (query.to) {
                //let to = query.to.setHours(0,0,0,0);
                find.where('entry').lte(query.to);
            }
            if (!query.from && !query.to) {
                let todayStart = new Date(Date.now());
                let todayEnd = new Date(Date.now());
                todayStart.setHours(0,0,0,0);
                todayEnd.setHours(23,59,59,59);
                find.where('entry').gte(todayStart).where('entry').lte(todayEnd);
            }
            let mRecords = await find.exec();
            //let mRecords = await RecordODM.where('employee', employeeId).where('entry', new Date(Date.now()));
            let dtoRecords = [];
            mRecords.forEach(mRecord => {
                let r = new Record(mRecord._id, dtoEmployee, mRecord.entry);
                if (mRecord.exit && mRecord.exit !== null && mRecord.exit !== undefined) {
                    r.setExit(mRecord.exit);
                }
                r.setSignedByEmployee(mRecord.signed_by_employee);
                r.setSignedByAdmin(mRecord.signed_by_admin);
                dtoRecords.push(r);
            });
            return dtoRecords;
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
    }

}

module.exports = RepositoryRecord;