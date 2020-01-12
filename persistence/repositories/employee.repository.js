'use strict'

var EmployeeODM = require('../mongoose-odm/employee');
var Employee = require('../../dto/employee.dto');

var HttpStatus = require('http-status');
var bcrypt = require('bcrypt-nodejs');

class RepositoryEmployee {

    /**
     * Return the employee that match with login and password
     * 
     * @param {string} login The employee's login
     * @param {string} password The employee's password
     * @returns {Employee} The employee as employee.dto
     * @throws Will throw and error if there is no a employee with the specified login and password or if there is some problem with the DB
     */
    static async getEmployeeByLogin(login, password) {
        let employee;
        try {
            employee = await EmployeeODM.findOne({login: login}).exec();
            if (employee) {
                if (bcrypt.compareSync(password, employee.password)) {
                    return new Employee(employee._id, employee.name, employee.surname, login, employee.is_admin);
                } else {
                    let error = new Error('Login or password invalid');
                    error.code = HttpStatus.UNAUTHORIZED;
                    throw error;
                }
            } else {
                let error = new Error('Login or password invalid');
                error.code = HttpStatus.UNAUTHORIZED;
                throw error;
            }
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
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
        try {
            let mEmployee = new EmployeeODM({
                'name': name,
                'surname': surname,
                'login': login,
                'password': bcrypt.hashSync(password, null),
                'is_admin': is_admin
            });
    
            let mEmployeeSaved = await mEmployee.save();
            if (!mEmployeeSaved) {
                let error = new Error('Algo ha fallado a la hora de registrar al nuevo empleado');
                error.code = HttpStatus.INTERNAL_SERVER_ERROR;
                throw error;
            }
    
            let dtoEmployee = new Employee(mEmployeeSaved._id, mEmployeeSaved.name, mEmployeeSaved.surname, mEmployeeSaved.login, mEmployeeSaved.is_admin);
            return dtoEmployee;
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            if (e.code === 11000) {
                e.code = HttpStatus.CONFLICT;
                e.message = 'El login espcificado ya se encuentra en uso';
            }
            throw e;
        }
        
    }

    /**
     * Get a list of the employees in the system as employee.dto
     * 
     * @returns {Array<Employee>} The list of employees in the system
     */
    static async getEmployees() {
        try {
            let mEmployees = await EmployeeODM.find().lean().exec();
            let dtoEmployees = [];
            mEmployees.forEach(mEmployee => {
                let dtoEmployee = new Employee(mEmployee._id, mEmployee.name, mEmployee.surname, mEmployee.login, mEmployee.is_admin);
                dtoEmployees.push(dtoEmployee);
            });
            return dtoEmployees;
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
    }

    /**
     * Change the password of the user specified by its id
     * 
     * @param {string} employeeId The employee's id
     * @param {string} newPassword The new employee's password
     * @returns {void}
     * @throws Will throw an eraror if there is not a employee with the id specified or if there is some problem with the DB
     */
    static async changePassword(employeeId, newPassword) {
        let employee;
        try {
            employee = await EmployeeODM.findById(employeeId).exec();
            if (employee) {
                employee.password = bcrypt.hashSync(newPassword, null);
                let mEmployeeSaved = await employee.save();
                
                if (!mEmployeeSaved) {
                    let error = new Error('Algo ha fallado a la hora de cambiar la contraseña');
                    error.code = HttpStatus.INTERNAL_SERVER_ERROR;
                    throw error;
                }
            } else {
                let error = new Error('No existe ningún empleado con el id especificado');
                error.code = HttpStatus.NOT_FOUND;
                throw error;
            }
        } catch (e) {
            if (!e.code) {
                e.code = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            throw e;
        }
    }

}

module.exports = RepositoryEmployee;