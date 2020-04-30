const data = require("../../consts/data");
const ReportController = require("./ReportController");
const User = require("./User");
const simpleLogger = require("simple-node-logger");
const logger = simpleLogger.createSimpleLogger("project.log");
const InventoryManagement = require("./InventoryManagement");
const EmployeeManagement = require("./EmployeeManagement");

class CinemaSystem {
  constructor() {
    this.users = new Map();
    this.inventoryManagement = new InventoryManagement();
    this.employeeManagement = new EmployeeManagement();
    this.userOfflineMsg =
      "The operation cannot be completed - the user is not connected to the system";
    this.inappropriatePermissionsMsg = "User does not have proper permissions";
    this.convertionMethods = {
      inventory_daily_report: (record) => {
        record.productName = this.inventoryManagement.products.get(
          record.productId
        ).name;
        record = this.employeeAndDateConvertion(record);
        return record;
      },
      general_purpose_daily_report: (record) =>
        this.employeeAndDateConvertion(record),
      incomes_daily_report: (record) => this.employeeAndDateConvertion(record),
    };
  }

  creatorEmployeeConvertion(record) {
    if (record.creatorEmployeeId !== null) {
      let employee = this.employeeManagement.employeeDictionary.get(
        record.creatorEmployeeId
      );
      record.creatorEmployeeName = employee.firstName + " " + employee.lastName;
    }
    return record;
  }

  employeeAndDateConvertion(record) {
    record.date = record.date.toDateString();
    record = this.creatorEmployeeConvertion(record);
    return record;
  }

  UserDetailsCheck(userName, password, permissions) {
    let err = "";
    if (userName === undefined || userName === "") err += "User name ";
    if (password === undefined || password === "") {
      if (err !== "") err += ", ";
      err += "Password ";
    }
    if (
      permissions === undefined ||
      !User.getPermissionTypeList().hasOwnProperty(permissions)
    ) {
      if (err !== "") err += ", ";
      err += "Permission ";
    }
    if (err !== "") err = "The following data provided is invalid: " + err;
    return err;
  }

  isLoggedin(userId) {
    if (!this.users.has(userId)) return "The user isn't exists";
    return this.users.get(userId).isLoggedin();
  }

  login(userName, password, userId) {
    if (!this.users.has(userId)) return "The user isn't exists";
    return this.users.get(userId).login(userName, password);
  }

