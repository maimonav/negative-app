const CinemaSystem = require("./CinemaSystem");
const SystemInitializer = require("./SystemInitializer");
const NotificationController = require("./NotificationController");
const logger = require("simple-node-logger").createSimpleLogger("project.log");

class ServiceLayer {
  constructor() {
    this.cinemaSystem = new CinemaSystem();
    this.users = new Map();
    this.userCounter = 0;
    this.suppliers = new Map();
    this.supplierCounter = 0;
    this.products = new Map();
    this.productsCounter = 0;
    this.categories = new Map();
    this.categoriesCounter = 0;
    this.orders = new Map();
    this.ordersCounter = 0;
    this.convertionMethods = {
      inventory_daily_report: (records, user, date) => {
        for (let i in records) {
          let record = records[i];
          if (!record.productName) {
            logger.info(
              "ServiceLayer - createDailyReport - convertionMethods[inventory_daily_report] - Report content is invalid"
            );
            return "Report content is invalid";
          }

          let validationResult = !this._isInputValid(record.productName)
            ? "Product Name is not valid"
            : "Valid";
          if (validationResult !== "Valid") {
            logger.info(
              "ServiceLayer - createDailyReport - convertionMethods[inventory_daily_report] - ",
              validationResult
            );
            return validationResult;
          }
          if (!this.products.has(record.productName)) {
            logger.info(
              "ServiceLayer - convertionMethods[inventory_daily_report] - The product " +
                record.productName +
                " does not exist in the system."
            );
            return "The product does not exist.";
          }
          record.productId = this.products.get(record.productName);
          delete record.productName;
          record.creatorEmployeeId = this.users.get(user);
          record.date = date;
          records[i] = record;
        }
        return records;
      },
      general_purpose_daily_report: (records, user, date) => {
        for (let i in records) {
          let record = records[i];
          record.creatorEmployeeId = this.users.get(user);
          record.date = date;
          records[i] = record;
        }
        return records;
      },
      incomes_daily_report: (records, user, date) => {
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
  async initSeviceLayer(dbName, password) {
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
      logger.info(
        "ServiceLayer - The registration process failed - the " +
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
    if (this.users.has(userName)) {
      return this.cinemaSystem.login(
        userName,
        password,
        this.users.get(userName)
      );
    }
    logger.info(
      "ServiceLayer - The login process failed - the " +
        userName +
        " isn't exists on the system."
    );
    return "Incorrect user name.";
  }

  // eslint-disable-next-line no-dupe-class-members
  isLoggedIn(userName) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.isLoggedin(this.users.get(userName));
    }
  }
  /**
   * User disconnect to system
   * @param {Number} userId Unique ID of user
   * @returns {Promise(string)} Success or failure string
   **/
  logout(userName) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.logout(this.users.get(userName));
    }
    logger.info(
      "ServiceLayer - The logout process failed - the " +
        userName +
        " isn't exists on the system."
    );
    return "Incorrect user name.";
  }

