const DataBase = require("./DataLayer/DBManager");
const User = require("./User");
const simpleLogger = require("simple-node-logger");
const logger = simpleLogger.createSimpleLogger("project.log");
const DBlogger = simpleLogger.createSimpleLogger({
  logFilePath: "database.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});

class SystemInitializer {
  static serviceLayer;

  static async initSystem(serviceLayer, dbName) {
    this.serviceLayer = serviceLayer;
    let admin = new User(0, "admin", "admin", "ADMIN");
    this.serviceLayer.cinemaSystem.users.set(0, admin);
    //Turn database off
    //DataBase.testModeOn();

    let result = await DataBase.connectAndCreate(dbName ? dbName : undefined);
    if (typeof result === "string") {
      DBlogger.info(
        "CinemaSystem - initCinemaSystem - connectAndCreate - ",
        result
      );
      return "Server initialization error\n" + result;
    }
    result = await DataBase.initDB(dbName ? dbName : undefined);
    if (typeof result === "string") {
      DBlogger.info("CinemaSystem - initCinemaSystem - initDB -", result);
      return "Server initialization error\n" + result;
    }

    result = await DataBase.singleGetById("user", { id: 0 });
    if (typeof result === "string") {
      DBlogger.info(
        "CinemaSystem - initCinemaSystem - isAdminExists -",
        result
      );
      return "Server initialization error\n" + result;
    }
    if (result == null) {
      result = await admin.initUser();
      if (typeof result === "string") {
        DBlogger.info("CinemaSystem - initCinemaSystem - initUser -", result);
        return "Server initialization error\n" + result;
      }
    }
    admin.Loggedin = true;
    await SystemInitializer.restoreEmployees(admin.userName);
    await SystemInitializer.restoreCategories(admin.userName);
    await SystemInitializer.restoreMovies(admin.userName);
    /*SystemInitializer.restoreProducts(admin.userName);
    SystemInitializer.restoreSuppliers(admin.userName);
    SystemInitializer.restoreOrders(admin.userName);
    SystemInitializer.restoreMovieOrders(admin.userName);
    SystemInitializer.restoreProductOrders(admin.userName);*/
    admin.Loggedin = false;
  }

  static async restoreEmployees(admin) {
    let employees = await DataBase.singleFindAll("employee", {}, undefined, [
      ["id", "ASC"],
    ]);
    for (let i in employees) {
      let employee = employees[i];

      if (employee.isEmployeeRemoved === null) {
        let user = await DataBase.singleGetById("user", { id: employee.id });
        DataBase.testModeOn();
        await this.serviceLayer.addNewEmployee(
          user.username,
          user.password,
          employee.firstName,
          employee.lastName,
          user.permissions,
          employee.contactDetails,
          admin
        );
        DataBase.testModeOff();
      }
    }
  }
  static async restoreCategories(admin) {
    let categories = await DataBase.singleFindAll("category", {}, undefined, [
      ["id", "ASC"],
    ]);
    for (let i in categories) {
      let category = categories[i];

      if (category.isCategoryRemoved === null) {
        let parent;
        if (category.parentId != -1)
          parent = await DataBase.singleGetById("category", {
            id: category.parentId,
          });

        DataBase.testModeOn();
        await this.serviceLayer.addCategory(
          category.name,
          admin,
          parent ? parent.name : undefined
        );
        DataBase.testModeOff();
      }
    }
  }

  static async restoreMovies() {
    let movies = await DataBase.singleFindAll("movie", {}, undefined, [
      ["id", "ASC"],
    ]);
    for (let i in movies) {
      let movie = movies[i];

      if (movie.isMovieRemoved === null) {
        DataBase.testModeOn();
        await this.serviceLayer.addMovie(movie.name, movie.categoryId, admin);
        DataBase.testModeOff();
      }
    }
  }
  static async restoreProducts() {
    let products = await DataBase.singleFindAll("movie", {}, undefined, [
      ["id", "ASC"],
    ]);
    for (let i in products) {
      let product = products[i];

      if (product.isProductRemoved === null) {
        DataBase.testModeOn();
        await this.serviceLayer.addNewProduct(
          product.name,
          product.price,
          product.quantity,
          product.min.Quantity,
          product.maxQuantity,
          product.categoryId,
          admin
        );
        DataBase.testModeOff();
      }
    }
  }
  static async restoreSuppliers() {}
  static async restoreOrders() {}
  static async restoreMovieOrders() {}
  static async restoreProductOrders() {}
}
module.exports = SystemInitializer;
