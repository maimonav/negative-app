const Employee = require("./Employee");
const logger = require("simple-node-logger").createSimpleLogger("project.log");

class EmployeeManagemnt {
  constructor() {
    this.employeeDictionary = new Map();
    this.shiftBoardsDictionary = new Map();
  }

  async addNewEmployee(
    userID,
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    isPasswordHashed
  ) {
    if (this.employeeDictionary.has(userID)) {
      this.writeToLog(
        "info",
        "addNewEmployee",
        "The " + userName + " already exist"
      );
      return "The employee already exist";
    }
    let employee = new Employee(
      userID,
      userName,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      isPasswordHashed
    );
    let result = await employee.init();
    if (typeof result === "string") {
      this.writeToLog("error", "addNewEmployee", result);
      return result;
    }
    this.employeeDictionary.set(userID, employee);
    return employee;
  }

  async editEmployee(
    employeeID,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails
  ) {
    if (!this.employeeDictionary.has(employeeID)) {
      this.writeToLog(
        "info",
        "editEmployee",
        "EmployeeManagemnt- editEmployee - The " +
          employeeID +
          " does not exist"
      );
      return "The employee does not exist in the system.";
    }
    return await this.employeeDictionary
      .get(employeeID)
      .editEmployee(password, permissions, firstName, lastName, contactDetails);
  }

  async deleteEmployee(employeeID) {
    if (!this.employeeDictionary.has(employeeID)) {
      this.writeToLog(
        "info",
        "deleteEmployee",
        "The " + employeeID + " does not exist"
      );
      return "The employee does not exist in the system.";
    }
    if (await this.employeeDictionary.get(employeeID).removeEmployee())
      if (this.employeeDictionary.delete(employeeID))
        return "Successfully deleted employee data deletion";
    this.writeToLog(
      "info",
      "deleteEmployee",
      "The deletion of " + employeeID + " data ended with failure"
    );
    return "The deletion of employee data ended with failure";
  }
  getEmployees() {
    const output = [];
    this.employeeDictionary.forEach((employee) => {
      let value = {
        title: employee.userName,
      };
      output.push(value);
    });
    console.log(output.toString());
    return output;
  }

  getEmployeeDetails(employeeID) {
    if (this.employeeDictionary.has(employeeID)) {
      const employee = this.employeeDictionary.get(employeeID);
      return {
        id: employee.id,
        userName: employee.userName,
        password: employee.password,
        firstName: employee.firstName,
        lastName: employee.lastName,
        permissions: employee.permissions,
        contactDetails: employee.contactDetails,
      };
    }
    return {};
  }
  writeToLog(type, functionName, msg) {
    logger.log(type, "EmployeeManagement - " + functionName + " - " + msg);
  }
}
module.exports = EmployeeManagemnt;
