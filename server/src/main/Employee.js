const User = require("./User");
const DataBase = require("./DataLayer/DBManager");
const logger = require("simple-node-logger").createSimpleLogger("project.log");

class Employee extends User {
    constructor(id, userName, password, permissions, firstName, lastName, contactDetails) {
        super(id, userName, password, permissions);
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactDetails = contactDetails;
        this.employeeShift = new Map();
        this.isEmployeeRemoved = null;

    }
    async init() {
        if (this.initUser()) {
            let result = await DataBase.singleAdd("employee", {
                id: this.id,
                firstName: this.firstName,
                lastName: this.lastName,
                contactDetails: this.contactDetails
            });
            if (typeof result === "string") {
                this.writeToLog('Error', 'init', ' DB problem - ' + result);
                return false;
            }
            return true;
        }
        return false;
    }



    async editEmployee(password, permissions, firstName, lastName, contactDetails) {
        let result = await this.editUser(password, permissions);
        if (typeof result === "string") {
            return "The Employee cannot be edited\n" + result;
        }
        const tmpFirstName = this.firstName;
        const tmpLastName = this.lastName;
        const tmpContactDetails = this.contactDetails;
        let needToUpdate = false;
        if (this.isNeedToEdit(firstName)) {
            needToUpdate = true;
            logger.info('firstName - ' + firstName + 'isNeedToEdit ' + this.isNeedToEdit(firstName));
            this.firstName = firstName;
        }
        if (this.isNeedToEdit(lastName)) {
            needToUpdate = true;
            console.log('lastName - ' + lastName + 'isNeedToEdit ' + this.isNeedToEdit(lastName));
            this.lastName = lastName;
        }
        if (typeof contactDetails !== 'undefined' && contactDetails !== null) {
            needToUpdate = true;
            console.log('contactDetails - ' + contactDetails + 'isNeedToEdit ' + typeof contactDetails !== 'undefined');
            this.contactDetails = contactDetails;
        }

        if (needToUpdate)
            result = await DataBase.singleUpdate(
                "employee", { id: this.id }, {
                    firstName: firstName,
                    lastName: lastName,
                    contactDetails: contactDetails
                }
            );
        if (typeof result === "string") {
            this.firstName = tmpFirstName;
            this.lastName = tmpLastName;
            this.contactDetails = tmpContactDetails;
            this.writeToLog('Error', 'init', ' DB problem - ' + result);
            return ' DB problem - ' + result;
        }
        return "The Employee edited successfully";
    }

    async removeEmployee() {
        if (this.isEmployeeRemoved == null) {
            if (this.removeUser()) {
                this.isEmployeeRemoved = new Date();
                let result = await DataBase.singleUpdate(
                    "employee", { id: this.id }, { isEmployeeRemoved: this.isEmployeeRemoved }
                );
                if (typeof result === "string") {
                    this.writeToLog('error', 'removeEmployee', ' DB Problem - ' + result);
                    return false;
                }
                return true;
            }
        }
        return false;
    };

    writeToLog(type, functionName, msg) {
        logger.log(type, "Employee - " + functionName + " - " + msg);
    }
}
module.exports = Employee;