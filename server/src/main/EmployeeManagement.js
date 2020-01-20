class EmployeeManagemnt {

    constructor() {
        this.employeeDictionary = new Map();
        this.shiftBoardsDictionary = new Map();
    }

    addNewEmployee(userID, userName, password, permissions, firstName, lastName, contactDetails) {
        if (this.employeeDictionary.has(userID)) {
            return "The employee already exist";
        }
        const Employee = require("./Employee");
        let employee = new Employee(userID, userName, password, permissions, firstName, lastName, contactDetails);
        this.employeeDictionary.set(userID, employee);
        return employee;
    }
}
module.exports = EmployeeManagemnt;