const CinemaSystem = require("./CinemaSystem");

class ServiceLayer {
  constructor() {
    this.cinemaSystem = new CinemaSystem();
    this.users = new Map();
    this.users.set("admin", 0);
    this.userCounter = 3;
    this.movies = new Map();
    this.movies.set("movie", 0);
    this.movieCounter = 1;
    this.suppliers = new Map();
    // just for example purposes
    this.suppliers.set("supplier", 0);
    this.supplierCounter = 1;
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

  printallUser() {
    this.users.forEach((value, key, map) => {
      console.log(`m[${key}] = ${value}`);
    });
  }
  addNewEmployee(
    userName,
    password,
    firstName,
    lastName,
    permissions,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    this.printallUser();
    if (this.users.has(userName)) {
      return "The user already exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let convertedPermission = this.convertPermissions(permissions);
      if (
        convertedPermission === undefined ||
        !Array.isArray(convertedPermission)
      )
        return "No permissions were received for the user";
      let result = this.cinemaSystem.addNewEmployee(
        this.userCounter,
        userName,
        password,
        convertedPermission,
        firstName,
        lastName,
        contactDetails,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The employee registered successfully.") {
        this.users.set(userName, this.userCounter);
        this.userCounter++;
      }
      return result;
    }
  }

  editEmployee(
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    console.log("\n", ActionIDOfTheOperation, "\n");
    console.log("\n", userName, "\n");

    if (!this.users.has(userName)) {
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.editEmployee(
      this.users.get(userName),
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  deleteEmployee(userName, ActionIDOfTheOperation) {
    if (!this.users.has(userName)) {
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let res = this.cinemaSystem.deleteEmployee(
      this.users.get(userName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(userName);
    return res;
  }

  editMovie(movieName, category, key, examinationRoom, ActionIDOfTheOperation) {
    if (!this.movies.has(movieName)) {
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.editMovie(
      this.movies.get(movieName),
      category,
      key,
      examinationRoom,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  removeMovie(movieName, ActionIDOfTheOperation) {
    if (!this.movies.has(movieName)) {
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let res = this.cinemaSystem.editMovie(
      this.movies.get(movieName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "The movie removed successfully") {
      this.movies.delete(movieName);
      this.movieCounter--;
    }
    return res;
  }

  addNewSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    if (this.suppliers.has(supplierName)) {
      return "The supplier already exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.addNewSupplier(
        this.supplierCounter,
        supplierName,
        contactDetails,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The supplier added successfully.") {
        this.suppliers.set(supplierName, this.supplierCounter);
        this.suppliers++;
      }
      return result;
    }
  }

  editSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.editSupplier(
        this.supplierCounter,
        supplierName,
        contactDetails,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The supplier edited successfully.") {
        this.suppliers.set(supplierName, this.supplierCounter);
      }
      return result;
    }
  }

  removeSupplier(supplierName, ActionIDOfTheOperation) {
    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.editSupplier(
        this.supplierCounter,
        supplierName,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The supplier removed successfully.") {
        this.suppliers.set(supplierName, this.userCounter);
      }
      return result;
    }
  }

  convertPermissions(permissions) {
    switch (permissions) {
      case "User":
        return [1];
      case "Shift Manager":
        return [1, 2];
      case "Deputy Director":
        return [1, 2, 3];
      case "Director":
        return [1, 2, 3, 4];
      case "admin":
        return [1, 2, 3, 4, 5];
      default:
        return undefined;
    }
  }
}
module.exports = ServiceLayer;