  logout(userId) {
    if (!this.users.has(userId)) return "The user isn't exists";
    return this.users.get(userId).logout();
  }
  //notes- checkuser
  async addNewEmployee(
    userID,
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation,
    isPasswordHashed
  ) {
    if (this.users.has(userID)) return "The id is already exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    ) {
      logger.info("CinemaSystem - addNewEmployee - " + this.userOfflineMsg);
      return this.userOfflineMsg;
    }
    const argCheckRes = this.UserDetailsCheck(userName, password, permissions);
    if (argCheckRes !== "") {
      logger.info("CinemaSystem - addNewEmployee - " + argCheckRes);
      return argCheckRes;
    }
    //If the operator does not have the permission of a deputy manager or if he is not admin and also tries to add someone his own higher permission.
    if (
      !this.users
        .get(ActionIDOfTheOperation)
        .permissionCheck("DEPUTY_MANAGER") ||
      (this.users.get(ActionIDOfTheOperation).getPermissionValue() <=
        User.getPermissionTypeList[permissions] &&
        this.users.get(ActionIDOfTheOperation).getPermissionValue() !==
          User.getPermissionTypeList["ADMIN"])
    ) {
      logger.info(
        "CinemaSystem - addNewEmployee - " +
          userName +
          " " +
          this.inappropriatePermissionsMsg
      );
      return this.inappropriatePermissionsMsg;
    }
    let employee = await this.employeeManagement.addNewEmployee(
      userID,
      userName,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      isPasswordHashed
    );
    if (typeof employee === "string") {
      return employee;
    }
    this.users.set(userID, employee);
    return "The employee added successfully.";
  }

  async editEmployee(
    employeeID,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    if (!this.users.has(employeeID)) return "The id is not exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    ) {
      logger.info("CinemaSystem - editEmployee - " + this.userOfflineMsg);
      return this.userOfflineMsg;
    }
    if (
      !this.users
        .get(ActionIDOfTheOperation)
        .permissionCheck("DEPUTY_MANAGER") &&
      ActionIDOfTheOperation !== employeeID
    ) {
      logger.info(
        "CinemaSystem - editEmployee - " +
          employeeID +
          " " +
          this.inappropriatePermissionsMsg
      );
      return this.inappropriatePermissionsMsg;
    }
    return await this.employeeManagement.editEmployee(
      employeeID,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails
    );
  }

  async deleteEmployee(employeeID, ActionIDOfTheOperation) {
    if (!this.users.has(employeeID)) return "The id is not exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    ) {
      logger.info("CinemaSystem - deleteEmployee - " + this.userOfflineMsg);
      return this.userOfflineMsg;
    }
    if (
      !this.users.get(ActionIDOfTheOperation).permissionCheck("DEPUTY_MANAGER")
    ) {
      logger.info(
        "CinemaSystem - deleteEmployee - " + this.inappropriatePermissionsMsg
      );
      return this.inappropriatePermissionsMsg;
    }
    if (employeeID === ActionIDOfTheOperation) {
      logger.info(
        "CinemaSystem - deleteEmployee - A user cannot erase himself"
      );
      return "A user cannot erase himself";
    }
    if (this.users.get(employeeID).isLoggedin()) {
      logger.info(
        "CinemaSystem - deleteEmployee - A user cannot delete a logged in user"
      );
      return "You cannot delete a logged in user";
    }
    let res = await this.employeeManagement.deleteEmployee(employeeID);
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(employeeID);
    return res;
  }

  checkUser(ActionIDOfTheOperation, permissionRequired, functionName) {
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    ) {
      logger.info(
        "CinemaSystem - " + functionName + " - " + this.userOfflineMsg
      );
      return this.userOfflineMsg;
    }
    if (
      !this.users
        .get(ActionIDOfTheOperation)
        .permissionCheck(permissionRequired)
    ) {
      logger.info(
        "CinemaSystem - " +
          functionName +
          " - " +
          this.inappropriatePermissionsMsg
      );
      return this.inappropriatePermissionsMsg;
    }
    return null;
  }

  async addMovieOrder(
    orderId,
    date,
    supplierId,
    movieIdList,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addMovieOrder"
    );
    if (result != null) return result;
    if (
      !this.employeeManagement.employeeDictionary.has(ActionIDOfTheOperation)
    ) {
      logger.info(
        "CinemaSystem - addMovieOrder - Cannot add order - creator employee id " +
          ActionIDOfTheOperation +
          " is not exist"
      );
      return "Cannot add order - creator employee id is not exist";
    }
    return this.inventoryManagement.addMovieOrder(
      orderId,
      date,
      supplierId,
      movieIdList,
      ActionIDOfTheOperation
    );
  }

  async removeOrder(orderId, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeOrder"
    );
    if (result != null) return result;
    return this.inventoryManagement.removeOrder(orderId);
  }

  async addCafeteriaOrder(
    orderId,
    date,
    supplierId,
    productsList,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addCafeteriaOrder"
    );
    if (result != null) return result;
    if (
      !this.employeeManagement.employeeDictionary.has(ActionIDOfTheOperation)
    ) {
      logger.info(
        "CinemaSystem - addCafeteriaOrder - Cannot add order - creator employee id " +
          ActionIDOfTheOperation +
          " is not exist"
      );
      return "Cannot add order - creator employee id is not exist";
    }
    return this.inventoryManagement.addCafeteriaOrder(
      orderId,
      date,
      supplierId,
      productsList,
      ActionIDOfTheOperation
    );
  }

  async addMovie(movieId, movieName, categoryId, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addMovie"
    );
    if (result != null) return result;
    return this.inventoryManagement.addMovie(movieId, movieName, categoryId);
  }

  //TODO
  async editMovie(
    movieID,
    categoryId,
    key,
    examinationRoom,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "editMovie"
    );
    if (result != null) return result;
    return this.inventoryManagement.editMovie(
      movieID,
      categoryId,
      key,
      examinationRoom
    );
  }

  async removeMovie(movieID, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeMovie"
    );
    if (result != null) return result;
    return this.inventoryManagement.removeMovie(movieID);
  }

  async addNewSupplier(
    supplierID,
    supplierName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addNewSupplier"
    );
    if (result != null) return result;
    return this.inventoryManagement.addNewSupplier(
      supplierID,
      supplierName,
      contactDetails
    );
  }

  async editSupplier(
    supplierID,
    supplierName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "editSupplier"
    );
    if (result != null) return result;
    return this.inventoryManagement.editSupplier(
      supplierID,
      supplierName,
      contactDetails
    );
  }

  async removeSupplier(supplierID, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeSupplier"
    );
    if (result != null) return result;
    return this.inventoryManagement.removeSupplier(supplierID);
  }

  async addCafeteriaProduct(
    productId,
    name,
    categoryID,
    price,
    quantity,
    maxQuantity,
    minQuantity,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addCafeteriaProduct"
    );
    if (result != null) return result;
    return await this.inventoryManagement.addCafeteriaProduct(
      productId,
      name,
      categoryID,
      price,
      quantity,
      maxQuantity,
      minQuantity
    );
  }

  async editCafeteriaProduct(
    productId,
    categoryId,
    price,
    quantity,
    maxQuantity,
    minQuantity,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "editCafeteriaProduct"
    );
    if (result != null) return result;
    return await this.inventoryManagement.editCafeteriaProduct(
      productId,
      categoryId,
      price,
      quantity,
      maxQuantity,
      minQuantity
    );
  }

  async removeCafeteriaProduct(productId, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeCafeteriaProduct"
    );
    if (result != null) return result;
    return await this.inventoryManagement.removeCafeteriaProduct(productId);
  }

  async addCategory(
    categoryId,
    categoryName,
    parentID,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addCategory"
    );
    if (result != null) return result;
    return await this.inventoryManagement.addCategory(
      categoryId,
      categoryName,
      parentID
    );
  }

  async editCategory(categoryId, parentID, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "editCategory"
    );
    if (result != null) return result;
    return await this.inventoryManagement.editCategory(categoryId, parentID);
  }
  async removeCategory(categoryId, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeCategory"
    );
    if (result != null) return result;
    return await this.inventoryManagement.removeCategory(categoryId);
  }

  /**
   * Remove field from general purpose daily report
   * @param {string} fieldToRemove The field to remove
   * @param {string} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} success or failure
   */
  async removeFieldFromDailyReport(fieldToRemove, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeFieldFromDailyReport"
    );
    if (result != null) return result;
    return ReportController.removeFieldFromDailyReport(fieldToRemove);
  }

  /**
   * Add new field to general purpose daily report
   * @param {string} newField The field to add
   * @param {string} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} success or failure
   */
  async addFieldToDailyReport(newField, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addFieldToDailyReport"
    );
    if (result != null) return result;
    return ReportController.addFieldToDailyReport(newField);
  }

  /**
   * @param {string} type Type of report from _types
   * @param {Array(Object)} records Records to add in the report
   * @param {string} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} success or failure
   */
  async createDailyReport(type, records, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "SHIFT_MANAGER",
      "createDailyReport"
    );
    if (result != null) return result;
    if (
      !this.employeeManagement.employeeDictionary.has(ActionIDOfTheOperation)
    ) {
      logger.info(
        "CinemaSystem - createDailyReport - Cannot create report - creator employee id " +
          ActionIDOfTheOperation +
          " is not exist"
      );
      return "Cannot create report - creator employee id is not exist";
    }
    return ReportController.createDailyReport(type, records);
  }

  /**
   * @param {string} type Type of the report
   * @param {string} date Date of the report
   * @param {string} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(Array(Object) | string)} In success returns list of records from the report,
   * otherwise returns error string.
   */
  async getReport(type, date, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "getReport"
    );
    if (result != null) return result;
    result = await ReportController.getReport(type, date);
    if (typeof result !== "string")
      for (let i in result) result[i] = this.convertionMethods[type](result[i]);
    return result;
  }

  getSuppliers() {
    return this.inventoryManagement.getSuppliers();
  }
  getEmployees() {
    return this.employeeManagement.getEmployees();
  }
  getCategories() {
    return this.inventoryManagement.getCategories();
  }
  getCafeteriaProducts() {
    return this.inventoryManagement.getCafeteriaProducts();
  }
  getInventoryProducts() {
    return this.inventoryManagement.getInventoryProducts();
  }
  getMovies() {
    return this.inventoryManagement.getMovies();
  }

  getSupplierDetails(supplierID) {
    return this.inventoryManagement.getSupplierDetails(supplierID);
  }

  getEmployeeDetails(employeeID) {
    return this.employeeManagement.getEmployeeDetails(employeeID);
  }

  getOrderDetails(orderId) {
    return this.inventoryManagement.getOrderDetails(orderId);
  }

  getMovieDetails(movieID) {
    return this.inventoryManagement.getMovieDetails(movieID);
  }

  getCafeteriaProductDetails(productID) {
    return this.inventoryManagement.getCafeteriaProductDetails(productID);
  }

  getReportTypes() {
    //TODO: IMPLEMENT THIS.
    return data.dataExample;
  }

  getProductsAndQuantityByOrder(orderId) {
    return this.inventoryManagement.getProductsAndQuantityByOrder(orderId);
  }

  getProductsByOrder(orderId) {
    return this.inventoryManagement.getProductsByOrder(orderId);
  }

  getOrdersByDates(startDate, endDate) {
    return this.inventoryManagement.getOrdersByDates(startDate, endDate);
  }

  getCategoryDetails(categotyId) {
    return this.inventoryManagement.getCategoryDetails(categotyId);
  }
}

module.exports = CinemaSystem;
