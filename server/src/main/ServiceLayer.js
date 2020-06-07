const CinemaSystem = require("./CinemaSystem");
const SystemInitializer = require("./SystemInitializer");
const NotificationController = require("./NotificationController");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const DBlogger = LogController.getInstance("db");
const {
  columns,
  settings,
  fileNames,
} = require("./consts/JsonToExcelConfiguration");
const xlsx = require("json-as-xlsx");

class ServiceLayer {
  constructor() {
    this.cinemaSystem = new CinemaSystem();
    this.users = new Map();
    this.userCounter = 0;
    this.userActivation = new Map();
    this.suppliers = new Map();
    this.supplierCounter = 0;
    this.products = new Map();
    this.productsCounter = 0;
    this.categories = new Map();
    this.categoriesCounter = 0;
    this.orders = new Map();
    this.ordersCounter = 0;
    setInterval(this.cleanUnactiveUsers.bind(this), 20000); // 60000);
    this.conversionMethods = {
      inventory_daily_report: (records, user, date) => {
        if (!Array.isArray(records) || records.length === 0) {
          this.writeToLog(
            "info",
            "createDailyReport",
            "conversionMethods[inventory_daily_report] - Report content structure is invalid" +
              records
          );
          return "Report content structure is invalid";
        }
        let products = new Set();
        for (let i in records) {
          let record = records[i];
          if (!record.productName || !this._isInputValid(record.productName)) {
            this.writeToLog(
              "info",
              "createDailyReport",
              "conversionMethods[inventory_daily_report] - Report content is invalid" +
                records
            );
            return "Product Name is not valid";
          }

          if (!this.products.has(record.productName)) {
            this.writeToLog(
              "info",
              "createDailyReport",
              "conversionMethods[inventory_daily_report] - The product " +
                record.productName +
                " does not exist in the system."
            );
            return "The product does not exist.";
          }
          if (products.has(record.productName)) {
            this.writeToLog(
              "info",
              "createDailyReport",
              "conversionMethods[inventory_daily_report] - The product " +
                record.productName +
                " already exists in the report."
            );
            return "Cannot add the same product more than once to inventory report.";
          }
          products.add(record.productName);
          record.productId = this.products.get(record.productName);
          delete record.productName;
          record.creatorEmployeeId = this.users.get(user);
          record.date = date;
          records[i] = record;
        }
        return records;
      },
      general_purpose_daily_report: (records, user, date) => {
        if (!Array.isArray(records) || records.length === 0) {
          this.writeToLog(
            "info",
            "createDailyReport",
            "conversionMethods[inventory_daily_report] - Report content structure is invalid" +
              records
          );
          return "Report content structure is invalid";
        }
        for (let i in records) {
          let record = records[i];
          record.creatorEmployeeId = this.users.get(user);
          record.date = date;
          records[i] = record;
        }
        return records;
      },
      incomes_daily_report: (records, user, date) => {
        if (!Array.isArray(records) || records.length === 0) {
          this.writeToLog(
            "info",
            "createDailyReport",
            "conversionMethods[inventory_daily_report] - Report content structure is invalid" +
              records
          );
          return "Report content structure is invalid";
        }
        for (let i in records) {
          let record = records[i];
          record.creatorEmployeeId = this.users.get(user);
          record.date = date;
          records[i] = record;
        }
        return records;
      },
    };
  }

  /**
   * @param {string} dbName The database name
   * @returns {string} Success or failure string
   */
  async initServiceLayer(dbName, password) {
    this.users.set("admin", this.userCounter);
    this.userCounter++;
    let result = await SystemInitializer.initSystem(this, dbName, password);
    return result;
  }

  _isInputValid(param) {
    if (param === undefined || param === "") return false;
    return true;
  }

