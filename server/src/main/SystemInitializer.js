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
    if (typeof result === "string") return this.errorHandler(result);
    result = await DataBase.initDB(dbName ? dbName : undefined);
    if (typeof result === "string") {
      DBlogger.info("CinemaSystem - initCinemaSystem - initDB -", result);
      return "Server initialization error\n" + result;
    }

    result = await DataBase.singleGetById("user", { id: 0 });
    if (typeof result === "string") return this.errorHandler(result);
    if (result == null) {
      result = await admin.initUser();
      if (typeof result === "string") return this.errorHandler(result);
    }

    let err;
    if ((err = await SystemInitializer.restoreEmployees(admin))) return err;
    if ((err = await SystemInitializer.restoreCategories(admin))) return err;
    if ((err = await SystemInitializer.restoreMovies(admin))) return err;
    if ((err = await SystemInitializer.restoreProducts(admin))) return err;
    if ((err = await SystemInitializer.restoreSuppliers(admin))) return err;
    if ((err = await SystemInitializer.restoreOrders())) return err;
  }

  static async restoreEmployees(admin) {
    let employees = await DataBase.singleFindAll("employee", {}, undefined, [
      ["id", "ASC"],
    ]);
    if (typeof employees === "string")
      return this.errorHandler(employees, "restoreEmployees - employees");

    for (let i in employees) {
      let employee = employees[i];

      if (employee.isEmployeeRemoved === null) {
        let user = await DataBase.singleGetById("user", { id: employee.id });
        if (typeof user === "string")
          return this.errorHandler(user, "restoreEmployees - user");
        await this.executeActionInSystem(admin, async () => {
          await this.serviceLayer.addNewEmployee(
            user.username,
            user.password,
            employee.firstName,
            employee.lastName,
            user.permissions,
            employee.contactDetails,
            admin.userName,
            true
          );
        });
      } else this.serviceLayer.userCounter = employee.id + 1;
    }
  }
  static async restoreCategories(admin) {
    let categories = await DataBase.singleFindAll("category", {}, undefined, [
      ["id", "ASC"],
    ]);
    if (typeof categories === "string")
      return this.errorHandler(categories, "restoreCategories - categories");
    for (let i in categories) {
      let category = categories[i];

      if (category.isCategoryRemoved === null) {
        let parentName;
        if (category.parentId != -1)
          parentName = this.serviceLayer.cinemaSystem.inventoryManagement.categories.get(
            category.parentId
          ).name;

        await this.executeActionInSystem(admin, async () => {
          await this.serviceLayer.addCategory(
            category.name,
            admin.userName,
            parentName
          );
        });
      } else this.serviceLayer.categoriesCounter = category.id + 1;
    }
  }

  static async restoreMovies(admin) {
    let movies = await DataBase.singleFindAll("movie", {}, undefined, [
      ["id", "ASC"],
    ]);
    if (typeof movies === "string")
      return this.errorHandler(movies, "restoreMovies - movies");
    for (let i in movies) {
      let movie = movies[i];

      if (movie.isMovieRemoved === null) {
        let categoryName = this.serviceLayer.cinemaSystem.inventoryManagement.categories.get(
          movie.categoryId
        ).name;
        await this.executeActionInSystem(admin, async () => {
          await this.serviceLayer.addMovie(
            movie.name,
            categoryName,
            admin.userName
          );
          if (movie.movieKey !== null || movie.examinationRoom !== null) {
            await this.serviceLayer.editMovie(
              movie.name,
              categoryName,
              movie.movieKey,
              movie.examinationRoom,
              admin.userName
            );
          }
        });
      } else this.serviceLayer.productsCounter = movie.id + 1;
    }
  }
  static async restoreProducts(admin) {
    let products = await DataBase.singleFindAll(
      "cafeteria_product",
      {},
      undefined,
      [["id", "ASC"]]
    );
    if (typeof products === "string")
      return this.errorHandler(products, "restoreProducts - products");
    for (let i in products) {
      let product = products[i];

      if (product.isProductRemoved === null) {
        let categoryName = this.serviceLayer.cinemaSystem.inventoryManagement.categories.get(
          product.categoryId
        ).name;
        await this.executeActionInSystem(admin, async () => {
          await this.serviceLayer.addNewProduct(
            product.name,
            product.price,
            product.quantity,
            product.minQuantity,
            product.maxQuantity,
            categoryName,
            admin.userName
          );
        });
      } else this.serviceLayer.productsCounter = product.id + 1;
    }
  }
  static async restoreSuppliers(admin) {
    let suppliers = await DataBase.singleFindAll("supplier", {}, undefined, [
      ["id", "ASC"],
    ]);
    if (typeof suppliers === "string")
      return this.errorHandler(suppliers, "restoreSuppliers - suppliers");
    for (let i in suppliers) {
      let supplier = suppliers[i];
      if (supplier.isSupplierRemoved === null) {
        await this.executeActionInSystem(admin, async () => {
          let result = await this.serviceLayer.addNewSupplier(
            supplier.name,
            supplier.contactDetails,
            admin.userName
          );
        });
      } else this.serviceLayer.supplierCounter = supplier.id + 1;
    }
  }
  static async restoreOrders() {
    let orders = await DataBase.singleFindAll("order", {}, undefined, [
      ["id", "ASC"],
    ]);
    if (typeof orders === "string")
      return this.errorHandler(orders, "restoreOrders - orders");
    for (let i in orders) {
      let order = orders[i];
      let supplierName = this.serviceLayer.cinemaSystem.inventoryManagement.suppliers.get(
        order.supplierId
      ).name;
      let creatorEmployee = this.serviceLayer.cinemaSystem.employeeManagement.employeeDictionary.get(
        order.creatorEmployeeId
      );
      let creatorEmployeeName = creatorEmployee.userName;
      let movies = await DataBase.singleFindAll("movie_order", {
        orderId: order.id,
      });
      if (typeof movies === "string")
        return this.errorHandler(movies, "restoreOrders - movies");
      let movieList = movies.map(
        (e) =>
          this.serviceLayer.cinemaSystem.inventoryManagement.products.get(
            e.movieId
          ).name
      );
      let products = await DataBase.singleFindAll("cafeteria_product_order", {
        orderId: order.id,
      });
      if (typeof products === "string")
        return this.errorHandler(products, "restoreOrders - products");
      let productList = products.map((e) => ({
        name: this.serviceLayer.cinemaSystem.inventoryManagement.products.get(
          e.productId
        ).name,
        quantity: e.expectedQuantity,
      }));
      await this.executeActionInSystem(creatorEmployee, async () => {
        //TODO::add edit movie order with all the details after order supplied
        if (movieList.length != 0)
          await this.serviceLayer.addMovieOrder(
            order.id.toString(),
            order.date,
            supplierName,
            movieList,
            creatorEmployeeName
          );
        //TODO::add edit movie order with all the details after order supplied
        if (productList.length != 0)
          await this.serviceLayer.addCafeteriaOrder(
            order.id.toString(),
            order.date,
            supplierName,
            productList,
            creatorEmployeeName
          );
      });
    }
  }

  static errorHandler(result, info) {
    DBlogger.info(
      "SystemInitializer - initSystem - " + info ? info + " - " : "",
      result
    );
    return "Server initialization error\n" + result;
  }

  static async executeActionInSystem(user, method) {
    DataBase.testModeOn();
    user.Loggedin = true;
    await method();
    user.Loggedin = false;
    DataBase.testModeOff();
  }
}
module.exports = SystemInitializer;
