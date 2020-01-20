const CinemaSystem = require("./CinemaSystem");

class ServiceLayer {
  constructor() {
    this.cinemaSystem = new CinemaSystem();
    this.users = new Map();
    this.users.set("admin", 0);
    this.userCounter = 1;
  }

  register(userName, password, permissions) {
    if (this.users.has(userName)) {
      return "The user already Exist";
    } else {
      let result = this.cinemaSystem.register(
        this.userCounter,
        userName,
        password,
        permissions
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

  addNewEmployee(userName, password, firstName, lastName, permission, contactDetails){
    return "Employee Added Successfully"
  }
}
module.exports = ServiceLayer;
