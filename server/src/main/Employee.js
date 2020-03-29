const User = require("./User");
const DataBase = require("./DBManager");

class Employee extends User {
    constructor(id, userName, password, permissions, firstName, lastName, contactDetails) {
        super(id, userName, password, permissions);
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactDetails = contactDetails;
        this.employeeShift = new Map();
        this.isEmployeeRemoved =null;
        DataBase.add('employee',{ id:id,firstName:firstName,lastName:lastName,contactDetails:contactDetails});
        DataBase.setDestroyTimer('employees',false,'2 YEAR','1 DAY','isEmployeeRemoved');


    }
    editEmployee(password, permissions, firstName, lastName, contactDetails) {
        super.password = password;
        super.permissions = permissions;
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactDetails = contactDetails;
        this.employeeShift = new Map();
    }

    removeEmployee = () => {
        if (this.isEmployeeRemoved == null) {
            this.isEmployeeRemoved = new Date();
            DataBase.update('employee', { id: this.id }, { isEmployeeRemoved: this.isEmployeeRemoved });
            return true;
        }
        else
            return false;
    }
}
module.exports = Employee;