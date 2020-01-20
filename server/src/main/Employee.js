const User = require("./User");
class Employee extends User {
    constructor(id, userName, password, permissions, firstName, lastName, contactDetails) {
        super(id, userName, password, permissions);
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactDetails = contactDetails;
        this.employeeShift = new Map();
    }
}
module.exports = Employee;