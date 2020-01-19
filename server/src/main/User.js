const DataBase = require("./DBManager");

class User {
  constructor(id, userName, password, permissions) {
    this.sha256 = require("js-sha256").sha256;
    this.id = id;
    this.userName = userName;
    this.password = this.sha256(userName + password);
    this.permissions = permissions;
    this.isLoggedin = false;
    DataBase.add('user',{ id:id,username:userName, password:password, permissions:permissions});

  }

  login(userName, password) {
    if (this.isLoggedin) {
      return "The user already connected";
    }
    if (
      this.userName !== userName ||
      this.password !== this.sha256(userName + password)
    ) {
      return "Incorrect user name or password";
    }
    this.isLoggedin = true;
    console.log(this);
    return "User Logged in succesfully.";
  }

  logout() {
    if (!this.isLoggedin) return "The user isn't connected";
    this.isLoggedin = false;
    return "Logout succeded.";
  }

  equals(toCompare) {
    return (
      toCompare.userName === this.userName &&
      toCompare.password === this.password &&
      toCompare.permissions === this.permissions
    );
  }
}

module.exports = User;
