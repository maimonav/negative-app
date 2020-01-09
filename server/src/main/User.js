// const { UserDB } = require("./Models");
class User {
  constructor(id, userName, password, permissions) {
    this.sha256 = require("js-sha256").sha256;
    this.id = id;
    this.userName = userName;
    this.password = this.sha256(userName + password);
    this.permissions = permissions;
    this.isLoggedin = false;
    try {
      // new UserDB({
      //   _id: id,
      //   username: userName,
      //   password: password,
      //   permissions: permissions
      // }).save(err => {});
      // err ? console.error(err) : console.error(`${userName} saved`)
      // );
    } catch (error) {}

    //TODO: remove//
    // UserDB.find((err, users) => (err ? console.log(err) : console.log(users)));
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
    if (!this.isConnected) return "The user isn't connected";
    this.isLoggedin = false;
    return "Logout success";
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
