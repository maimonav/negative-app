const data = require("../../consts/data");
const DataBase = require("./DBManager");
const ReportController = require("./ReportController");

class CinemaSystem {
  constructor() {
    this.users = new Map();
    //testing purpose
    const { User, Employee } = {
      User: require("./User"),
      Employee: require("./Employee")
    };

    const InventoryManagement = require("./InventoryManagement");
    this.inventoryManagement = new InventoryManagement();


    const EmployeeManagement = require("./EmployeeManagement");
    this.employeeManagement = new EmployeeManagement();
    this.userOfflineMsg =
      "The operation cannot be completed - the user is not connected to the system";
    this.inappropriatePermissionsMsg = "User does not have proper permissions";

    ReportController.init();

    DataBase.connectAndCreate().then(() => {
      DataBase.init();
      this.users.set(0, new User(0, "admin", "admin", [1, 2, 3, 4, 5]));
      //testing purpose
      this.users.set(
        1,
        new Employee(
          1,
          "manager",
          "manager",
          [1, 2, 3, 4],
          "Noa",
          "Cohen",
          "0508888888"
        )
      );
    });
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

  addNewEmployee(
    userID,
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    if (this.users.has(userID)) return "The id is already exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    )
      return this.userOfflineMsg;
    if (!this.users.get(ActionIDOfTheOperation).permissionCheck(3))
      return this.inappropriatePermissionsMsg;
    let employee = this.employeeManagement.addNewEmployee(
      userID,
      userName,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails
    );
    if (employee === "The employee already exist")
      return "The id is already exists";
    this.users.set(userID, employee);
    return "The employee registered successfully.";
  }

  editEmployee(
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
    )
      return this.userOfflineMsg;
    if (
      !this.users.get(ActionIDOfTheOperation).permissionCheck(3) &&
      ActionIDOfTheOperation !== employeeID
    )
      return this.inappropriatePermissionsMsg;
    return this.employeeManagement.editEmployee(
      employeeID,
      password,
      permissions,
      firstName,
      lastName,
      contactDetails
    );
  }

  deleteEmployee(employeeID, ActionIDOfTheOperation) {
    if (!this.users.has(employeeID)) return "The id is not exists";
    if (
      !this.users.has(ActionIDOfTheOperation) ||
      !this.users.get(ActionIDOfTheOperation).isLoggedin()
    )
      return this.userOfflineMsg;
    if (!this.users.get(ActionIDOfTheOperation).permissionCheck(3))
      return this.inappropriatePermissionsMsg;
    if (employeeID === ActionIDOfTheOperation)
      return "A user cannot erase himself";
    if (this.users.get(employeeID).isLoggedin())
      return "You cannot delete a logged in user";
    let res = this.employeeManagement.deleteEmployee(employeeID);
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(employeeID);
    return res;
  }

  checkUser(ActionIDOfTheOperation, permission) {
    if ((!this.users.has(ActionIDOfTheOperation) || !this.users.get(ActionIDOfTheOperation).isLoggedin()))
      return this.userOfflineMsg;
    if (!this.users.get(ActionIDOfTheOperation).permissionCheck(permission))
      return this.inappropriatePermissionsMsg;
    return null;
  }




  addMovie(movieId, movieName, categoryId, ActionIDOfTheOperation) {
    let result = this.checkUser(ActionIDOfTheOperation);
    if (result != null)
      return result;
    return this.inventoryManagement.addMovie(movieId, movieName, categoryId);

  }

  //TODO
  editMovie(movieID, categoryId, key, examinationRoom, ActionIDOfTheOperation) {
    let result = this.checkUser(ActionIDOfTheOperation);
    if (result != null)
      return result;
    return this.inventoryManagement.editMovie(movieID, categoryId, key, examinationRoom);
  }

  removeMovie(movieID, ActionIDOfTheOperation) {
    let result = this.checkUser(ActionIDOfTheOperation);
    if (result != null)
      return result;
    return this.inventoryManagement.removeMovie(movieID);
  }

  addNewSupplier(
    supplierID,
    supplierName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(ActionIDOfTheOperation);
    if (result != null)
      return result;
    return this.inventoryManagement.addNewSupplier(supplierID,
      supplierName,
      contactDetails);
  }

  editSupplier(
    supplierID,
    supplierName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    let result = this.checkUser(ActionIDOfTheOperation);
    if (result != null)
      return result;
    return this.inventoryManagement.editSupplier(supplierID,
      supplierName,
      contactDetails);
  }

  removeSupplier(supplierID, ActionIDOfTheOperation) {
    let result = this.checkUser(ActionIDOfTheOperation);
    if (result != null)
      return result;
    return this.inventoryManagement.removeSupplier(supplierID);

  }

  addNewProduct(
    productId,
    productName,
    productPrice,
    productQuantity,
    minQuantity,
    maxQuantity,
    productCategoryn,
    ActionIDOfTheOperation
  ) {
    return "TODO: IMPLEMENT THIS.";
  }

  editProduct(
    productId,
    productName,
    productPrice,
    productQuantity,
    minQuantity,
    maxQuantity,
    productCategoryn,
    ActionIDOfTheOperation
  ) {
    return "TODO: IMPLEMENT THIS.";
  }

  removeProduct(
    productId,
    productName,
    productPrice,
    productQuantity,
    minQuantity,
    maxQuantity,
    productCategoryn,
    ActionIDOfTheOperation
  ) {
    return "TODO: IMPLEMENT THIS.";
  }

  addCategory(categoryId, categoryName, ActionIDOfTheOperation) {
    return "TODO: IMPLEMENT THIS.";
  }

  removeCategory(categoryId, categoryName, ActionIDOfTheOperation) {
    return "TODO: IMPLEMENT THIS.";
  }

  addCafetriaOrder(
    orderId,
    productName,
    supplierName,
    orderDate,
    productQuantity,
    ActionIDOfTheOperation
  ) {
    return "TODO: IMPLEMENT THIS.";
  }

  editCafetriaOrder(
    orderId,
    productsName,
    orderDate,
    productQuantity,
    ActionIDOfTheOperatio
  ) {
    return "TODO: IMPLEMENT THIS.";
  }

  removeCafetriaOrder(orderId, ActionIDOfTheOperation) {
    return "TODO: IMPLEMENT THIS.";
  }

  getSuppliers() {
    //TODO: IMPLEMENT THIS.
    return data.dataExample;
  }
  getEmployees() {
    //TODO: IMPLEMENT THIS.
    return data.dataExample;
  }
  getCategories() {
    //TODO: IMPLEMENT THIS.
    return data.dataExample;
  }
  getCafeteriaProducts() {
    //TODO: IMPLEMENT THIS.
    return data.dataExample;
  }
  getInventoryProducts() {
    //TODO: IMPLEMENT THIS.
    return data.dataExample;
  }
  getCafeteriaOrders() {
    //TODO: IMPLEMENT THIS.
    return data.dataExample;
  }

  getSupplierDetails() {
    //TODO: IMPLEMENT THIS.
    return data.supplierDetails;
  }
  getEmployeeDetails() {
    //TODO: IMPLEMENT THIS.
    return data.employeeDetails;
  }
}

module.exports = CinemaSystem;