  printallUser() {
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
    if (this.users.has(userName)) {
      logger.info(
        "ServiceLayer - The addNewEmployee process failed - the " +
          userName +
          " exists on the system."
      );
      return "The user already exists";
    }
    if (!this.users.has(ActionIDofTheOperation)) {
      logger.info(
        "ServiceLayer - The addNewEmployee process failed - the " +
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
    if (!this.users.has(userName)) {
      logger.info(
        "ServiceLayer - editEmployee - The addNewEmployee process failed - the " +
          userName +
          " not exists on the system."
      );
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer - The editEmployee process failed - the " +
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
    if (!this.users.has(userName)) {
      logger.info(
        "ServiceLayer - deleteEmployee - The deleteEmployee process failed - the " +
          userName +
          " not exists on the system."
      );
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer - The deleteEmployee process failed - the " +
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
    let validationResult = !this._isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this._isInputValid(category)
      ? "Category is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addMovie - ", validationResult);
      return validationResult;
    }

    if (this.products.has(movieName)) {
      logger.info(
        "ServiceLayer- addMovie - The movie " + movieName + " already exists"
      );
      return "The movie already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addMovie - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    if (!this.categories.has(category)) {
      logger.info(
        "ServiceLayer- addMovie - The category " + category + " does not exist"
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
    let validationResult = !this._isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this._isInputValid(category)
      ? "Category is not valid"
      : !this._isInputValid(key)
      ? "Key is not valid"
      : !this._isInputValid(examinationRoom)
      ? "Examination Room is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- editMovie - ", validationResult);
      return validationResult;
    }

    if (!this.products.has(movieName)) {
      logger.info(
        "ServiceLayer- editMovie - The movie " + movieName + " does not exist"
      );
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editMovie - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    if (!this.categories.has(category)) {
      logger.info(
        "ServiceLayer- editMovie - The category " + category + " does not exist"
      );
      return "The category does not exist";
    }
    return await this.cinemaSystem.editMovie(
      this.products.get(movieName),
      this.categories.get(category),
      key,
      parseInt(examinationRoom),
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
    let validationResult = !this._isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- removeMovie - ", validationResult);
      return validationResult;
    }

    if (!this.products.has(movieName)) {
      logger.info(
        "ServiceLayer- removeMovie - The movie " + movieName + " does not exist"
      );
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- removeMovie - The user " +
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
    let validationResult = !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this._isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addNewSupplier - ", validationResult);
      return validationResult;
    }

    if (this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- addNewSupplier - The supplier " +
          supplierName +
          " already exists"
      );
      return "The supplier already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addNewSupplier - The user " +
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
    let validationResult = !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this._isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- editSupplier - ", validationResult);
      return validationResult;
    }
    if (!this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- editSupplier - The supplier " +
          supplierName +
          " does not exist"
      );
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editSupplier - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.editSupplier(
      this.suppliers.get(supplierName),
      supplierName,
      contactDetails,
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
    let validationResult = !this._isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- removeSupplier - ", validationResult);
      return validationResult;
    }

    if (!this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- removeSupplier - The supplier " +
          supplierName +
          " does not exist"
      );
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- removeSupplier - The user " +
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
      : "Valid";
    if (validationResult !== "Valid") return validationResult;
    if (!this.categories.has(productCategory))
      return "Product category does not exist";
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
      logger.info("ServiceLayer- addNewProduct - " + result);
    }
    return result;
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
    if (!this.products.has(productName)) {
      return "The product doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
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
    )
      return "Product category does not exist";
    else {
      categoryID = this.categories.get(productCategory);
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
    if (!this.products.has(productName)) {
      return "The product does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let result = await this.cinemaSystem.removeCafeteriaProduct(
      this.products.get(productName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The product removed successfully") {
      this.products.delete(productName);
    } else {
      logger.info("ServiceLayer- removeProduct - " + result);
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
    if (this.categories.has(categoryName)) {
      logger.info("ServiceLayer- addCategory - ", "The category already exist");
      return "The category already exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addCategory - " +
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
        logger.info(
          "ServiceLayer- addCategory - " +
            "The parent " +
            parentName +
            " does not exist"
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
    if (!this.categories.has(categoryName)) {
      logger.info(
        "ServiceLayer- editCategory - ",
        "The category doesn't exist"
      );
      return "The category doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editCategory - " +
          "The user performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    let parentId;
    if (parentName !== undefined) {
      if (this.categories.has(parentName))
        parentId = this.categories.get(parentName);
      else {
        logger.info(
          "ServiceLayer- editCategory - " +
            "The parent " +
            parentName +
            " does not exist"
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
    if (!this.categories.has(categoryName)) {
      logger.info(
        "ServiceLayer- editCategory - ",
        "The category doesn't exist"
      );
      return "The category doesn't exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editCategory - " +
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
      logger.info("ServiceLayer- addMovieOrder - ", validationResult);
      return validationResult;
    }
    if (this.orders.has(orderId)) {
      logger.info(
        "ServiceLayer- addMovieOrder - The order " + orderId + " already exists"
      );
      return "The order already exists";
    }
    if (!this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- addMovieOrder - The supplier " +
          supplierName +
          " does not exist"
      );
      return "The supplier does not exist";
    }
    for (let i in moviesList) {
      if (!this.products.has(moviesList[i])) {
        logger.info(
          "ServiceLayer- addMovieOrder - The movie " +
            moviesList[i] +
            " does not exist"
        );
        return "Movie does not exist";
      }
      moviesList[i] = this.products.get(moviesList[i]);
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addMovieOrder - The user " +
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
    let validationResult = !this._isInputValid(orderId)
      ? "Order ID is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- removeOrder - ", validationResult);
      return validationResult;
    }
    if (!this.orders.has(orderId)) {
      logger.info(
        "ServiceLayer- removeOrder - The order " + orderId + " does not exist"
      );
      return "The order does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- removeOrder - The user " +
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
    let validationResult = !this._isInputValid(orderName)
      ? "Order ID is not valid"
      : !this._isInputValid(productsList)
      ? "Products List is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- editOrder - ", validationResult);
      return validationResult;
    }
    if (!this.orders.has(orderName)) {
      logger.info(
        "ServiceLayer- editOrder - The order " + orderName + " doesn't exists"
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
    let problemticProductName;
    let problematicQuantityName;
    productsList.forEach((product) => {
      if (!this.products.has(product.name)) {
        logger.info(
          "ServiceLayer- editOrder - The product " +
            product.name +
            " doesn't exists"
        );
        problemticProductName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      //if there quantity to edit -> check the type of the quantity
      if (
        typeof product.actualQuantity !== "undefined" &&
        isNaN(product.actualQuantity) &&
        typeof product.actualQuantity !== "number"
      ) {
        logger.info(
          "ServiceLayer- editOrder - The product " +
            product.name +
            "'s quantity received is not a number type"
        );
        problematicQuantityName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      product.actualQuantity = parseInt(product.actualQuantity);
      product.id = this.products.get(product.name);
    });
    if (typeof problemticProductName !== "undefined")
      return "The product " + problemticProductName + " doesn't exists";
    if (typeof problematicQuantityName !== "undefined")
      return (
        "The product " +
        product.name +
        "'s quantity received is not a number type"
      );

    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- editOrder - The user " +
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
    let validationResult = !this._isInputValid(orderName)
      ? "Order ID is not valid"
      : !this._isInputValid(productsList)
      ? "Products List is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- confirmOrder - ", validationResult);
      return validationResult;
    }
    if (!this.orders.has(orderName)) {
      logger.info(
        "ServiceLayer- confirmOrder - The order " +
          orderName +
          " doesn't exists"
      );
      return " The order " + orderName + " doesn't exists";
    }
    let problemticProductName;
    let problematicQuantityName;
    productsList.forEach((product) => {
      if (!this.products.has(product.name)) {
        logger.info(
          "ServiceLayer- confirmOrder - The product " +
            product.name +
            " doesn't exists"
        );
        problemticProductName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      if (
        typeof product.actualQuantity !== "undefined" &&
        isNaN(product.actualQuantity) &&
        typeof product.actualQuantity !== "number"
      ) {
        logger.info(
          "ServiceLayer- confirmOrder - The product " +
            product.name +
            "'s quantity received is not a number type"
        );
        problematicQuantityName = product.name;
        return "The product " + product.name + " doesn't exists";
      }
      product.actualQuantity = parseInt(product.actualQuantity);
      product.id = this.products.get(product.name);
    });
    if (typeof problemticProductName !== "undefined")
      return "The product " + problemticProductName + " doesn't exists";
    if (typeof problematicQuantityName !== "undefined")
      return (
        "The product " +
        problematicQuantityName +
        "'s quantity received is not a number type"
      );
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- confirmOrder - The user " +
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
      logger.info("ServiceLayer- addCafeteriaOrder - ", validationResult);
      return validationResult;
    }
    if (this.orders.has(orderId)) {
      logger.info(
        "ServiceLayer- addCafeteriaOrder - The order " +
          orderId +
          " already exists"
      );
      return "The order already exists";
    }
    if (!this.suppliers.has(supplierName)) {
      logger.info(
        "ServiceLayer- addCafeteriaOrder - The supplier " +
          supplierName +
          " does not exist"
      );
      return "The supplier does not exist";
    }
    for (let i = 0; i < productsList.length; i++) {
      if (!this.products.has(productsList[i].name)) {
        logger.info(
          "ServiceLayer- addCafeteriaOrder - The product " +
            productsList[i].name +
            " does not exist"
        );
        return "Product does not exist";
      }
      productsList[i].id = this.products.get(productsList[i].name);
      productsList[i].quantity = parseInt(productsList[i].quantity);
      delete productsList[i].name;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addCafeteriaOrder - The user " +
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
    let validationResult = !this._isInputValid(fieldToRemove)
      ? "Field is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info(
        "ServiceLayer- removeFieldFromDailyReport - ",
        validationResult
      );
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- removeFieldFromDailyReport - The user " +
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
    let validationResult = !this._isInputValid(newField)
      ? "Field is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- addFieldToDailyReport - ", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- addFieldToDailyReport - The user " +
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
    let validationResult = !this._isInputValid(date)
      ? "Date is not valid"
      : !this._isInputValid(reports)
      ? "Reports is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- createDailyReport - ", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- createDailyReport - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    reports = JSON.parse(reports);
    if (reports.length === 0) {
      logger.info(
        "ServiceLayer - createDailyReport - action failed - empty input reports:",
        reports
      );
      return "Invalid report - missing information";
    }
    for (let i in reports) {
      let report = reports[i];
      if (!report.type || !this.cinemaSystem.isValidReportType(report.type)) {
        logger.info(
          "ServiceLayer - createDailyReport - The requested report type " +
            report.type +
            " is invalid"
        );
        return "Requested report type is invalid";
      }
      if (!report.content || report.content.length === 0) {
        logger.info(
          "ServiceLayer - createDailyReport - Report content is invalid"
        );
        return "Report content is invalid";
      }
      report.content = this.convertionMethods[report.type](
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
   * @param {string} date Date of the report
   * @param {string} ActionIDOfTheOperation Username of the user performed the action
   * @returns {Promise(Array(Object) | string)} In success returns list of records from the report,
   * otherwise returns error string.
   */
  async getReport(type, date, ActionIDOfTheOperation) {
    let validationResult = !this._isInputValid(type)
      ? "Type is not valid"
      : !this._isInputValid(date)
      ? "Date is not valid"
      : !this._isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") {
      logger.info("ServiceLayer- getReport - ", validationResult);
      return validationResult;
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      logger.info(
        "ServiceLayer- getReport - The user " +
          ActionIDOfTheOperation +
          " performing the operation does not exist in the system"
      );
      return "The user performing the operation does not exist in the system";
    }
    return await this.cinemaSystem.getReport(
      type,
      new Date(date),
      this.users.get(ActionIDOfTheOperation)
    );
  }

  getMovies() {
    return this.cinemaSystem.getMovies();
  }

  getSuppliers() {
    return this.cinemaSystem.getSuppliers();
  }

  getSupplierDetails(supplierName) {
    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    return this.cinemaSystem.getSupplierDetails(
      this.suppliers.get(supplierName)
    );
  }

  getCafeteriaOrders() {
    return this.cinemaSystem.getCafeteriaOrders();
  }
  getEmployees() {
    return this.cinemaSystem.getEmployees();
  }

  getEmployeeDetails(employeeName) {
    if (!this.users.has(employeeName)) {
      return "The employee does not exist";
    }
    return this.cinemaSystem.getEmployeeDetails(this.users.get(employeeName));
  }

  getCategories() {
    return this.cinemaSystem.getCategories();
  }

  getCafeteriaProducts() {
    return this.cinemaSystem.getCafeteriaProducts();
  }
  getMovieOrders() {
    return this.cinemaSystem.getMovieOrders();
  }

  getInventoryProducts() {
    return this.cinemaSystem.getInventoryProducts();
  }

  getOrderDetails(orderId) {
    if (!this.orders.has(orderId)) {
      return "The order does not exist";
    }
    const result = this.cinemaSystem.getOrderDetails(this.orders.get(orderId));
    return result;
  }

  getMovieDetails(movieName) {
    if (!this.products.has(movieName)) {
      return "The movie does not exist";
    }
    return this.cinemaSystem.getMovieDetails(this.products.get(movieName));
  }

  getProductsByOrder(orderName) {
    if (!this.orders.has(orderName)) {
      logger.info(
        "ServiceLayer- getProductsByOrder - The order " +
          orderName +
          " doesn't exists"
      );
      return { title: "The order " + orderName + " doesn't exists" };
    }
    return this.cinemaSystem.getProductsByOrder(this.orders.get(orderName));
  }
  //this getter return only not confirmed orders.
  getOrdersByDates(startDate, endDate, isCafeteriaOrder) {
    return this.cinemaSystem.getOrdersByDates(
      startDate,
      endDate,
      isCafeteriaOrder
    );
  }

  getProductsAndQuantityByOrder(orderName) {
    if (!this.orders.has(orderName)) {
      logger.info(
        "ServiceLayer- getProductsByOrder - The order " +
          orderName +
          " doesn't exists"
      );
      return { title: "The order " + orderName + " doesn't exists" };
    }
    return this.cinemaSystem.getProductsAndQuantityByOrder(
      this.orders.get(orderName)
    );
  }

  getProductDetails(productName) {
    if (!this.products.has(productName)) {
      logger.info(
        "ServiceLayer- getProductDetails - The product " +
          productName +
          " doesn't exists"
      );
      return "The product " + productName + " doesn't exists";
    }
    return this.cinemaSystem.getCafeteriaProductDetails(
      this.products.get(productName)
    );
  }

  getCategoryDetails(categoryName) {
    if (!this.categories.has(categoryName)) {
      logger.info(
        "ServiceLayer- getCategoryDetails - The category " +
          categoryName +
          " doesn't exists"
      );
      return "The product " + categoryName + " doesn't exists";
    }
    return this.cinemaSystem.getCategoryDetails(
      this.categories.get(categoryName)
    );
  }
  getGeneralReportProps() {
    return this.cinemaSystem.getGeneralReportProps();
  }

  getInventoryReport() {
    return data.inventory_daily_report;
  }
  getIncomesReport() {
    return data.incomes_daily_report;
  }
  getGeneralReport() {
    return data.general_purpose_daily_report;
  }
}
module.exports = ServiceLayer;
