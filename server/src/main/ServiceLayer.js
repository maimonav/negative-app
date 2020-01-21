const CinemaSystem = require("./CinemaSystem");

class ServiceLayer {
    constructor() {
        this.cinemaSystem = new CinemaSystem();
        this.users = new Map();
        this.users.set("admin", 0);
        this.userCounter = 1;
    }

    register(userName, password) {
        if (this.users.has(userName)) {
            return "The user already Exist";
        } else {
            let result = this.cinemaSystem.register(
                this.userCounter,
                userName,
                password,
                this.convertPermissions("User")
            );
            if (result === "The user registered successfully.") {
                this.users.set(userName, this.userCounter);
                this.userCounter++;
            }
            return result;
        }
    }

    login(userName, password) {
        if (this.users.has(userName)) {
            return this.cinemaSystem.login(
                userName,
                password,
                this.users.get(userName)
            );
        }
        return "Incorrect user name.";
    }

    logout(userName) {
        if (this.users.has(userName)) {
            return this.cinemaSystem.logout(this.users.get(userName));
        }
        return "Incorrect user name.";
    }

    addNewEmployee(userName, password, firstName, lastName, permissions, contactDetails, ActionIDOfTheOperation) {
        if (this.users.has(userName)) {
            return "The user already exist";
        } else {
            if (!this.users.has(ActionIDOfTheOperation)) {
                return "The user performing the operation does not exist in the system";
            }
            let convertedPermission = this.convertPermissions(permissions)
            if ((convertedPermission = undefined || !Array.isArray(convertedPermission)))
                return "No permissions were received for the user";
            let result = this.cinemaSystem.addNewEmployee(this.userCounter, userName, password, convertedPermission, firstName, lastName, contactDetails, this.users.get(ActionIDOfTheOperation));
            if (result === "The employee registered successfully.") {
                this.users.set(userName, this.userCounter)
                this.userCounter++;
            }
            return result;
        }
    }

    editEmployee(userName, password, permissions, firstName, lastName, contactDetails, ActionIDOfTheOperation) {
        console.log("\n", ActionIDOfTheOperation, "\n");
        console.log("\n", userName, "\n");

        if (!this.users.has(userName)) {
            return "The employee does not exist";
        }
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        return this.cinemaSystem.editEmployee(this.users.get(userName), password, permissions, firstName, lastName, contactDetails, this.users.get(ActionIDOfTheOperation));
    }

    deleteEmployee(userName, ActionIDOfTheOperation) {
        if (!this.users.has(userName)) {
            return "The employee does not exist";
        }
        if (!this.users.has(ActionIDOfTheOperation)) {
            return "The user performing the operation does not exist in the system";
        }
        let res = this.cinemaSystem.deleteEmployee(this.users.get(userName), this.users.get(ActionIDOfTheOperation));
        if (res === "Successfully deleted employee data deletion")
            this.users.delete(userName);
        return res;
    }

    convertPermissions(permissions) {
        switch (permissions) {
            case 'User':
                return [1];
            case 'Shift Manager':
                return [1, 2];
            case 'Deputy Director':
                return [1, 2, 3];
            case 'Director':
                return [1, 2, 3, 4];
            default:
                return undefined;
        }
    }
}
module.exports = ServiceLayer;