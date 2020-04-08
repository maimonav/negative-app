const Employee = require("./Employee");
const logger = require('simple-node-logger').createSimpleLogger('project.log');

class EmployeeManagemnt {

    constructor() {
        this.employeeDictionary = new Map();
        this.shiftBoardsDictionary = new Map();
    }

    addNewEmployee(userID, userName, password, permissions, firstName, lastName, contactDetails) {
        if (this.employeeDictionary.has(userID)) {
            logger.info("EmployeeManagemnt- addNewEmployee - The " + userName + " already exist");
            return "The employee already exist";
        }
        let employee = new Employee(userID, userName, password, permissions, firstName, lastName, contactDetails);
        this.employeeDictionary.set(userID, employee);
        return employee;
    }
    editEmployee(employeeID, password, permissions, firstName, lastName, contactDetails) {
        if (!this.employeeDictionary.has(employeeID)) {
            logger.info("EmployeeManagemnt- editEmployee - The " + employeeID + " already exist");
            return "The employee does not exist in the system.";
        }
        this.employeeDictionary.get(employeeID).editEmployee(password, permissions, firstName, lastName, contactDetails);
        return "Employee editing data ended successfully";
    }

    deleteEmployee(employeeID) {
        if (!this.employeeDictionary.has(employeeID)) {
            logger.info("EmployeeManagemnt- deleteEmployee - The " + employeeID + " does not exist");
            return "The employee does not exist in the system.";
        }
        if (this.employeeDictionary.get(employeeID).removeEmployee())
            if (this.employeeDictionary.delete(employeeID))
                return "Successfully deleted employee data deletion";
        logger.info("EmployeeManagemnt- deleteEmployee - The deletion of " + employeeID + " data ended with failure");
        return "The deletion of employee data ended with failure";
    }


}
module.exports = EmployeeManagemnt;