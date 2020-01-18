const User = require("./User");
class Employee extends User {
  constructor(id, userName, password, permissions, firstName, lastName) {
    super(id, userName, password, permissions);
    this.firstName = firstName;
    this.lastName = lastName;
    this.employeeShift = new Map();
  }
}
module.exports = Employee;
