const ReportController = require("./ReportController");
const User = require("./User");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const InventoryManagement = require("./InventoryManagement");
const EmployeeManagement = require("./EmployeeManagement");
const moment = require("moment");

class CinemaSystem {
  constructor() {
    this.users = new Map();
    this.inventoryManagement = new InventoryManagement();
    this.employeeManagement = new EmployeeManagement();
    this.userOfflineMsg =
      "The operation cannot be completed - the user is not connected to the system";
    this.inappropriatePermissionsMsg = "User does not have proper permissions";
    this.toUserConversionMethods = {
      inventory_daily_report: async (record) => {
        record.productName = this.inventoryManagement.products.get(
          record.productId
        ).name;
        record = this.employeeAndDateConversion(record);
        return record;
      },
      general_purpose_daily_report: async (record) => {
        let keys = Object.keys(record.propsObject);
        for (let i in keys) {
          let propName = keys[i];
          record[propName] = record.propsObject[propName];
        }
        record.props = await this.getAllGeneralReportProps();
        record = this.employeeAndDateConversion(record);
        return record;
      },
      incomes_daily_report: async (record) =>
        this.employeeAndDateConversion(record),
      movies_daily_report: async (record) => {
        record.date = moment(record.date).format("llll");
        return record;
      },
    };
    this.toDBConversionMethods = {
      inventory_daily_report: async (records) => {
        for (let i in records) {
          let record = records[i];
          if (!record.quantitySold || !record.stockThrown) {
            logger.writeToLog(
              "info",
              "CinemaSystem",
              "createDailyReport",
              "toDBConversionMethods[inventory_daily_report] - Report content is invalid"
            );
            return "Report content structure is invalid";
          }
          if (
            isNaN(parseInt(record.quantitySold)) ||
            isNaN(parseInt(record.stockThrown)) ||
            parseInt(record.quantitySold) < 0 ||
            parseInt(record.stockThrown) < 0
          ) {
            logger.writeToLog(
              "info",
              "CinemaSystem",
              "createDailyReport",
              "toDBConversionMethods[inventory_daily_report] - negative numbers are invalid"
            );
            return "Only non-negative numbers are allowed in inventory report";
          }

          let product = this.inventoryManagement.products.get(record.productId);
          let oldQuantity = product.quantity;
          let currentQuantity =
            oldQuantity -
            parseInt(record.quantitySold) -
            parseInt(record.stockThrown);
          let result = await this.inventoryManagement.editCafeteriaProduct(
            record.productId,
            product.categoryId,
            product.price,
            currentQuantity
          );
          if (result !== "Product details update successfully completed")
            return (
              "Problem occurred while editing products quantities (you should check the quantity in stock).\n" +
              result
            );
          record.quantityInStock = currentQuantity;
          records[i] = record;
        }
        return records;
      },
      general_purpose_daily_report: async (records) => {
        let props = await this.getGeneralReportProps();
        if (typeof props === "string") return props;
        for (let i in records) {
          let record = records[i];
          record.propsObject = {};
          for (let j in props) {
            if (!record[props[j]]) {
              logger.writeToLog(
                "info",
                "CinemaSystem",
                "createDailyReport",
                "toDBConversionMethods[general_purpose_daily_report] - Report content is invalid"
              );
              return "Report content is invalid";
            }
            record.propsObject[props[j]] = record[props[j]];
            delete record[props[j]];
          }
          record.allProps = await this.getAllGeneralReportProps();
          if (typeof record.allProps === "string") return record.allProps;
          record.currentProps = props;
          records[i] = record;
        }
        return records;
      },
      incomes_daily_report: async (records) => {
        for (let i in records) {
          let record = records[i];
          if (
            !record.numOfTabsSales ||
            !record.cafeteriaCashRevenues ||
            !record.cafeteriaCreditCardRevenues ||
            !record.ticketsCashRevenues ||
            !record.ticketsCreditCardRevenues ||
            !record.tabsCashRevenues ||
            !record.tabsCreditCardRevenues
          ) {
            logger.writeToLog(
              "info",
              "CinemaSystem",
              "createDailyReport",
              " toDBConversionMethods[incomes_daily_report] - Report content is invalid"
            );
            return "Report content structure is invalid";
          }
          if (
            parseInt(record.numOfTabsSales) < 0 ||
            isNaN(parseInt(record.numOfTabsSales)) ||
            isNaN(parseFloat(record.cafeteriaCashRevenues)) ||
            isNaN(parseFloat(record.cafeteriaCreditCardRevenues)) ||
            isNaN(parseFloat(record.ticketsCashRevenues)) ||
            isNaN(parseFloat(record.ticketsCreditCardRevenues)) ||
            isNaN(parseFloat(record.tabsCashRevenues)) ||
            isNaN(parseFloat(record.tabsCreditCardRevenues)) ||
            parseFloat(record.cafeteriaCashRevenues) < 0 ||
            parseFloat(record.cafeteriaCreditCardRevenues) < 0 ||
            parseFloat(record.ticketsCashRevenues) < 0 ||
            parseFloat(record.ticketsCreditCardRevenues) < 0 ||
            parseFloat(record.tabsCashRevenues) < 0 ||
            parseFloat(record.tabsCreditCardRevenues) < 0
          ) {
            logger.writeToLog(
              "info",
              "CinemaSystem",
              "createDailyReport",
              "toDBConversionMethods[incomes_daily_report] - negative numbers are invalid"
            );
            return "Only non-negative numbers are allowed in incomes report";
          }
        }
        return records;
      },
    };
  }

