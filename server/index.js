const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const ServiceLayer = require("./src/main/ServiceLayer");
const logger = require("simple-node-logger").createSimpleLogger("project.log");
const service = new ServiceLayer();
service.initSeviceLayer().then((result) => {
    if (typeof result === "string") {
        //TODO::
    }
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get("/api/isLoggedIn", (req, res) => {
    const username = (req.query.username && req.query.username.trim()) || "";
    const result = service.isLoggedIn(username);
    res.send(JSON.stringify({ result }));
});

app.get("/api/login", (req, res) => {
    const username = (req.query.username && req.query.username.trim()) || "";
    const password = (req.query.password && req.query.password.trim()) || "";
    const result = service.login(username, password);
    res.send(JSON.stringify({ result }));
});

app.get("/api/logout", (req, res) => {
    const username = (req.query.username && req.query.username.trim()) || "";
    const result = service.logout(username);
    res.send(JSON.stringify({ result }));
});

app.get("/api/register", (req, res) => {
    const username = (req.query.username && req.query.username.trim()) || "";
    const password = (req.query.password && req.query.password.trim()) || "";
    const permissions =
        (req.query.permissions && req.query.permissions.trim()) || "";
    const result = service.register(username, password, permissions);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addNewEmployee", async(req, res) => {
    const userName = (req.query.userName && req.query.userName.trim()) || "";
    const password = (req.query.password && req.query.password.trim()) || "";
    const firstName = (req.query.firstName && req.query.firstName.trim()) || "";
    const lastName = (req.query.lastName && req.query.lastName.trim()) || "";
    const permission =
        (req.query.permission && req.query.permission.trim()) || "";
    const contactDetails =
        (req.query.contactDetails && req.query.contactDetails.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.addNewEmployee(
        userName,
        password,
        firstName,
        lastName,
        permission,
        contactDetails,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/editEmployee", async(req, res) => {
    const userName = (req.query.userName && req.query.userName.trim()) || "";
    const password = (req.query.password && req.query.password.trim()) || null;
    const firstName = (req.query.firstName && req.query.firstName.trim()) || null;
    const lastName = (req.query.lastName && req.query.lastName.trim()) || null;
    const permission =
        (req.query.permission && req.query.permission.trim()) || null;
    const contactDetails =
        (req.query.contactDetails && req.query.contactDetails.trim()) || null;
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.editEmployee(
        userName,
        password,
        permission,
        firstName,
        lastName,
        contactDetails,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeEmployee", async(req, res) => {
    const userName = (req.query.userName && req.query.userName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.deleteEmployee(userName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addMovieOrder", async(req, res) => {
    const orderId = (req.query.orderId && req.query.orderId.trim()) || "";
    const orderDate = (req.query.orderDate && req.query.orderDate.trim()) || "";
    const supplierName =
        (req.query.supplierName && req.query.supplierName.trim()) || "";
    const moviesName =
        (req.query.moviesName && req.query.moviesName.trim()) || "";
    const moviesList = JSON.parse(moviesName);
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.addMovieOrder(
        orderId,
        orderDate,
        supplierName,
        moviesList,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/addMovie", async(req, res) => {
    const movieName = (req.query.movieName && req.query.movieName.trim()) || "";
    const category = (req.query.category && req.query.category.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.addMovie(movieName, category, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/editMovie", async(req, res) => {
    const movieName = (req.query.movieName && req.query.movieName.trim()) || "";
    const category = (req.query.category && req.query.category.trim()) || "";
    const key = (req.query.key && req.query.key.trim()) || "";
    const examinationRoom =
        (req.query.examinationRoom && req.query.examinationRoom.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.editMovie(
        movieName,
        category,
        key,
        examinationRoom,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeMovie", async(req, res) => {
    const movieName = (req.query.movieName && req.query.movieName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.removeMovie(movieName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addNewSupplier", async(req, res) => {
    const name = (req.query.name && req.query.name.trim()) || "";
    const contactDetails =
        (req.query.contactDetails && req.query.contactDetails.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.addNewSupplier(name, contactDetails, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/editSupplier", async(req, res) => {
    const name = (req.query.name && req.query.name.trim()) || "";
    const contactDetails =
        (req.query.contactDetails && req.query.contactDetails.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.editSupplier(name, contactDetails, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeSupplier", async(req, res) => {
    const name = (req.query.name && req.query.name.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.removeSupplier(name, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addNewProduct", async(req, res) => {
    const productName =
        (req.query.productName && req.query.productName.trim()) || "";
    const productPrice =
        (req.query.productPrice && req.query.productPrice.trim()) || "";
    const productQuantity =
        (req.query.productQuantity && req.query.productQuantity.trim()) || "";
    const maxQuantity =
        (req.query.maxQuantity && req.query.maxQuantity.trim()) || "";
    const minQuantity =
        (req.query.minQuantity && req.query.minQuantity.trim()) || "";
    const productCategory =
        (req.query.productCategory && req.query.productCategory.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.addNewProduct(
        productName,
        productPrice,
        productQuantity,
        maxQuantity,
        minQuantity,
        productCategory,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/editProduct", async(req, res) => {
    const productName =
        (req.query.productName && req.query.productName.trim()) || "";
    const productPrice =
        (req.query.productPrice && req.query.productPrice.trim()) || "";
    const productQuantity =
        (req.query.productQuantity && req.query.productQuantity.trim()) || "";
    const maxQuantity =
        (req.query.maxQuantity && req.query.maxQuantity.trim()) || "";
    const minQuantity =
        (req.query.minQuantity && req.query.minQuantity.trim()) || "";
    const productCategory =
        (req.query.productCategory && req.query.productCategory.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.editProduct(
        productName,
        productPrice,
        productQuantity,
        minQuantity,
        maxQuantity,
        productCategory,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeProduct", async(req, res) => {
    const productName =
        (req.query.productName && req.query.productName.trim()) || "";
    console.log("req.query.productName:", req.query.productName.trim());
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.removeProduct(productName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addCafeteriaOrder", async(req, res) => {
    const orderId = (req.query.orderId && req.query.orderId.trim()) || "";
    const products =
        (req.query.productsList && req.query.productsList.trim()) || "";
    const productsList = JSON.parse(products);
    const supplierName =
        (req.query.supplierName && req.query.supplierName.trim()) || "";
    const orderDate = (req.query.orderDate && req.query.orderDate.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.addCafeteriaOrder(
        orderId,
        orderDate,
        supplierName,
        productsList,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/editCafeteriaOrder", (req, res) => {
    const orderId = (req.query.orderId && req.query.orderId.trim()) || "";
    const productsWithQuantity =
        (req.query.productsWithQuantity && req.query.productsWithQuantity.trim()) ||
        "";
    const orderDate = (req.query.orderDate && req.query.orderDate.trim()) || "";
    const updatedProducts =
        (req.query.updatedProducts && req.query.updatedProducts.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.editCafeteriaOrder(
        orderId,
        productsWithQuantity,
        orderDate,
        updatedProducts,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/RemoveOrder", (req, res) => {
    const orderId = (req.query.orderId && req.query.orderId.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.removeOrder(orderId, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/confirmCafeteriaOrder", (req, res) => {
    const orderId = (req.query.orderId && req.query.orderId.trim()) || "";
    const productsName =
        (req.query.productsName && req.query.productsName.trim()) || "";
    const updatedProductsAndQuantity =
        (req.query.updatedProductsAndQuantity &&
            req.query.updatedProductsAndQuantity.trim()) ||
        "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.editCafetriaOrder(
        orderId,
        productsName,
        updatedProductsAndQuantity,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/addCategory", async(req, res) => {
    const categoryName =
        (req.query.categoryName && req.query.categoryName.trim()) || "";
    const parentName =
        (req.query.parentName && req.query.parentName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.addCategory(categoryName, user, parentName);
    res.send(JSON.stringify({ result }));
});

app.get("/api/editCategory", async(req, res) => {
    const categoryName =
        (req.query.categoryName && req.query.categoryName.trim()) || "";
    const parentName =
        (req.query.parentName && req.query.parentName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.editCategory(categoryName, user, parentName);
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeCategory", async(req, res) => {
    const categoryName =
        (req.query.categoryName && req.query.categoryName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.removeCategory(categoryName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getSuppliers", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getSuppliers(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getSupplierDetails", (req, res) => {
    const supplier = (req.query.supplier && req.query.supplier.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getSupplierDetails(supplier, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getEmployees", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getEmployees(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getEmployeeDetails", (req, res) => {
    const employee = (req.query.employee && req.query.employee.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getEmployeeDetails(employee, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getMovies", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getMovies(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getCategories", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getCategories(user);
    console.log("result = ");
    result.map((category) => console.log(category));
    res.send(JSON.stringify({ result }));
});

app.get("/api/getCafeteriaProducts", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getCafeteriaProducts(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getCafeteriaOrders", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getCafeteriaOrders();
    res.send(JSON.stringify({ result }));
});

app.get("/api/getInventoryProducts", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getInventoryProducts(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getOrdersByDates", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const startDate = (req.query.startDate && req.query.startDate.trim()) || "";
    const endDate = (req.query.endDate && req.query.endDate.trim()) || "";
    const result = service.getOrdersByDates(startDate, endDate, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getProductsByOrder", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const orderName = (req.query.orderName && req.query.orderName.trim()) || "";
    const result = service.getProductsByOrder(orderName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getOrderDetails", (req, res) => {
    const order = (req.query.order && req.query.order.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getOrderDetails(order, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getMovieDetails", (req, res) => {
    const movieName = (req.query.movieName && req.query.movieName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getMovieDetails(movieName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getProductDetails", (req, res) => {
    const productName =
        (req.query.productName && req.query.productName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getProductDetails(productName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getCategoryDetails", (req, res) => {
    const categoryName =
        (req.query.categoryName && req.query.categoryName.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getCategoryDetails(categoryName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getProductAndQuntityByOrder", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const orderName = (req.query.orderName && req.query.orderName.trim()) || "";
    const result = service.getProductsAndQuantityByOrder(orderName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getReportTypes", (req, res) => {
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = service.getReportTypes(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getReport", async(req, res) => {
    const reportType =
        (req.query.reportType && req.query.reportType.trim()) || "";
    const date = (req.query.date && req.query.date.trim()) || "";
    const user = (req.query.user && req.query.user.trim()) || "";
    const result = await service.getReport(reportType, date, user);
    res.send(JSON.stringify({ result }));
});

app.listen(3001, () => {
    console.log("Express server is running on localhost:3001");
});