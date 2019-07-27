'use strict'

class Employee {

    /**
     * 
     * @param {string} _id The employee's id
     * @param {string} name The employee's name
     * @param {string} surname The employee's surname
     * @param {string} login The employee's login
     * @param {boolean} is_admin If the employee is an admin or not
     */
    constructor(_id, name, surname, login, is_admin) {
        this._id = _id;
        this.name = name;
        this.surname = surname;
        this.login = login;
        this.is_admin = is_admin;
    }
}

module.exports = Employee;