  isValidReportType = (type) => ReportController._isValidType(type);

  getGeneralReportProps = async () =>
    ReportController.getCurrentGeneralDailyReportFormat();

  getAllGeneralReportProps = async () =>
    ReportController.getAllGeneralDailyReportFormat();

  creatorEmployeeConversion(record) {
    if (record.creatorEmployeeId !== null) {
      let employee = this.employeeManagement.employeeDictionary.get(
        record.creatorEmployeeId
      );
      record.creatorEmployeeName = employee.firstName + " " + employee.lastName;
    }
    return record;
  }

  employeeAndDateConversion(record) {
    record.date = record.date.toDateString();
    record = this.creatorEmployeeConversion(record);
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

  isLoggedIn(userId) {
    if (!this.users.has(userId)) return "The user isn't exists";
    return this.users.get(userId).isLoggedIn();
  }
  /**
   * User connect to system
   * @param {Number} userId Unique ID of user
   * @param {String} userName Employee username (must be unique)
   * @param {String} password
   * @returns {string} Success or failure string
   **/
  login(userName, password, userId) {
    if (!this.users.has(userId)) return "The user isn't exists";
    return this.users.get(userId).login(userName, password);
  }
  /**
   * User disconnect to system
   * @param {Number} userId Unique ID of user
   * @returns {Promise(string)} Success or failure string
   **/
  logout(userId) {
    if (!this.users.has(userId)) return "The user isn't exists";
    return this.users.get(userId).logout();
  }
  /**
   * Add a new employee to the system. This operation also adds user to the system.
   * @param {Number} userID Unique ID of user
   * @param {String} userName Employee username (unique)
   * @param {String} password
   * @param {String} permissions Permissions that must be one of the permissions types in the system
   * @param {String} firstName First name of employee
   * @param {String} lastName Employee last name
   * @param {String} contactDetails Ways of communicating with the employee
   * @param {Number} ActionIDOfTheOperation The employee ID that performed the action
   * @param {Boolean} isPasswordHashed If the code has already been encrypted (system internal parameter)
   * @returns {Promise(string)} Success or failure string
   **/
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
      !this.users.get(ActionIDOfTheOperation).isLoggedIn()
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addNewEmployee",
        this.userOfflineMsg
      );
      return this.userOfflineMsg;
    }
    const argCheckRes = this.UserDetailsCheck(userName, password, permissions);
    if (argCheckRes !== "") {
      logger.writeToLog("info", "CinemaSystem", "addNewEmployee", argCheckRes);
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
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addNewEmployee",
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
  /**
   * Edit employee data.
   * @param {Number} employeeID Unique ID of user
   * @param {String} password
   * @param {String} permissions Permissions that must be one of the permissions types in the system
   * @param {String} firstName First name of employee
   * @param {String} lastName Employee last name
   * @param {String} contactDetails Ways of communicating with the employee
   * @param {Number} ActionIDOfTheOperation The employee ID that performed the action
   * @returns {Promise(string)} Success or failure string
   **/
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
      !this.users.get(ActionIDOfTheOperation).isLoggedIn()
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "editEmployee",
        this.userOfflineMsg
      );
      return this.userOfflineMsg;
    }
    if (
      !this.users
        .get(ActionIDOfTheOperation)
        .permissionCheck("DEPUTY_MANAGER") &&
      ActionIDOfTheOperation !== employeeID
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "editEmployee",
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
  /**
   * Delete employee from system.
   * @param {Number} employeeID Unique ID of user
   * @param {Number} ActionIDOfTheOperation The employee ID that performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async deleteEmployee(employeeID, ActionIDOfTheOperation) {
    if (!this.users.has(employeeID)) return "The id is not exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedIn()
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "deleteEmployee",
        this.userOfflineMsg
      );
      return this.userOfflineMsg;
    }
    if (
      !this.users.get(ActionIDOfTheOperation).permissionCheck("DEPUTY_MANAGER")
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "deleteEmployee",
        this.inappropriatePermissionsMsg
      );
      return this.inappropriatePermissionsMsg;
    }
    if (employeeID === ActionIDOfTheOperation) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "deleteEmployee",
        "A user cannot erase himself"
      );
      return "A user cannot erase himself";
    }
    if (this.users.get(employeeID).isLoggedIn()) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "deleteEmployee",
        "A user cannot delete a logged in user"
      );
      return "You cannot delete a logged in user";
    }
    let res = await this.employeeManagement.deleteEmployee(employeeID);
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(employeeID);
    return res;
  }
  /**
   * Private function - Check whether the user performing the action has the appropriate permissions and data to perform an action
   * @param {string} functionName Date the order was performed
   * @param {string} permissionRequired
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {boolean} Success or failure string
   **/
  checkUser(ActionIDOfTheOperation, permissionRequired, functionName) {
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedIn()
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "checkUser",
        this.userOfflineMsg
      );
      return this.userOfflineMsg;
    }
    if (
      !this.users
        .get(ActionIDOfTheOperation)
        .permissionCheck(permissionRequired)
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "checkUser",
        this.inappropriatePermissionsMsg
      );
      return this.inappropriatePermissionsMsg;
    }
    return null;
  }
  /**
   * Add new order of movies to the system
   * @param {number} orderId
   * @param {string} date Date the order was performed
   * @param {number} supplierId
   * @param {Array(number)} moviesList List of movies in the order (list of movie's id)
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async addMovieOrder(
    orderId,
    date,
    supplierId,
    movieIdList,
    ActionIDOfTheOperation,
    orderName
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
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addMovieOrder",
        "Cannot add order - creator employee id " +
          ActionIDOfTheOperation +
          " is not exist"
      );
      return "Cannot create order - only employees can create orders";
    }
    return this.inventoryManagement.addMovieOrder(
      orderId,
      date,
      supplierId,
      movieIdList,
      ActionIDOfTheOperation,
      orderName
    );
  }

  /**
   * Remove order from the system and from DB
   * @param {number} orderId Order unique id
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async removeOrder(orderId, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeOrder"
    );
    if (result != null) return result;
    return this.inventoryManagement.removeOrder(orderId);
  }
  /**
   * Add new order of cafeteria products to the system
   * @param {number} orderId
   * @param {string} date Date the order was performed
   * @param {number} supplierId
   * @param {Array(Object)} productsList List of products in the order (list of object: {productId: 0, quantity:3})
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async addCafeteriaOrder(
    orderId,
    date,
    supplierId,
    productsList,
    ActionIDOfTheOperation,
    orderName
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
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addCafeteriaOrder",
        "Cannot add order - creator employee id " +
          ActionIDOfTheOperation +
          " is not exist"
      );
      return "Cannot create order - only employees can create orders";
    }
    return this.inventoryManagement.addCafeteriaOrder(
      orderId,
      date,
      supplierId,
      productsList,
      ActionIDOfTheOperation,
      orderName
    );
  }
  /**
   * edit the order
   * @param {string} orderId Unique ID of edit invitation
   * @param {string} date New date of the order if exists
   * @param {string} supplierId New supplier Id of the order if exists
   * @param {Array(Objects)} productsList List of objects with the data for each product change (must contain unique identifier of the product)
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async editOrder(
    orderId,
    date,
    supplierId,
    productsList,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "editOrder"
    );
    if (result != null) return result;
    return this.inventoryManagement.editOrder(
      orderId,
      date,
      supplierId,
      productsList
    );
  }
  /**
   * Confirmation of the order received by an employee
   * @param {Number} orderId Unique ID of order
   * @param {Array(Objects)} productsList List of objects with the id of the product and actual quantity that gotten.
   * @param {Number} recipientEmployeeId Unique identifier of the employee who received the order
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async confirmOrder(orderId, productsList, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "SHIFT_MANAGER",
      "editOrder"
    );
    if (result != null) return result;
    if (
      !this.employeeManagement.employeeDictionary.has(ActionIDOfTheOperation)
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "confirmOrder",
        "Cannot confirm order - creator employee id " +
          ActionIDOfTheOperation +
          " is not exist"
      );
      return "Cannot confirm order - only employees can confirm orders";
    }
    return this.inventoryManagement.confirmOrder(
      orderId,
      productsList,
      ActionIDOfTheOperation
    );
  }

  /**
   * Add new movie to the system
   * @param {number} movieId
   * @param {string} movieName
   * @param {number} category  Movie category id
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async addMovie(movieId, movieName, categoryId, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "addMovie"
    );
    if (result != null) return result;
    return this.inventoryManagement.addMovie(movieId, movieName, categoryId);
  }

  /**
   * @param {number} movieID
   * @param {number} category  Movie category id
   * @param {string} key Movie special key
   * @param {string} examinationRoom The room the movie was checked
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
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
  /**
   * Remove movie from the system - not from DB
   * @param {number} movieID
   * @param {string} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async removeMovie(movieID, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeMovie"
    );
    if (result != null) return result;
    return this.inventoryManagement.removeMovie(movieID);
  }

  /**
   * Add new supplier to the system
   * @param {number} supplierID
   * @param {string} supplierName
   * @param {string} contactDetails
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
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

  /**
   * @param {number} supplierID
   * @param {string} supplierName
   * @param {string} contactDetails
   * @param {number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
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
  /**
   * Remove supplier from the system - not from DB
   * @param {number} supplierID
   * @param {Number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async removeSupplier(supplierID, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeSupplier"
    );
    if (result != null) return result;
    return this.inventoryManagement.removeSupplier(supplierID);
  }
  /**
   * Add a new cafeteria product to the system
   * @param {Number} productId Unique ID of cafeteria product
   * @param {String} name The name of the product
   * @param {Number} categoryID Identifier of the category to which the product belongs
   * @param {Number} price The price of the product
   * @param {Number} quantity Quantity of new product in stock
   * @param {Number} maxQuantity Maximum limit of product quantity in stock (Optional parameter)
   * @param {Number} minQuantity Minimum limit of product quantity in stock (Optional parameter)
   * @param {Number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
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
    if (isNaN(price) && typeof price !== "number") {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addCafeteriaProduct",
        " Product price must be number"
      );
      return (
        "Add new product fail - Product price " + price + " must be number "
      );
    }
    if (isNaN(quantity) && typeof quantity !== "number") {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addCafeteriaProduct",
        "Product quantity must be number"
      );
      return "Add new product fail - Product quantity must be number ";
    }
    if (
      (isNaN(minQuantity) && typeof minQuantity !== "number") ||
      typeof minQuantity === "undefined"
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addCafeteriaProduct",
        "add new product fail - Product minQuantity must be number"
      );
      return "Add new product fail - Product minQuantity must be number ";
    }
    if (
      (isNaN(maxQuantity) && typeof maxQuantity !== "number") ||
      typeof maxQuantity === "undefined"
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "addCafeteriaProduct",
        "add new product fail - Product maxQuantity must be number"
      );
      return "Add new product fail - Product maxQuantity must be number ";
    }
    return await this.inventoryManagement.addCafeteriaProduct(
      productId,
      name,
      categoryID,
      parseInt(price),
      parseInt(quantity),
      parseInt(maxQuantity),
      parseInt(minQuantity)
    );
  }
  /**
   * Editing the cafeteria product
   * @param {Number} productId Unique ID of cafeteria product
   * @param {Number} categoryID Identifier of the new category to which the product belongs (Optional parameter)
   * @param {String} price The new price of the product (Optional parameter)
   * @param {String} quantity New quantity of product in stock (Optional parameter)
   * @param {String} maxQuantity New maximum limit of product quantity in stock (Optional parameter)
   * @param {String} minQuantity New minimum limit of product quantity in stock (Optional parameter)
   * @param {String} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
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
  /**
   * Remove the cafeteria product
   * @param {Number} productId Unique ID of cafeteria product
   * @param {Number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async removeCafeteriaProduct(productId, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "removeCafeteriaProduct"
    );
    if (result != null) return result;
    return await this.inventoryManagement.removeCafeteriaProduct(productId);
  }
  /**
   * Add a new category to the system
   * @param {Number} categoryId Unique ID of category
   * @param {String} categoryName The name of the new category
   * @param {Number} parentID Id of the new parent category
   * @param {Number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
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
  /**
   * Edit a category's data
   * @param {Number} categoryId Unique ID of category
   * @param {Number} parentID New id of the parent category
   * @param {Number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async editCategory(categoryId, parentID, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "editCategory"
    );
    if (result != null) return result;
    return await this.inventoryManagement.editCategory(categoryId, parentID);
  }
  /**
   * Deleting a category from the system
   * @param {Number} categoryId Unique ID of category
   * @param {Number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
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
   * @param {string} type Type of the report
   * @param {Array(Object)} reports Reports to add in the report
   * @param {string} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} success or failure
   */
  async createDailyReport(reports, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "SHIFT_MANAGER",
      "createDailyReport"
    );
    if (result != null) return result;
    if (
      !this.employeeManagement.employeeDictionary.has(ActionIDOfTheOperation)
    ) {
      logger.writeToLog(
        "info",
        "CinemaSystem",
        "createDailyReport",
        "Cannot create report - creator employee id " +
          ActionIDOfTheOperation +
          " is not exist"
      );
      return "Cannot create report - only employees can create reports";
    }
    for (let i in reports) {
      let report = reports[i];
      let type = report.type;
      let content = report.content;
      report.content = await this.toDBConversionMethods[type](content);
      if (typeof report.content === "string") {
        return report.content;
      }
      reports[i] = report;
    }
    return ReportController.createDailyReport(reports);
  }

  /**
   * @param {string} type Type of the report
   * @param {string} fromDate The starting date of the report to show
   * @param {string} toDate The ending date of the report to show
   * @param {string} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(Array(Object) | string)} In success returns list of records from the report,
   * otherwise returns error string.
   */
  async getReport(type, fromDate, toDate, ActionIDOfTheOperation) {
    let result = this.checkUser(
      ActionIDOfTheOperation,
      "DEPUTY_MANAGER",
      "getReport"
    );
    if (result != null) return result;
    result = await ReportController.getReport(type, fromDate, toDate);
    if (typeof result !== "string")
      for (let i in result)
        result[i] = await this.toUserConversionMethods[type](
          result[i].dataValues
        );
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
    return ReportController._types;
  }

  getProductsAndQuantityByOrder(orderId) {
    return this.inventoryManagement.getProductsAndQuantityByOrder(orderId);
  }

  getProductsByOrder(orderId) {
    return this.inventoryManagement.getProductsByOrder(orderId);
  }
  //this getter return only not confirmed orders.
  getOrdersByDates(startDate, endDate, isCafeteriaOrder) {
    return this.inventoryManagement.getOrdersByDates(
      startDate,
      endDate,
      isCafeteriaOrder
    );
  }

  getCategoryDetails(categoryId) {
    return this.inventoryManagement.getCategoryDetails(categoryId);
  }
  getCafeteriaOrders() {
    return this.inventoryManagement.getCafeteriaOrders();
  }
  getMovieOrders() {
    return this.inventoryManagement.getMovieOrders();
  }
}

module.exports = CinemaSystem;
