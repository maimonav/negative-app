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
    editEmployee(employeeID, password, permissions, firstName, lastName, contactDetails) {
        if (!this.employeeDictionary.has(employeeID)) {
            return "The employee does not exist in the system.";
        }
        this.employeeDictionary.get(employeeID).editEmployee(password, permissions, firstName, lastName, contactDetails);
        return "Employee editing data ended successfully";
    }

    deleteEmployee(employeeID) {
        if (!this.employeeDictionary.has(employeeID)) {
            return "The employee does not exist in the system.";
        }
        if (this.employeeDictionary.delete(employeeID))
            return "Successfully deleted employee data deletion";
        return "The deletion of employee data ended with failure";

    }
}
module.exports = EmployeeManagemnt;