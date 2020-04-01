const CinemaSystem = require("./CinemaSystem");

class ServiceLayer {
  constructor() {
    this.cinemaSystem = new CinemaSystem();
    this.users = new Map();
    this.users.set("admin", 0);
    this.userCounter = 3;
    this.movies = new Map();
    this.movies.set("movie", 0);
    this.movieCounter = 1;
    this.suppliers = new Map();
    // just for example purposes
    this.suppliers.set("supplier", 0);
    this.supplierCounter = 1;
    this.products = new Map();
    this.products.set("product", 0);
    this.productsCounter = 1;
    this.categories = new Map();
    this.categories.set("category", 0);
    this.categoriesCounter = 1;
    this.orders = new Map();
    this.orders.set("order", 0);
    this.ordersCounter = 1;
  }

  isInputValid(param) {
    if (param === undefined || param === "") return false;
    return true;
  }

  register(userName, password) {
    if (this.users.has(userName)) {
      return "The user already Exist";
    } else {
      let result = this.cinemaSystem.register(
        this.userCounter,
        userName,
        password,
        this.convertPermissions("User")
      );
      if (result === "The user registered successfully.") {
        this.users.set(userName, this.userCounter);
        this.userCounter++;
      }
      return result;
    }
  }

  login(userName, password) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.login(
        userName,
        password,
        this.users.get(userName)
      );
    }
    return "Incorrect user name.";
  }

  logout(userName) {
    if (this.users.has(userName)) {
      return this.cinemaSystem.logout(this.users.get(userName));
    }
    return "Incorrect user name.";
  }

  printallUser() {
    this.users.forEach((value, key, map) => {
      console.log(`m[${key}] = ${value}`);
    });
  }
  addNewEmployee(
    userName,
    password,
    firstName,
    lastName,
    permissions,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    this.printallUser();
    if (this.users.has(userName)) {
      return "The user already exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let convertedPermission = this.convertPermissions(permissions);
      if (
        convertedPermission === undefined ||
        !Array.isArray(convertedPermission)
      )
        return "No permissions were received for the user";
      let result = this.cinemaSystem.addNewEmployee(
        this.userCounter,
        userName,
        password,
        convertedPermission,
        firstName,
        lastName,
        contactDetails,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The employee registered successfully.") {
        this.users.set(userName, this.userCounter);
        this.userCounter++;
      }
      return result;
    }
  }

  editEmployee(
    userName,
    password,
    permissions,
    firstName,
    lastName,
    contactDetails,
    ActionIDOfTheOperation
  ) {
    if (!this.users.has(userName)) {
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.editEmployee(
      this.users.get(userName),
      password,
      permissions,
      firstName,
      lastName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
  }

  deleteEmployee(userName, ActionIDOfTheOperation) {
    if (!this.users.has(userName)) {
      return "The employee does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let res = this.cinemaSystem.deleteEmployee(
      this.users.get(userName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "Successfully deleted employee data deletion")
      this.users.delete(userName);
    return res;
  }

  addMovie(movieName, category, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this.isInputValid(category)
      ? "Category is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;

    if (this.movies.has(movieName)) {
      return "The movie already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    if (!this.categories.has(category)) return "The category does not exist";
    let result = this.cinemaSystem.addMovie(
      this.movieCounter,
      movieName,
      this.categories.get(category),
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The movie added successfully") {
      this.movies.set(movieName, this.movieCounter);
      this.movieCounter++;
    }
    return result;
  }

  editMovie(movieName, category, key, examinationRoom, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this.isInputValid(category)
      ? "Category is not valid"
      : !this.isInputValid(key)
      ? "Key is not valid"
      : !this.isInputValid(examinationRoom)
      ? "Examination Room is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;

    if (!this.movies.has(movieName)) {
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    if (!this.categories.has(category)) {
      return "The category does not exist";
    }
    return this.cinemaSystem.editMovie(
      this.movies.get(movieName),
      this.categories.get(category),
      key,
      parseInt(examinationRoom),
      this.users.get(ActionIDOfTheOperation)
    );
  }

  removeMovie(movieName, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(movieName)
      ? "Movie Name is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;

    if (!this.movies.has(movieName)) {
      return "The movie does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let res = this.cinemaSystem.removeMovie(
      this.movies.get(movieName),
      this.users.get(ActionIDOfTheOperation)
    );
    if (res === "The movie removed successfully") {
      this.movies.delete(movieName);
    }
    return res;
  }

  addNewSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;

    if (this.suppliers.has(supplierName)) {
      return "The supplier already exists";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let result = this.cinemaSystem.addNewSupplier(
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

  editSupplier(supplierName, contactDetails, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(contactDetails)
      ? "Contact Details is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;

    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let result = this.cinemaSystem.editSupplier(
      this.supplierCounter,
      supplierName,
      contactDetails,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The supplier edited successfully") {
      this.suppliers.set(supplierName, this.supplierCounter);
    }
    return result;
  }

  removeSupplier(supplierName, ActionIDOfTheOperation) {
    let validationResult = !this.isInputValid(supplierName)
      ? "Supplier Name is not valid"
      : !this.isInputValid(ActionIDOfTheOperation)
      ? "Username is not valid"
      : "Valid";
    if (validationResult !== "Valid") return validationResult;

    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    let result = this.cinemaSystem.removeSupplier(
      this.supplierCounter,
      this.users.get(ActionIDOfTheOperation)
    );
    if (result === "The supplier removed successfully") {
      this.suppliers.delete(supplierName);
    }
    return result;
  }

  addNewProduct(
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
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.addNewProduct(
        this.productsCounter,
        productName,
        productPrice,
        productQuantity,
        minQuantity,
        maxQuantity,
        productCategory,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The product added successfully.") {
        this.products.set(productName, this.productsCounter);
        this.productsCounter++;
      }
      return result;
    }
  }

  editProduct(
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
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.editProduct(
        this.productsCounter,
        productName,
        productPrice,
        productQuantity,
        minQuantity,
        maxQuantity,
        productCategory,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The product edited successfully.") {
        this.products.set(productName, this.productsCounter);
      }
      return result;
    }
  }

  removeProduct(productName, ActionIDOfTheOperation) {
    if (!this.products.has(productName)) {
      return "The product does not exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.removeProduct(
        this.productsCounter,
        this.products.get(productName),
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The product removed successfully.") {
        this.products.delete(productName);
      }
      return result;
    }
  }

  addCategory(categoryName, ActionIDOfTheOperation) {
    if (this.categories.has(categoryName)) {
      return "The category already exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.addCategory(
        this.categoriesCounter,
        categoryName,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The category added successfully.") {
        this.categories.set(categoryName, this.categoriesCounter);
        this.categoriesCounter++;
      }
      return result;
    }
  }

  removeCategory(categoryName, ActionIDOfTheOperation) {
    if (!this.categories.has(categoryName)) {
      return "The category does not exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.removeCategory(
        this.categoriesCounter,
        this.categories.get(categoryName),
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The category added successfully.") {
        this.categories.delete(categoryName);
      }
      return result;
    }
  }

  addCafetriaOrder(
    productName,
    supplierName,
    orderDate,
    productQuantity,
    ActionIDOfTheOperation
  ) {
    if (this.orders.has(productName)) {
      return "The order already exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.addCafetriaOrder(
        this.ordersCounter,
        productName,
        supplierName,
        orderDate,
        productQuantity,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The category added successfully.") {
        this.orders.delete(productName);
      }
      return result;
    }
  }

  editCafetriaOrder(
    orderId,
    productsName,
    orderDate,
    productQuantity,
    ActionIDOfTheOperation
  ) {
    if (!this.orders.has(orderId)) {
      return "The order does not exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.editCafetriaOrder(
        this.ordersCounter,
        orderId,
        productsName,
        orderDate,
        productQuantity,
        this.users.get(ActionIDOfTheOperation)
      );
      return result;
    }
  }

  removeCafetriaOrder(orderId, ActionIDOfTheOperation) {
    if (!this.orders.has(orderId)) {
      return "The order does not exist";
    } else {
      if (!this.users.has(ActionIDOfTheOperation)) {
        return "The user performing the operation does not exist in the system";
      }
      let result = this.cinemaSystem.removeCafetriaOrder(
        orderId,
        this.users.get(ActionIDOfTheOperation)
      );
      if (result === "The category added successfully.") {
        this.orders.delete(orderId);
      }
      return result;
    }
  }

  getMovies(ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.getSuppliers();
  }

  getSuppliers(ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.getSuppliers();
  }

  getSupplierDetails(supplierName, ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    if (!this.suppliers.has(supplierName)) {
      return "The supplier does not exist";
    }
    return this.cinemaSystem.getSupplierDetails(
      this.suppliers.get(supplierName)
    );
  }

  getEmployees(ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.getEmployees();
  }

  getEmployeeDetails(employeeName, ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    if (!this.users.has(employeeName)) {
      return "The employee does not exist";
    }
    return this.cinemaSystem.getEmployeeDetails(this.users.get(employeeName));
  }

  getCategories(ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.getCategories();
  }

  getCafeteriaProducts(ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.getCafeteriaProducts();
  }

  getCafeteriaOrders(ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.getCafeteriaOrders();
  }

  getInventoryProducts(ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    return this.cinemaSystem.getInventoryProducts();
  }

  getOrderDetails(orderId, ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    if (!this.orders.has(orderId)) {
      return "The order does not exist";
    }
    return this.cinemaSystem.getOrderDetails(orderId);
  }

  getMovieDetails(movieName, ActionIDOfTheOperation) {
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    if (!this.movies.has(movieName)) {
      return "The movie does not exist";
    }
    return this.cinemaSystem.getMovieDetails(this.movies.get(movieName));
  }

  getProductDetails(productName, ActionIDOfTheOperation) {
    console.log('productName', productName);
    if (!this.users.has(ActionIDOfTheOperation)) {
      return "The user performing the operation does not exist in the system";
    }
    if (!this.products.has(productName)) {
      return "The product does not exist";
    }
    return this.cinemaSystem.getProductDetails(this.products.get(productName));
  }

  convertPermissions(permissions) {
    switch (permissions) {
      case "User":
        return [1];
      case "Shift Manager":
        return [1, 2];
      case "Deputy Director":
        return [1, 2, 3];
      case "Director":
        return [1, 2, 3, 4];
      case "admin":
        return [1, 2, 3, 4, 5];
      default:
        return undefined;
    }
  }
}
module.exports = ServiceLayer;
