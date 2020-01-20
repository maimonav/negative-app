// const mongoose = require("mongoose");

class CinemaSystem {
    constructor() {
        this.users = new Map();
        const User = require("./User");
        this.users.set(0, new User(0, "admin", "admin", [1, 2, 3]));
        const EmployeeManagement = require("./EmployeeManagement");
        this.employeeManagement = new EmployeeManagement();

    }

    register(id, userName, password, permissions) {
        if (this.users.has(id)) return "The id is already exists";
        if (
            (permissions =
                undefined || !Array.isArray(permissions) || permissions.length === 0)
        )
            return "No permissions were received for the user";
        const User = require("./User");
        this.users.set(id, new User(id, userName, password, permissions));
        return "The user registered successfully.";
    }

    login(userName, password, userId) {
        if (!this.users.has(userId)) return "The user isn't exists";
        return this.users.get(userId).login(userName, password);
    }

    logout(userId) {
        if (!this.users.has(userId)) return "The user isn't exists";
        return this.users.get(userId).logout();
    }
    addNewEmployee(userID, userName, password, permissions, firstName, lastName, contactDetails) {
        if (this.users.has(userID)) return 'The id is already exists';
        let employee = this.employeeManagement.addNewEmployee(userID, userName, password, permissions, firstName, lastName, contactDetails);
        if (employee === "The employee already exist")
            return "The id is already exists";
        this.users.set(userID, employee);
        return "The employee registered successfully.";
    }
    editEmployee(employeeID, password, permissions, firstName, lastName, contactDetails) {
        if (!this.users.has(employeeID)) return 'The id is not exists';
        return this.employeeManagement.editEmployee(employeeID, password, permissions, firstName, lastName, contactDetails);
    }

    deleteEmployee(employeeID) {
        if (!this.users.has(employeeID)) return 'The id is not exists';
        let res = this.employeeManagement.deleteEmployee(employeeID);
        if (res === "Successfully deleted employee data deletion")
            this.users.delete(employeeID);
        return res;
    }
}

module.exports = CinemaSystem;