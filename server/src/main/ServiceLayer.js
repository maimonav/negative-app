const CinemaSystem = require("./CinemaSystem");

class ServiceLayer {
  constructor() {
    this.cinemaSystem = new CinemaSystem();
    this.users = new Map();
    this.users.set("admin", 0);
    this.userCounter = 1;
  }

  register(userName, password, permissions) {
    if (this.users.get(userName) !== "undefined") {
      return "The user already Exist";
    } else {
      this.users.set(userName, this.userCounter);
      this.userCounter++;
      return this.cinemaSystem.register(
        this.userCounter,
        userName,
        password,
        permissions
      );
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
  }

  logout(userName) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.logout(this.users.get(userName));
    }
  }
}
module.exports = ServiceLayer;
