const DataBase = require("./DBManager");

class CinemaSystem {
  constructor() {
    this.users = new Map();
    const {User,Employee} = {	
      User:require("./User"),	
      Employee:require("./Employee")	
    };	
    DataBase.connectAndCreate().then(()=>{
      DataBase.init()
      this.users.set(0, new User(0, "admin", "admin", 'ADMIN'));	
      this.users.set(1, new Employee(1, "manager", "manager", 'MANAGER','Noa','Cohen','0508888888'));	
    })
    

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
}

module.exports = CinemaSystem;