  async register(userName, password) {
    if (this.users.has(userName)) {
      this.writeToLog(
        "info",
        "register",
        "The registration process failed - the " +
          userName +
          " exists on the system."
      );
      return "The user already Exist";
    } else {
      const result = await this.cinemaSystem.register(
        this.userCounter,
        userName,
        password,
        "EMPLOYEE"
      );
      if (result === "The user registered successfully.") {
        this.users.set(userName, this.userCounter);
        this.userCounter++;
      }
      return result;
    }
  }
  /**
   * User connect to system
   * @param {String} userName Employee username (must be unique)
   * @param {String} password
   * @returns {string} Success or failure string
   **/
  login(userName, password) {
    let validationResult = !this._isInputValid(userName)
      ? "Username is not valid"
      : !this._isInputValid(password)
      ? "Password is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "login", validationResult);
      return validationResult;
    }
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(userName)
    ) {
      this.userActivation.get(userName).lastActTime = new Date();
    }
    if (this.users.has(userName)) {
      let output = this.cinemaSystem.login(
        userName,
        password,
        this.users.get(userName)
      );
      if (output[0] === "User Logged in successfully.") {
        this.userActivation.set(userName, { lastActTime: new Date() });
      }
      return output;
    }
    this.writeToLog(
      "info",
      "login",
      "The login process failed - the " +
        userName +
        " isn't exists on the system."
    );
    return "Incorrect user name.";
  }

  // eslint-disable-next-line no-dupe-class-members
  isLoggedIn(userName) {
    if (this.userActivation.has(userName))
      this.userActivation.get(userName).lastActTime = new Date();
    if (this.users.has(userName)) {
      return this.cinemaSystem.isLoggedIn(this.users.get(userName));
    }
  }
  /**
   * User disconnect to system
   * @param {Number} userId Unique ID of user
   * @returns {Promise(string)} Success or failure string
   **/
  logout(userName) {
    if (this.users.has(userName)) {
      let output = this.cinemaSystem.logout(this.users.get(userName));
      if (output === "Logout succeded." && this.userActivation.has(userName))
        this.userActivation.delete(userName);
      return output;
    }
    this.writeToLog(
      "info",
      "logout",
      "The login process failed - the " +
        userName +
        " isn't exists on the system."
    );
    return "Incorrect user name.";
  }

  printAllUser() {
    this.users.forEach((value, key, map) => {
      console.log(`m[${key}] = ${value}`);
    });
  }
  /**
   * Add a new employee to the system. This operation also adds user to the system.
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
    userName,
    password,
    firstName,
    lastName,
    permissions,
    contactDetails,
    ActionIDofTheOperation,
    isPasswordHashed
  ) {
    let validationResult = !this._isInputValid(userName)
      ? "Username is not valid"
      : !this._isInputValid(password)
      ? "Password is not valid"
      : !this._isInputValid(firstName)
      ? "First Name is not valid"
      : !this._isInputValid(lastName)
      ? "Last Name is not valid"
      : !this._isInputValid(permissions)
      ? "Permissions is not valid"
      : !this._isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this._isInputValid(ActionIDofTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addNewEmployee", validationResult);
      return validationResult;
    }
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (this.users.has(userName)) {
      this.writeToLog(
        "info",
        "addNewEmployee",
        "The addNewEmployee process failed - the " +
          userName +
          " exists on the system."
      );
      return "The user already exists";
    }
    if (!this.users.has(ActionIDofTheOperation)) {
      this.writeToLog(
        "info",
        "addNewEmployee",
        "The addNewEmployee process failed - the " +
          ActionIDofTheOperation +
          " , who initiated the operation, does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addNewEmployee(
      this.userCounter,
      userName,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      this.users.get(ActionIDofTheOperation),
      isPasswordHashed
    );
    if (result === "The employee added successfully.") {
      let employeeId = this.userCounter;
      if (permissions === "MANAGER")
        NotificationController.ManagerId = employeeId;
      else if (
        permissions === "DEPUTY MANAGER" ||
        permissions === "DEPUTY_MANAGER"
      )
        NotificationController.DeputyManagerId = employeeId;
      this.users.set(userName, employeeId);
      this.userCounter++;
    }
    return result;
  }
  /**
   * Edit employee data.
   * @param {String} userName Employee username (unique)
   * @param {String} password
   * @param {String} permissions Permissions that must be one of the permissions types in the system
   * @param {String} firstName First name of employee
   * @param {String} lastName Employee last name
   * @param {String} contactDetails Ways of communicating with the employee
   * @param {Number} ActionIDOfTheOperation The employee ID that performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async editEmployee(
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    let validationResult = !this._isInputValid(userName)
      ? "Username is not valid"
      : password === undefined
      ? "Password is not valid"
      : firstName === undefined
      ? "First Name is not valid"
      : lastName === undefined
      ? "Last Name is not valid"
      : permissions === undefined
      ? "Permissions is not valid"
      : contactDetails === undefined
      ? "Contact Details is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "editEmployee", validationResult);
      return validationResult;
    }
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    if (!this.users.has(userName)) {
      this.writeToLog(
        "info",
        "editEmployee",
        "The editEmployee process failed - the " +
          userName +
          " not exists on the system."
      );
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "editEmployee",
        "The editEmployee process failed - the " +
          ActionIDOfTheOperation +
          " , who initiated the operation, does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.editEmployee(
      this.users.get(userName),
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
  }
  /**
   * Delete employee from system.
   * @param {String} userName Employee username (unique)
   * @param {Number} ActionIDOfTheOperation The employee ID that performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async deleteEmployee(userName, ActionIDOfTheOperation) {
    let validationResult = !this._isInputValid(userName)
      ? "Username is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "deleteEmployee", validationResult);
      return validationResult;
    }
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    if (!this.users.has(userName)) {
      this.writeToLog(
        "info",
        "deleteEmployee",
        "The deleteEmployee process failed - the " +
          userName +
          " not exists on the system."
      );
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "deleteEmployee",
        "The deleteEmployee process failed - the " +
          ActionIDOfTheOperation +
          " , who initiated the operation, does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let res = await this.cinemaSystem.deleteEmployee(
      this.users.get(userName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(userName);
    return res;
  }

  /**
   * Add new movie to the system
   * @param {string} movieName Movie unique name
   * @param {string} category  Category unique name
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async addMovie(movieName, category, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this._isInputValid(category)
      ? "Category is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addMovie", validationResult);
      return validationResult;
    }

    if (this.products.has(movieName)) {
      this.writeToLog(
        "info",
        "addMovie",
        "The movie " + movieName + " already exists"
      );
      return "The movie already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "addMovie",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    if (!this.categories.has(category)) {
      this.writeToLog(
        "info",
        "addMovie",
        "The category " + category + " does not exist"
      );
      return "The category does not exist";
    }
    let result = await this.cinemaSystem.addMovie(
      this.productsCounter,
      movieName,
      this.categories.get(category),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The movie added successfully") {
      this.products.set(movieName, this.productsCounter);
      this.productsCounter++;
    }
    return result;
  }

  /**
   * @param {string} movieName Movie unique name
   * @param {string} category  Category unique name
   * @param {string} key Movie special key
   * @param {string} examinationRoom The room the movie was checked
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async editMovie(
    movieName,
    category,
    key,
    examinationRoom,
    ActionIDOfTheOperation
  ) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(movieName)
      ? "Movie Name is not valid"
      : category === undefined
      ? "Category is not valid"
      : key === undefined
      ? "Key is not valid"
      : examinationRoom === undefined
      ? "Examination Room is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "editMovie", validationResult);
      return validationResult;
    }

    if (!this.products.has(movieName)) {
      this.writeToLog(
        "info",
        "editMovie",
        "The movie " + movieName + " does not exist"
      );
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "editMovie",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    if (category && !this.categories.has(category)) {
      this.writeToLog(
        "info",
        "editMovie",
        "The category " + category + " does not exist"
      );
      return "The category does not exist";
    }
    return await this.cinemaSystem.editMovie(
      this.products.get(movieName),
      category !== "" ? this.categories.get(category) : undefined,
      key !== "" ? key : undefined,
      examinationRoom !== "" ? parseInt(examinationRoom) : undefined,
      this.users.get(ActionIDOfTheOperation)
    );
  }
  /**
   * Remove movie from the system - not from DB
   * @param {string} movieName Movie unique name
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async removeMovie(movieName, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "removeMovie", validationResult);
      return validationResult;
    }

    if (!this.products.has(movieName)) {
      this.writeToLog(
        "info",
        "removeMovie",
        " The movie " + movieName + " does not exist"
      );
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "removeMovie",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let res = await this.cinemaSystem.removeMovie(
      this.products.get(movieName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "The movie removed successfully") {
      this.products.delete(movieName);
    }
    return res;
  }

  /**
   * Add new supplier to the system
   * @param {string} supplierName Supplier unique name
   * @param {string} contactDetails
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async addNewSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this._isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addNewSupplier", validationResult);
      return validationResult;
    }

    if (this.suppliers.has(supplierName)) {
      this.writeToLog(
        "info",
        "addNewSupplier",
        "The supplier " + supplierName + " already exists"
      );
      return "The supplier already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "addNewSupplier",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addNewSupplier(
      this.supplierCounter,
      supplierName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The supplier added successfully") {
      this.suppliers.set(supplierName, this.supplierCounter);
      this.supplierCounter++;
    }
    return result;
  }

  /**
   * @param {string} supplierName Supplier unique name
   * @param {string} contactDetails
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async editSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : contactDetails === undefined
      ? "Contact Details is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "editSupplier", validationResult);
      return validationResult;
    }
    if (!this.suppliers.has(supplierName)) {
      this.writeToLog(
        "info",
        "editSupplier",
        "The supplier " + supplierName + " does not exist"
      );
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "editSupplier",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.editSupplier(
      this.suppliers.get(supplierName),
      supplierName,
      contactDetails !== "" ? contactDetails : undefined,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  /**
   * Remove supplier from the system - not from DB
   * @param {string} supplierName Supplier unique name
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   */
  async removeSupplier(supplierName, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "removeSupplier", validationResult);
      return validationResult;
    }

    if (!this.suppliers.has(supplierName)) {
      this.writeToLog(
        "info",
        "removeSupplier",
        "The supplier " + supplierName + " does not exist"
      );
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "removeSupplier",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeSupplier(
      this.suppliers.get(supplierName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The supplier removed successfully") {
      this.suppliers.delete(supplierName);
    }
    return result;
  }
  /**
   * Add a new cafeteria product to the system
   * @param {String} productName The name of the product
   * @param {Number} productCategory Identifier of the category to which the product belongs
   * @param {Number} productPrice The price of the product
   * @param {Number} productQuantity Quantity of new product in stock
   * @param {Number} maxQuantity Maximum limit of product quantity in stock (Optional parameter)
   * @param {Number} minQuantity Minimum limit of product quantity in stock (Optional parameter)
   * @param {Number} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async addNewProduct(
    productName,
    productPrice,
    productQuantity,
    minQuantity,
    maxQuantity,
    productCategory,
    ActionIDOfTheOperation
  ) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    if (this.products.has(productName)) {
      return "The product already exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let validationResult = !this._isInputValid(productName)
      ? "Product name is not valid"
      : !this._isInputValid(productPrice)
      ? "Product price is not valid"
      : !this._isInputValid(productQuantity)
      ? "Product quantity is not valid"
      : !this._isInputValid(productCategory)
      ? "Product category is not valid"
      : minQuantity === undefined
      ? "Minimum Quantity is not valid"
      : maxQuantity === undefined
      ? "Maximum Quantity is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addNewProduct", validationResult);
      return validationResult;
    }
    if (!this.categories.has(productCategory)) {
      this.writeToLog(
        "info",
        "addNewProduct",
        "Product category does not exist"
      );
      return "Product category does not exist";
    }
    let result = await this.cinemaSystem.addCafeteriaProduct(
      this.productsCounter,
      productName,
      this.categories.get(productCategory),
      productPrice,
      productQuantity,
      maxQuantity,
      minQuantity,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The product was successfully added to the system") {
      this.products.set(productName, this.productsCounter);
      this.productsCounter++;
    } else {
      this.writeToLog("info", "addNewProduct", result);
    }
    return result;
  }
  _isParamTypeOfNumber(param) {
    if (typeof param === "undefined" || param === null || param === "")
      return false;
    return isNaN(param);
  }
  /**
   * Editing the cafeteria product
   * @param {String} productName Unique ID of cafeteria product
   * @param {String} productCategory Identifier of the new category to which the product belongs (Optional parameter)
   * @param {Number} productPrice The new price of the product (Optional parameter)
   * @param {Number} productQuantity New quantity of product in stock (Optional parameter)
   * @param {Number} maxQuantity New maximum limit of product quantity in stock (Optional parameter)
   * @param {Number} minQuantity New minimum limit of product quantity in stock (Optional parameter)
   * @param {String} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async editProduct(
    productName,
    productPrice,
    productQuantity,
    minQuantity,
    maxQuantity,
    productCategory,
    ActionIDOfTheOperation
  ) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(productName)
      ? "Product name is not valid"
      : productPrice === undefined
      ? "Product price is not valid"
      : productQuantity === undefined
      ? "Product quantity is not valid"
      : productCategory === undefined
      ? "Product category is not valid"
      : minQuantity === undefined
      ? "Minimum Quantity is not valid"
      : maxQuantity === undefined
      ? "Maximum Quantity is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addNewProduct", validationResult);
      return validationResult;
    }
    if (!this.products.has(productName)) {
      this.writeToLog("info", "editProduct", "The product doesn't exist");
      return "The product doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "editProduct",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let categoryID;
    if (
      this._isInputValid(productCategory) &&
      !this.categories.has(productCategory)
    ) {
      this.writeToLog("info", "editProduct", "Product category does not exist");
      return "Product category does not exist";
    } else {
      categoryID = this.categories.get(productCategory);
    }
    if (this._isParamTypeOfNumber(productPrice)) {
      this.writeToLog(
        "info",
        "editProduct",
        "The Operation fail price " + productPrice + " is must to be number"
      );
      return "The Operation fail - Price is must to be number";
    }
    if (this._isParamTypeOfNumber(productQuantity)) {
      this.writeToLog(
        "info",
        "editProduct",
        "The Operation fail Quantity " +
          productQuantity +
          " is must to be number"
      );
      return "The Operation fail - Quantity is must to be number";
    }
    if (this._isParamTypeOfNumber(minQuantity)) {
      this.writeToLog(
        "info",
        "editProduct",
        "The Operation fail minQuantity " +
          minQuantity +
          " is must to be number"
      );

      return "The Operation fail - minQuantity is must to be number";
    }
    if (this._isParamTypeOfNumber(maxQuantity)) {
      this.writeToLog(
        "info",
        "editProduct",
        "The Operation fail maxQuantity " +
          maxQuantity +
          " is must to be number"
      );
      return "The Operation fail - maxQuantity is must to be number";
    }

    return await this.cinemaSystem.editCafeteriaProduct(
      this.products.get(productName),
      categoryID,
      productPrice,
      productQuantity,
      maxQuantity,
      minQuantity,
      this.users.get(ActionIDOfTheOperation)
    );
  }
  /**
   * Remove the cafeteria product
   * @param {String} productName Unique ID of cafeteria product
   * @param {String} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async removeProduct(productName, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(productName)
      ? "Product name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "removeProduct", validationResult);
      return validationResult;
    }
    if (!this.products.has(productName)) {
      this.writeToLog("info", "removeProduct", "The product does not exist");
      return "The product does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "removeProduct",
        "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeCafeteriaProduct(
      this.products.get(productName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The product removed successfully") {
      this.products.delete(productName);
    } else {
      this.writeToLog("info", "removeProduct", result);
    }
    return result;
  }
  /**
   * Add a new category to the system
   * @param {String} categoryName Unique ID of category
   * @param {Number} parentName Id of the new parent category
   * @param {String} ActionIDOfTheOperation name of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async addCategory(categoryName, ActionIDOfTheOperation, parentName) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(categoryName)
      ? "Category name is not valid"
      : parentName === undefined
      ? "Parent Name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addCategory", validationResult);
      return validationResult;
    }
    if (this.categories.has(categoryName)) {
      this.writeToLog("info", "addCategory", "The category already exist");
      return "The category already exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "addCategory",
        "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let parentId;
    if (
      typeof parentName !== "undefined" &&
      parentName !== null &&
      (typeof parentName !== "string" || parentName !== "" || parentName !== "")
    ) {
      if (this.categories.has(parentName))
        parentId = this.categories.get(parentName);
      else {
        this.writeToLog(
          "info",
          "addCategory",
          "The parent " + parentName + " does not exist"
        );
        return "The parent " + parentName + " does not exist";
      }
    }

    let result = await this.cinemaSystem.addCategory(
      this.categoriesCounter,
      categoryName,
      parentId,
      this.users.get(ActionIDOfTheOperation)
    );

    if (result === "The category was successfully added to the system") {
      this.categories.set(categoryName, this.categoriesCounter);
      this.categoriesCounter++;
    }
    return result;
  }
  /**
   * Edit a category's data
   * @param {String} categoryName Unique ID of category
   * @param {parentName} parentID New name of the parent category
   * @param {String} ActionIDOfTheOperation Id of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async editCategory(categoryName, ActionIDOfTheOperation, parentName) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(categoryName)
      ? "Category name is not valid"
      : parentName === undefined
      ? "Parent Name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addCategory", validationResult);
      return validationResult;
    }
    if (!this.categories.has(categoryName)) {
      this.writeToLog("info", "editCategory", "The category doesn't exist");
      return "The category doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "editCategory",
        "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let parentId;
    if (parentName !== undefined) {
      if (this.categories.has(parentName))
        parentId = this.categories.get(parentName);
      else {
        this.writeToLog(
          "info",
          "editCategory",
          "The parent " + parentName + " does not exist"
        );
        return "The parent " + parentName + " does not exist";
      }
    }
    return await this.cinemaSystem.editCategory(
      this.categories.get(categoryName),
      parentId,
      this.users.get(ActionIDOfTheOperation)
    );
  }
  /**
   * Deleting a category from the system
   * @param {String} categoryName Unique ID of category
   * @param {String} ActionIDOfTheOperation name of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async removeCategory(categoryName, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(categoryName)
      ? "Category name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "removeCategory", validationResult);
      return validationResult;
    }
    if (!this.categories.has(categoryName)) {
      this.writeToLog("info", "removeCategory", "The category doesn't exist");
      return "The category doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "removeCategory",
        "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeCategory(
      this.categories.get(categoryName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The category was successfully removed") {
      this.categories.delete(categoryName);
    }
    return result;
  }
  /**
   * Add new order of movies to the system
   * @param {string} orderId Order unique id
   * @param {string} date Date the order was performed
   * @param {string} supplierName Supplier unique name
   * @param {Array(string)} moviesList List of movies in the order (list of movie's unique name)
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async addMovieOrder(
    orderId,
    date,
    supplierName,
    moviesList,
    ActionIDOfTheOperation
  ) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(orderId)
      ? "Order ID is not valid"
      : !this._isInputValid(date)
      ? "Date is not valid"
      : !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this._isInputValid(moviesList)
      ? "Movies List is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addMovieOrder", validationResult);
      return validationResult;
    }
    if (this.orders.has(orderId)) {
      this.writeToLog(
        "info",
        "addMovieOrder",
        "The order " + orderId + " already exists"
      );
      return "The order already exists";
    }
    if (!this.suppliers.has(supplierName)) {
      this.writeToLog(
        "info",
        "addMovieOrder",
        "The supplier " + supplierName + " does not exist"
      );
      return "The supplier does not exist";
    }
    let movies = new Set();
    for (let i in moviesList) {
      if (!this.products.has(moviesList[i])) {
        this.writeToLog(
          "info",
          "addMovieOrder",
          "The movie " + moviesList[i] + " does not exist"
        );
        return "Movie does not exist";
      }
      if (movies.has(moviesList[i])) {
        this.writeToLog(
          "info",
          "addMovieOrder",
          "The movie " + moviesList[i] + " already exists in the order."
        );
        return "Cannot add the same movie more than once to the order.";
      }
      movies.add(moviesList[i]);
      moviesList[i] = this.products.get(moviesList[i]);
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "addMovieOrder",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addMovieOrder(
      this.ordersCounter,
      date,
      this.suppliers.get(supplierName),
      moviesList,
      this.users.get(ActionIDOfTheOperation),
      orderId
    );
    if (result === "The order added successfully") {
      this.orders.set(orderId, this.ordersCounter);
      this.ordersCounter++;
    }
    return result;
  }
  /**
   * Remove order from the system and from DB
   * @param {string} orderId Order unique id
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async removeOrder(orderId, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(orderId)
      ? "Order ID is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "removeOrder", validationResult);
      return validationResult;
    }
    if (!this.orders.has(orderId)) {
      this.writeToLog(
        "info",
        "removeOrder",
        "The order " + orderId + " does not exist"
      );
      return "The order does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "removeOrder",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeOrder(
      this.orders.get(orderId),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The order removed successfully")
      this.orders.delete(orderId);
    return result;
  }

  async editOrder(
    orderName,
    dateSTR,
    supplierName,
    productsList,
    ActionIDOfTheOperation
  ) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(orderName)
      ? "Order ID is not valid"
      : supplierName === undefined
      ? "Supplier Name is not valid"
      : dateSTR === undefined
      ? "Date is not valid"
      : productsList === undefined
      ? "Products List is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "editOrder", validationResult);
      return validationResult;
    }
    if (!this.orders.has(orderName)) {
      this.writeToLog(
        "info",
        "editOrder",
        "The order " + orderName + " doesn't exists"
      );
      return " The order " + orderName + " doesn't exists";
    }
    let date;
    if (
      typeof dateSTR === "string" &&
      new Date(dateSTR) !== "Invalid Date" &&
      !isNaN(new Date(dateSTR))
    )
      date = new Date(dateSTR);
    let supplierID;
    if (this.suppliers.has(supplierName))
      supplierID = this.suppliers.get(supplierName);
    let problematicProductName;
    let problematicQuantityName;
    productsList.forEach((product) => {
      if (!this.products.has(product.name)) {
        this.writeToLog(
          "info",
          "editOrder",
          "The product " + product.name + " doesn't exists"
        );
        problematicProductName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      //if there quantity to edit -> check the type of the quantity
      if (
        typeof product.actualQuantity !== "undefined" &&
        isNaN(product.actualQuantity) &&
        typeof product.actualQuantity !== "number"
      ) {
        this.writeToLog(
          "info",
          "editOrder",
          "The product " +
            product.name +
            "'s quantity received is not a number type"
        );
        problematicQuantityName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      product.actualQuantity = parseInt(product.actualQuantity);
      product.id = this.products.get(product.name);
    });
    if (typeof problematicProductName !== "undefined")
      return "The product " + problematicProductName + " doesn't exists";
    if (typeof problematicQuantityName !== "undefined")
      return (
        "The product " +
        problematicProductName +
        "'s quantity received is not a number type"
      );

    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "editOrder",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }

    return this.cinemaSystem.editOrder(
      this.orders.get(orderName),
      date,
      supplierID,
      productsList,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  async confirmOrder(orderName, productsList, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(orderName)
      ? "Order ID is not valid"
      : !this._isInputValid(productsList)
      ? "Products List is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "confirmOrder", validationResult);
      return validationResult;
    }
    if (!this.orders.has(orderName)) {
      this.writeToLog(
        "info",
        "confirmOrder",
        "The order " + orderName + " doesn't exists"
      );
      return " The order " + orderName + " doesn't exists";
    }
    let problematicProductName;
    let problematicQuantityName;
    productsList.forEach((product) => {
      if (!this.products.has(product.name)) {
        this.writeToLog(
          "info",
          "confirmOrder",
          "The product " + product.name + " doesn't exists"
        );
        problematicProductName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      if (
        typeof product.actualQuantity !== "undefined" &&
        isNaN(product.actualQuantity) &&
        typeof product.actualQuantity !== "number"
      ) {
        this.writeToLog(
          "info",
          "confirmOrder",
          "The product " +
            product.name +
            "'s quantity received is not a number type"
        );
        problematicQuantityName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      product.actualQuantity = parseInt(product.actualQuantity);
      product.id = this.products.get(product.name);
    });
    if (typeof problematicProductName !== "undefined")
      return "The product " + problematicProductName + " doesn't exists";
    if (typeof problematicQuantityName !== "undefined")
      return (
        "The product " +
        problematicQuantityName +
        "'s quantity received is not a number type"
      );
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "confirmOrder",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }

    return this.cinemaSystem.confirmOrder(
      this.orders.get(orderName),
      productsList,
      this.users.get(ActionIDOfTheOperation)
    );
  }
  /**
   * Add new order of cafeteria products to the system
   * @param {string} orderId Order unique id
   * @param {string} date Date the order was performed
   * @param {string} supplierName Supplier unique name
   * @param {Array(Object)} productsList List of products in the order (list of object: {productName: "name", quantity:"3"})
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure string
   **/
  async addCafeteriaOrder(
    orderId,
    date,
    supplierName,
    productsList,
    ActionIDOfTheOperation
  ) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(orderId)
      ? "Order ID is not valid"
      : !this._isInputValid(date)
      ? "Date is not valid"
      : !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this._isInputValid(productsList)
      ? "Products List is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addCafeteriaOrder", validationResult);
      return validationResult;
    }
    if (this.orders.has(orderId)) {
      this.writeToLog(
        "info",
        "addCafeteriaOrder",
        "The order " + orderId + " already exist"
      );
      return "The order already exists";
    }
    if (!this.suppliers.has(supplierName)) {
      this.writeToLog(
        "info",
        "addCafeteriaOrder",
        "The supplier " + supplierName + " does not exist"
      );
      return "The supplier does not exist";
    }
    let products = new Set();
    for (let i = 0; i < productsList.length; i++) {
      if (!this.products.has(productsList[i].name)) {
        this.writeToLog(
          "info",
          "addCafeteriaOrder",
          " The product " + productsList[i].name + " does not exist"
        );
        return "Product does not exist";
      }
      if (products.has(productsList[i].name)) {
        this.writeToLog(
          "info",
          "addCafeteriaOrder",
          "The product " +
            productsList[i].name +
            " already exists in the order."
        );
        return "Cannot add the same product more than once to the order.";
      }
      products.add(productsList[i].name);
      productsList[i].id = this.products.get(productsList[i].name);
      productsList[i].quantity = parseInt(productsList[i].quantity);
      delete productsList[i].name;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "addCafeteriaOrder",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.addCafeteriaOrder(
      this.ordersCounter,
      date,
      this.suppliers.get(supplierName),
      productsList,
      this.users.get(ActionIDOfTheOperation),
      orderId
    );
    if (result === "The order added successfully") {
      this.orders.set(orderId, this.ordersCounter);
      this.ordersCounter++;
    }
    return result;
  }

  /**
   * Remove field from general purpose daily report
   * @param {string} fieldToRemove The field to remove
   * @param {string} ActionIDOfTheOperation username of the user performed the action
   * @returns {Promise(string)} success or failure
   */
  async removeFieldFromDailyReport(fieldToRemove, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(fieldToRemove)
      ? "Field is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "removeFieldFromDailyReport", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "removeFieldFromDailyReport",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.removeFieldFromDailyReport(
      fieldToRemove,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  /**
   * Add new field to general purpose daily report
   * @param {string} newField The field to add
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure
   */
  async addFieldToDailyReport(newField, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(newField)
      ? "Field is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "addFieldToDailyReport", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "addFieldToDailyReport",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.addFieldToDailyReport(
      newField,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  /**
   * @param {string} type Type of the report
   * @param {Array(Object)} reports Reports to add in the report
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(string)} Success or failure
   */
  async createDailyReport(date, reports, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(date)
      ? "Date is not valid"
      : !this._isInputValid(reports)
      ? "Reports is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "createDailyReport", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "createDailyReport",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    reports = JSON.parse(reports);
    if (reports.length === 0) {
      this.writeToLog(
        "info",
        "createDailyReport",
        "action failed - empty input reports:" + reports
      );
      return "There is missing information in the report - Please try again.";
    }
    for (let i in reports) {
      let report = reports[i];
      if (!report.type || !this.cinemaSystem.isValidReportType(report.type)) {
        this.writeToLog(
          "info",
          "createDailyReport",
          "The requested report type " + report.type + " is invalid"
        );
        return "Given report type is invalid";
      }
      if (!report.content || report.content.length === 0) {
        this.writeToLog(
          "info",
          "createDailyReport",
          "Report content is invalid"
        );
        return "There is missing information in the report - Please try again.";
      }
      report.content = this.conversionMethods[report.type](
        report.content,
        ActionIDOfTheOperation,
        date
      );
      if (typeof report.content === "string") {
        return report.content;
      }
      reports[i] = report;
    }

    return await this.cinemaSystem.createDailyReport(
      reports,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  /**
   * @param {string} type Type of the report
   * @param {string} fromDate The starting date of the report to show
   * @param {string} toDate The ending date of the report to show
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(Array(Object) | string)} In success returns list of records from the report,
   * otherwise returns error string.
   */
  async getReport(type, fromDate, toDate, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(type)
      ? "Type is not valid"
      : !this._isInputValid(fromDate)
      ? "From Date is not valid"
      : !this._isInputValid(toDate)
      ? "To Date is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "getReport", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "getReport",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.getReport(
      type,
      fromDate,
      toDate,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  /**
   * get all types report to show full daily report
   * @param {string} fromDate The starting date of the report to show
   * @param {string} toDate The ending date of the report to show
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(Array(Object) | string)} In success returns list of the reports by type,
   * otherwise returns error string.
   */
  async getFullDailyReport(fromDate, toDate, ActionIDOfTheOperation) {
    if (
      typeof ActionIDOfTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDOfTheOperation)
    ) {
      this.userActivation.get(ActionIDOfTheOperation).lastActTime = new Date();
    }
    let validationResult = !this._isInputValid(fromDate)
      ? "From Date is not valid"
      : !this._isInputValid(toDate)
      ? "To Date is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      this.writeToLog("info", "getFullDailyReport", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      this.writeToLog(
        "info",
        "getFullDailyReport",
        "The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let reports = [];
    let types = this.cinemaSystem.getReportTypes();
    for (let i in types) {
      let type = types[i];
      let result = await this.cinemaSystem.getReport(
        type,
        fromDate,
        toDate,
        this.users.get(ActionIDOfTheOperation)
      );
      if (typeof result === "string") return result;
      reports = reports.concat({ type: type, content: result });
    }
    return reports;
  }

  /**
   * export report to excel file
   * @param {string} fromDate The starting date of the report to show
   * @param {string} toDate The ending date of the report to show
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(Array(string) | string)} In success returns list of 2 elements, 1st element is the
   * message to the client and the 2nd is the file name, otherwise returns error string.
   */
  async getReportFile(type, fromDate, toDate, ActionIDOfTheOperation) {
    let report = await this.getReport(
      type,
      fromDate,
      toDate,
      ActionIDOfTheOperation
    );
    if (typeof report === "string")
      return "The report cannot be exported " + report;
    let fileName = fileNames[type];
    let cols = columns[type];
    if (type === "general_purpose_daily_report") {
      report[0].props.forEach((prop) => {
        cols = [...cols, { label: prop, value: prop }];
      });
    }
    xlsx(cols, report, settings[type]);

    return [fileName];
  }

  getMovies(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getMovies();
  }

  getSuppliers(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getSuppliers();
  }

  getSupplierDetails(supplierName, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    return this.cinemaSystem.getSupplierDetails(
      this.suppliers.get(supplierName)
    );
  }

  getCafeteriaOrders(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getCafeteriaOrders();
  }
  getEmployees(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getEmployees();
  }

  getEmployeeDetails(employeeName, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.users.has(employeeName)) {
      return "The employee does not exist";
    }
    return this.cinemaSystem.getEmployeeDetails(this.users.get(employeeName));
  }

  getCategories(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getCategories();
  }

  getCafeteriaProducts(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getCafeteriaProducts();
  }
  getMovieOrders(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getMovieOrders();
  }

  getInventoryProducts(ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getInventoryProducts();
  }

  getOrderDetails(orderId, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.orders.has(orderId)) {
      return "The order does not exist";
    }
    const result = this.cinemaSystem.getOrderDetails(this.orders.get(orderId));
    return result;
  }

  getMovieDetails(movieName, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.products.has(movieName)) {
      return "The movie does not exist";
    }
    return this.cinemaSystem.getMovieDetails(this.products.get(movieName));
  }

  getProductsByOrder(orderName, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.orders.has(orderName)) {
      this.writeToLog(
        "info",
        "getProductsByOrder",
        "The order " + orderName + " doesn't exists"
      );

      return { title: "The order " + orderName + " doesn't exists" };
    }
    return this.cinemaSystem.getProductsByOrder(this.orders.get(orderName));
  }
  //this getter return only not confirmed orders.
  getOrdersByDates(
    startDate,
    endDate,
    isCafeteriaOrder,
    ActionIDofTheOperation
  ) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    return this.cinemaSystem.getOrdersByDates(
      startDate,
      endDate,
      isCafeteriaOrder
    );
  }

  async getSeenNotifications(ActionIDofTheOperation) {
    if (!this._isInputValid(ActionIDofTheOperation))
      return "Username is not valid";
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }

    return NotificationController.getSeenNotifications(
      this.users.get(ActionIDofTheOperation)
    );
  }

  getProductsAndQuantityByOrder(orderName, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.orders.has(orderName)) {
      this.writeToLog(
        "info",
        "getProductsByOrder",
        "The order " + orderName + " doesn't exists"
      );
      return { title: "The order " + orderName + " doesn't exists" };
    }
    return this.cinemaSystem.getProductsAndQuantityByOrder(
      this.orders.get(orderName)
    );
  }

  getProductDetails(productName, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.products.has(productName)) {
      this.writeToLog(
        "info",
        "getProductDetails",
        " The product " + productName + " doesn't exists"
      );
      return "The product " + productName + " doesn't exists";
    }
    return this.cinemaSystem.getCafeteriaProductDetails(
      this.products.get(productName)
    );
  }

  getCategoryDetails(categoryName, ActionIDofTheOperation) {
    if (
      typeof ActionIDofTheOperation !== "undefined" &&
      this.userActivation.has(ActionIDofTheOperation)
    ) {
      this.userActivation.get(ActionIDofTheOperation).lastActTime = new Date();
    }
    if (!this.categories.has(categoryName)) {
      this.writeToLog(
        "info",
        "getCategoryDetails",
        "The category " + categoryName + " doesn't exists"
      );
      return "The product " + categoryName + " doesn't exists";
    }
    return this.cinemaSystem.getCategoryDetails(
      this.categories.get(categoryName)
    );
  }

  async getFields() {
    let props = await this.cinemaSystem.getGeneralReportProps();
    let output = [];
    for (let i in props) {
      output = output.concat({ title: props[i] });
    }
    return output;
  }

  getGeneralReportProps() {
    return this.cinemaSystem.getGeneralReportProps();
  }
  getLogContent(type, year) {
    switch (type) {
      case "db":
        return DBlogger.readLog(year);
      default:
        return logger.readLog(year);
    }
  }
  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "ServiceLayer", functionName, msg);
  }
  cleanUnactiveUsers() {
    if (typeof this.userActivation === "undefined") {
      return;
    }
    this.userActivation.forEach((value, key, map) => {
      //calculate the diff in minutes unit
      let diffTime =
        Math.abs(value.lastActTime.getTime() - new Date().getTime()) /
        (1000 * 60);
      if (diffTime >= 10) {
        console.log("disconnect " + key + " the diff is " + diffTime);
        NotificationController.autoLogoutHandler(this.users.get(key));
        this.logout(key);
      }
    });
  }
}
module.exports = ServiceLayer;
