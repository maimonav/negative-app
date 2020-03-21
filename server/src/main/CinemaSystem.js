const DataBase = require("./DBManager");

class CinemaSystem {
  constructor() {
    this.users = new Map();
    const { User, Employee } = {
      User: require("./User"),
      Employee: require("./Employee")
    };
    const EmployeeManagement = require("./EmployeeManagement");
    this.employeeManagement = new EmployeeManagement();
    this.userOfflineMsg =
      "The operation cannot be completed - the user is not connected to the system";
    this.inappropriatePermissionsMsg = "User does not have proper permissions";

    DataBase.connectAndCreate().then(() => {
      DataBase.init();
      this.users.set(0, new User(0, "admin", "admin", [1, 2, 3, 4, 5]));
      this.users.set(
        1,
        new Employee(
          1,
          "manager",
          "manager",
          [1, 2, 3, 4],
          "Noa",
          "Cohen",
          "0508888888"
        )
      );
    });
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

  addNewEmployee(
    userID,
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    if (this.users.has(userID)) return "The id is already exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    )
      return this.userOfflineMsg;
    if (!this.users.get(ActionIDOfTheOperation).permmisionCheck(3))
      return this.inappropriatePermissionsMsg;
    let employee = this.employeeManagement.addNewEmployee(
      userID,
      userName,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails
    );
    if (employee === "The employee already exist")
      return "The id is already exists";
    this.users.set(userID, employee);
    return "The employee registered successfully.";
  }

  editEmployee(
    employeeID,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    if (!this.users.has(employeeID)) return "The id is not exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    )
      return this.userOfflineMsg;
    if (
      !this.users.get(ActionIDOfTheOperation).permmisionCheck(3) &&
      ActionIDOfTheOperation !== employeeID
    )
      return this.inappropriatePermissionsMsg;
    return this.employeeManagement.editEmployee(
      employeeID,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails
    );
  }

  deleteEmployee(employeeID, ActionIDOfTheOperation) {
    if (!this.users.has(employeeID)) return "The id is not exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    )
      return this.userOfflineMsg;
    if (!this.users.get(ActionIDOfTheOperation).permmisionCheck(3))
      return this.inappropriatePermissionsMsg;
    if (employeeID === ActionIDOfTheOperation)
      return "A user cannot erase himself";
    if (this.users.get(employeeID).isLoggedin())
      return "You cannot delete a logged in user";
    let res = this.employeeManagement.deleteEmployee(employeeID);
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(employeeID);
    return res;
  }

  editMovie(movieID, category, key, examinationRoom, ActionIDOfTheOperation) {
    return "TODO: IMPLEMENT THIS.";
  }

  removeMovie(movieID, ActionIDOfTheOperation) {
    return "TODO: IMPLEMENT THIS.";
  }
}

module.exports = CinemaSystem;
