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
    DataBase.testModeOn();

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
    await SystemInitializer.restoreProducts(admin.userName);
    await SystemInitializer.restoreSuppliers(admin.userName);
    await SystemInitializer.restoreOrders(admin.userName);
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
        let parentName;
        if (category.parentId != -1)
          parentName = this.serviceLayer.cinemaSystem.inventoryManagement.categories.get(
            category.parentId
          ).name;

        DataBase.testModeOn();
        await this.serviceLayer.addCategory(category.name, admin, parentName);
        DataBase.testModeOff();
      }
    }
  }

  static async restoreMovies(admin) {
    let movies = await DataBase.singleFindAll("movie", {}, undefined, [
      ["id", "ASC"],
    ]);
    for (let i in movies) {
      let movie = movies[i];

      if (movie.isMovieRemoved === null) {
        let categoryName = this.serviceLayer.cinemaSystem.inventoryManagement.categories.get(
          movie.categoryId
        ).name;
        DataBase.testModeOn();
        await this.serviceLayer.addMovie(movie.name, categoryName, admin);
        if (movie.movieKey !== null || movie.examinationRoom !== null) {
          await this.serviceLayer.editMovie(
            movie.name,
            categoryName,
            movie.movieKey,
            movie.examinationRoom,
            admin
          );
        }
        DataBase.testModeOff();
      }
    }
  }
  static async restoreProducts(admin) {
    let products = await DataBase.singleFindAll(
      "cafeteria_product",
      {},
      undefined,
      [["id", "ASC"]]
    );
    for (let i in products) {
      let product = products[i];

      if (product.isProductRemoved === null) {
        let categoryName = this.serviceLayer.cinemaSystem.inventoryManagement.categories.get(
          product.categoryId
        ).name;
        DataBase.testModeOn();
        await this.serviceLayer.addNewProduct(
          product.name,
          product.price,
          product.quantity,
          product.minQuantity,
          product.maxQuantity,
          categoryName,
          admin
        );
        DataBase.testModeOff();
      }
    }
  }
  static async restoreSuppliers(admin) {
    let suppliers = await DataBase.singleFindAll("supplier", {}, undefined, [
      ["id", "ASC"],
    ]);
    for (let i in suppliers) {
      let supplier = suppliers[i];

      if (supplier.isSupplierRemoved === null) {
        DataBase.testModeOn();
        await this.serviceLayer.addNewSupplier(
          supplier.name,
          supplier.contactDetails,
          admin
        );
        DataBase.testModeOff();
      }
    }
  }
  static async restoreOrders(admin) {
    let orders = await DataBase.singleFindAll("order", {}, undefined, [
      ["id", "ASC"],
    ]);
    for (let i in orders) {
      let order = orders[i];
      let supplierName = this.serviceLayer.cinemaSystem.inventoryManagement.suppliers.get(
        order.supplierId
      ).name;
      let movies = await DataBase.singleFindAll("movie_order", {
        orderId: order.id,
      });
      let movieList = movies.map(
        (e) =>
          this.serviceLayer.cinemaSystem.inventoryManagement.products.get(
            e.movieId
          ).name
      );
      let products = await DataBase.singleFindAll("cafeteria_product_order", {
        orderId: order.id,
      });
      let productList = products.map((e) => ({
        name: this.serviceLayer.cinemaSystem.inventoryManagement.products.get(
          e.productId
        ).name,
        quantity: e.expectedQuantity,
      }));
      DataBase.testModeOn();
      //TODO::add edit movie order with all the details after order supplied
      let result = await this.serviceLayer.addMovieOrder(
        order.id.toString(),
        order.date,
        supplierName,
        JSON.stringify(movieList),
        admin
      );
      //TODO::add edit movie order with all the details after order supplied
      result = await this.serviceLayer.addCafeteriaOrder(
        order.id.toString(),
        order.date,
        supplierName,
        JSON.stringify(productList),
        admin
      );

      DataBase.testModeOff();
    }
  }
}
module.exports = SystemInitializer;
