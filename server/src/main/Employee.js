const User = require("./User");
const DataBase = require("./DBManager");

class Employee extends User {
    constructor(id, userName, password, permissions, firstName, lastName, contactDetails) {
        super(id, userName, password, permissions);
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactDetails = contactDetails;
        this.employeeShift = new Map();
        this.isEmployeeRemoved = null;
        DataBase.singleAdd('employee', { id: id, firstName: firstName, lastName: lastName, contactDetails: contactDetails });
        DataBase.singleSetDestroyTimer('employees', false, '2 YEAR', '1 DAY', 'isEmployeeRemoved');


    }
    editEmployee(password, permissions, firstName, lastName, contactDetails) {
        this.editUser(password, permissions);
        if (firstName != undefined && firstName != '')
            this.firstName = firstName;
        if (lastName != undefined && lastName != '')
            this.lastName = lastName;
        if (contactDetails != undefined)
            this.contactDetails = contactDetails;
        DataBase.singleUpdate('employee', { id: this.id }, { firstName: firstName, lastName: lastName, contactDetails: contactDetails });
    }

    removeEmployee = () => {
        if (this.isEmployeeRemoved == null) {
            this.isEmployeeRemoved = new Date();
            DataBase.singleUpdate('employee', { id: this.id }, { isEmployeeRemoved: this.isEmployeeRemoved });
            return true;
        } else
            return false;
    }
}
module.exports = Employee;