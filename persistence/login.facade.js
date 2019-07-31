'use strict'

var Employee = require('../dto/employee.dto');
var RepositoryEmployee = require('./repositories/employee.repository');

class LoginFacade {

    /**
     * Return the employee that match with login and password
     * 
     * @param {string} login The employee's login
     * @param {string} password The employee's password unencrypted
     * @returns {Employee} The employee as employee.dto
     * @throws Will throw and error if there is no a employee with the specified login and password or if there is some problem with the DB
     */
    static async login(login, password) {
        let employee;
        try {
            employee = await RepositoryEmployee.getEmployeeByLogin(login, password);
        } catch (e) {
            throw e;
        }
        return employee;
    }

    /**
     * Register a employee into the system
     * 
     * @param {string} name The employee's name
     * @param {string} surname The employee's surname
     * @param {string} login The employee's login
     * @param {string} password The employee's password unencrypted
     * @param {boolean} is_admin If the employee is an admin or not
     * @returns {Employee} The new employee as employee.dto
     * @throws Will throw an error if there is a employee with the same login of if there is some problem with the DB
     */
    static async newEmployee(name, surname, login, password, is_admin) {
        let employee;
        try {
            employee = await RepositoryEmployee.newEmployee(name, surname, login, password, is_admin);
            return employee;
        } catch (e) {
            throw e;
        }
    }

}

module.exports = LoginFacade;