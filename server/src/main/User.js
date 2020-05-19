const DataBase = require("./DataLayer/DBManager");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const permissionDictionery = {
  ADMIN: 5,
  MANAGER: 4,
  DEPUTY_MANAGER: 3,
  "DEPUTY MANAGER": 3,
  SHIFT_MANAGER: 2,
  "SHIFT MANAGER": 2,
  EMPLOYEE: 1,
};

class User {
  constructor(id, userName, password, permissions, isPasswordHashed) {
    this.sha256 = require("js-sha256").sha256;
    this.id = id;
    this.userName = userName;
    this.password = isPasswordHashed
      ? password
      : this.sha256(userName + password);
    this.permissions = permissions;
    this.Loggedin = false;
    this.isUserRemoved = null;
  }

  async initUser() {
    let result = await DataBase.singleAdd("user", {
      id: this.id,
      username: this.userName,
      password: this.password,
      permissions: this.permissions,
    });
    if (typeof result === "string") {
      this.writeToLog("error", "initUser", " DB Problem - " + result);
      return false;
    }
    return true;
  }

  getUserActionDB(name) {
    return { name: DataBase._add };
  }

  async removeUser() {
    if (this.isUserRemoved == null) {
      this.isUserRemoved = new Date();
      let result = await DataBase.singleUpdate(
        "user",
        { id: this.id },
        { isUserRemoved: this.isUserRemoved }
      );
      if (typeof result === "string") {
        this.writeToLog("error", "removeUser", " DB Problem - " + result);
        return false;
      }
      return true;
    }
    return false;
  }

  editUser = (password, permissions) => {
    const tmpPassword = this.password;
    const tmpPermission = this.permissions;
    let needToUpdate = false;
    if (this.isNeedToEdit(password)) {
      this.password = this.sha256(this.userName + password);
      needToUpdate = true;
    }
    if (
      this.isNeedToEdit(permissions) &&
      User.getPermissionTypeList()[permissions] >= 0
    ) {
      this.permissions = permissions;
      needToUpdate = true;
    }

    return {
      isNeedToEdit: needToUpdate,
      tmpPassword: tmpPassword,
      tmpPermission: tmpPermission,
    };
  };

  login(userName, password) {
    if (this.Loggedin) {
      this.writeToLog(
        "info",
        "login",
        "The " + userName + " already connected"
      );
      return "The user already connected";
    }
    if (
      this.userName !== userName ||
      this.password !== this.sha256(userName + password)
    ) {
      this.writeToLog(
        "info",
        "login",
        "Incorrect user name(" + userName + ") or password "
      );
      return "Incorrect user name or password";
    }
    this.Loggedin = true;
    return ["User Logged in succesfully.", this.permissions];
  }

  logout() {
    if (!this.Loggedin) {
      this.writeToLog(
        "info",
        "logout",
        "The user " +
          this.userName +
          " tried to disconnect but was not connected in the first place."
      );
      return "The user isn't connected";
    }
    this.Loggedin = false;
    return "Logout succeded.";
  }

  isLoggedin() {
    return this.Loggedin;
  }

  permissionCheck(permissionRequired) {
    return (
      permissionDictionery[this.permissions] >=
      permissionDictionery[permissionRequired]
    );
  }

  equals(toCompare) {
    return (
      toCompare.userName === this.userName &&
      toCompare.password === this.password &&
      toCompare.permissions === this.permissions
    );
  }

  static getPermissionTypeList() {
    return permissionDictionery;
  }

  getPermissionValue() {
    return permissionDictionery[this.permissions];
  }

  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "User", functionName, msg);
  }

  isNeedToEdit(varibleToCheck) {
    if (typeof varibleToCheck === "undefined" || varibleToCheck === null)
      return false;
    if (
      typeof varibleToCheck === "string" &&
      varibleToCheck === "" &&
      varibleToCheck === ""
    )
      return false;
    return true;
  }
}

module.exports = User;
