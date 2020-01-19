const User = require("./User");
const DataBase = require("./DBManager");

class Employee extends User {
  constructor(id, userName, password, permissions, firstName, lastName,contactDetails) {
    super(id, userName, password, permissions);
    this.firstName = firstName;
    this.lastName = lastName;
    this.contactDetails = contactDetails;
    this.employeeShift = new Map();
    DataBase.add('employee',{ id:id,firstName:firstName,lastName:lastName,contactDetails:contactDetails});

  }
}
module.exports = Employee;