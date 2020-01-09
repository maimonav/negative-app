// const mongoose = require("mongoose");

class CinemaSystem {
  constructor() {
    this.users = new Map();
    // this.connectToDB();
    const User = require("./User");
    this.users.set(0, new User(0, "admin", "admin", [1, 2, 3]));
  }

  // connectToDB = () => {
  //   mongoose.connect("mongodb://localhost/db", {
  //     useUnifiedTopology: true,
  //     useNewUrlParser: true
  //   });
  //   var db = mongoose.connection;
  //   db.on("error", console.error.bind(console, "connection error:"));
  //   db.once("open", function() {
  //     console.log("connected");
  //   });
  // };

  register(id, userName, password, permissions) {
    if (id in this.users) return "The id is already exists";
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
}

module.exports = CinemaSystem;
