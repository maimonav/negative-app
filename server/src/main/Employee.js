const User = require("./User");
const DataBase = require("./DataLayer/DBManager");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");

class Employee extends User {
  constructor(
    id,
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    isPasswordHashed
  ) {
    super(id, userName, password, permissions, isPasswordHashed);
    this.firstName = firstName;
    this.lastName = lastName;
    this.contactDetails = contactDetails;
    this.employeeShift = new Map();
    this.isEmployeeRemoved = null;
  }
  async init() {
    let name = DataBase._add;
    let userActionDB = {
      name: name,
      model: "user",
      params: {
        element: {
          id: this.id,
          username: this.userName,
          password: this.password,
          permissions: this.permissions,
        },
      },
    };
    let employeeActionDB = {
      name: name,
      model: "employee",
      params: {
        element: {
          id: this.id,
          firstName: this.firstName,
          lastName: this.lastName,
          contactDetails: this.contactDetails,
        },
      },
    };
    let result = await DataBase.executeActions([
      userActionDB,
      employeeActionDB,
    ]);
    if (typeof result === "string") {
      this.writeToLog("Error", "init", " DB problem - " + result);
      return " DB problem - " + result;
    }
    return true;
  }

  async editEmployee(
    password,
    permissions,
    firstName,
    lastName,
    contactDetails
  ) {
    let UserUpdatedObject = this.editUser(password, permissions);
    let DBactions = [];
    if (UserUpdatedObject.isNeedToEdit)
      DBactions.push({
        name: DataBase._update,
        model: "user",
        params: {
          where: {
            id: this.id,
          },
          element: {
            password: this.password,
            permissions: this.permissions,
          },
        },
      });
    const tmpFirstName = this.firstName;
    const tmpLastName = this.lastName;
    const tmpContactDetails = this.contactDetails;
    let needToUpdate = false;
    if (this.isNeedToEdit(firstName)) {
      needToUpdate = true;
      this.firstName = firstName;
    }
    if (this.isNeedToEdit(lastName)) {
      needToUpdate = true;
      this.lastName = lastName;
    }
    if (typeof contactDetails !== "undefined" && contactDetails !== null) {
      needToUpdate = true;
      this.contactDetails = contactDetails;
    }

    if (needToUpdate || UserUpdatedObject.isNeedToEdit)
      DBactions.push({
        name: DataBase._update,
        model: "employee",
        params: {
          where: {
            id: this.id,
          },
          element: {
            firstName: this.firstName,
            lastName: this.lastName,
            contactDetails: this.contactDetails,
          },
        },
      });
    if (DBactions.length > 0) {
      let result = await DataBase.executeActions(DBactions);
      if (typeof result === "string") {
        this.firstName = tmpFirstName;
        this.lastName = tmpLastName;
        this.contactDetails = tmpContactDetails;
        this.writeToLog("Error", "init", " DB problem - " + result);
        return " DB problem - " + result;
      }
    }
    return "The Employee edited successfully";
  }

  async removeEmployee() {
    if (this.isEmployeeRemoved == null) {
      this.isUserRemoved = new Date();
      this.isEmployeeRemoved = new Date();
      let userActionDB = {
        name: DataBase._update,
        model: "user",
        params: {
          where: {
            id: this.id,
          },
          element: {
            isUserRemoved: this.isUserRemoved,
          },
        },
      };
      let employeeActionDB = {
        name: DataBase._update,
        model: "employee",
        params: {
          where: {
            id: this.id,
          },
          element: {
            isEmployeeRemoved: this.isEmployeeRemoved,
          },
        },
      };

      let result = await DataBase.executeActions([
        userActionDB,
        employeeActionDB,
      ]);
      if (typeof result === "string") {
        this.isUserRemoved = null;
        this.isEmployeeRemoved = null;
        this.writeToLog("error", "removeEmployee", " DB Problem - " + result);
        return false;
      }
      return true;
    }
    return false;
  }

  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "Employee", functionName, msg);
  }
}
module.exports = Employee;
