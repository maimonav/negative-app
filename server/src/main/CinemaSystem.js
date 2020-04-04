const data = require("../../consts/data");
const DataBase = require("./DBManager");
const ReportController = require("./ReportController");
const logger = require('simple-node-logger').createSimpleLogger('project.log');
const User = require("./User");
class CinemaSystem {
    constructor(dbName) {
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



        DataBase.connectAndCreate().then(async() => {
            if (dbName)
                DataBase.initDB(dbName);
            else
                DataBase.init();
            this.users.set(0, new User(0, "admin", "admin", 'ADMIN'));
            ReportController.init();
        });
    }
    UserDetailsCheck(userName, password, permissions) {
        let err = "";
        if (userName === undefined || userName === "")
            err += "User name ";
        if (password === undefined || password === "") {
            if (err !== "")
                err += ', ';
            err += "Password ";
        }
        let test = User.getPermissionTypeList()
        if (permissions === undefined || !(User.getPermissionTypeList().hasOwnProperty(permissions))) {
            if (err !== "")
                err += ', ';
            err += "Permission ";
        }
        if (err !== "")
            err = "The following data provided is invalid: " + err;
        return err;
    }

    register(id, userName, password, permissions) {
        if (this.users.has(id)) return "The id is already exists";
        const argCheckRes = this.UserDetailsCheck(userName, password, permissions);
        if (argCheckRes !== "") {
            logger.info('CinemaSystem - register - ' + argCheckRes);
            return argCheckRes;
        }
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
        //notes- checkuser
    addNewEmployee(userID, userName, password, permissions, firstName, lastName, contactDetails, ActionIDOfTheOperation) {
        if (this.users.has(userID)) return "The id is already exists";
        if (!this.users.has(ActionIDOfTheOperation) || !this.users.get(ActionIDOfTheOperation).isLoggedin()) {
            logger.info('CinemaSystem - addNewEmployee - ' + this.userOfflineMsg);
            return this.userOfflineMsg;
        }
        if (!this.users.get(ActionIDOfTheOperation).permissionCheck('DEPUTY_MANAGER')) {
            logger.info('CinemaSystem - addNewEmployee - ' + userName + " " + this.inappropriatePermissionsMsg);
            return this.inappropriatePermissionsMsg;
        }
        const argCheckRes = this.UserDetailsCheck(userName, password, permissions);
        if (argCheckRes !== "") {
            logger.info('CinemaSystem - register - ' + argCheckRes);
            return argCheckRes;
        }
        let employee = this.employeeManagement.addNewEmployee(userID, userName, password, permissions, firstName, lastName, contactDetails);
        if (employee === "The employee already exist") {
            logger.info('CinemaSystem - addNewEmployee - The employee' + userName + "already exist ");
            return "The id is already exists";
        }
        this.users.set(userID, employee);
        return "The employee registered successfully.";
    }

    editEmployee(employeeID, password, permissions, firstName, lastName, contactDetails, ActionIDOfTheOperation) {
        if (!this.users.has(employeeID)) return "The id is not exists";
        if (!this.users.has(ActionIDOfTheOperation) || !this.users.get(ActionIDOfTheOperation).isLoggedin()) {
            logger.info('CinemaSystem - editEmployee - ' + this.userOfflineMsg);
            return this.userOfflineMsg;
        }
        if (!this.users.get(ActionIDOfTheOperation).permissionCheck('DEPUTY_MANAGER') || ActionIDOfTheOperation !== employeeID) {
            logger.info('CinemaSystem - editEmployee - ' + userName + " " + this.inappropriatePermissionsMsg);
            return this.inappropriatePermissionsMsg;
        }
        return this.employeeManagement.editEmployee(employeeID, password, permissions, firstName, lastName, contactDetails);
    }

    deleteEmployee(employeeID, ActionIDOfTheOperation) {
        if (!this.users.has(employeeID)) return "The id is not exists";
        if (!this.users.has(ActionIDOfTheOperation) || !this.users.get(ActionIDOfTheOperation).isLoggedin()) {
            logger.info('CinemaSystem - deleteEmployee - ' + this.userOfflineMsg);
            return this.userOfflineMsg;
        }
        if (!this.users.get(ActionIDOfTheOperation).permissionCheck('DEPUTY_MANAGER')) {
            logger.info('CinemaSystem - deleteEmployee - ' + this.inappropriatePermissionsMsg);
            return this.inappropriatePermissionsMsg;
        }
        if (employeeID === ActionIDOfTheOperation) {
            logger.info('CinemaSystem - deleteEmployee - A user cannot erase himself');
            return "A user cannot erase himself";
        }
        if (this.users.get(employeeID).isLoggedin()) {
            logger.info('CinemaSystem - deleteEmployee - A user cannot delete a logged in user');
            return "You cannot delete a logged in user";
        }
        let res = this.employeeManagement.deleteEmployee(employeeID);
        if (res === "Successfully deleted employee data deletion")
            this.users.delete(employeeID);
        return res;
    }

    checkUser(ActionIDOfTheOperation, permissionRequired, functionName) {
        if ((!this.users.has(ActionIDOfTheOperation) || !this.users.get(ActionIDOfTheOperation).isLoggedin())) {
            logger.info('CinemaSystem - ' + functionName + ' - ' + this.userOfflineMsg);
            return this.userOfflineMsg;
        }
        if (!this.users.get(ActionIDOfTheOperation).permissionCheck(permissionRequired)) {
            logger.info('CinemaSystem - ' + functionName + ' - ' + this.inappropriatePermissionsMsg);
            return this.inappropriatePermissionsMsg;
        }
        return null;
    }




    addMovie(movieId, movieName, categoryId, ActionIDOfTheOperation) {
        let result = this.checkUser(ActionIDOfTheOperation, 'DEPUTY_MANAGER', 'addMovie');
        if (result != null)
            return result;
        return this.inventoryManagement.addMovie(movieId, movieName, categoryId);

    }

    //TODO
    editMovie(movieID, categoryId, key, examinationRoom, ActionIDOfTheOperation) {
        let result = this.checkUser(ActionIDOfTheOperation, 'DEPUTY_MANAGER', 'editMovie');
        if (result != null)
            return result;
        return this.inventoryManagement.editMovie(movieID, categoryId, key, examinationRoom);
    }

    removeMovie(movieID, ActionIDOfTheOperation) {
        let result = this.checkUser(ActionIDOfTheOperation, 'DEPUTY_MANAGER', 'removeMovie');
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

    addMovieOrder(
        orderId,
        date,
        supplierId,
        movieIdList,
        ActionIDOfTheOperation){
        let result = this.checkUser(ActionIDOfTheOperation, 'DEPUTY_MANAGER', 'addMovieOrder');
        if (result != null)
            return result;
        return this.inventoryManagement.addMovieOrder(orderId,date,supplierId,movieIdList, ActionIDOfTheOperation);

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

    createDailyReport(
        type,
        records,
        ActionIDOfTheOperation
    ) {
        let result = this.checkUser(ActionIDOfTheOperation);
        if (result != null)
            return result;
        return ReportController.createDailyReport(type, records);
    }

    getReport(
        type,
        date,
        ActionIDOfTheOperation
    ) {
        let result = this.checkUser(ActionIDOfTheOperation);
        if (result != null)
            return result;
        return ReportController.getReport(type, date);
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

    getOrderDetails() {
        //TODO: IMPLEMENT THIS.
        return data.orderDetails;
    }

    getMovieDetails() {
        //TODO: IMPLEMENT THIS.
        return data.movieDetails;
    }

    getProductDetails() {
        //TODO: IMPLEMENT THIS.
        return data.productDetails;
    }
}

module.exports = CinemaSystem;