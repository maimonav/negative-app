const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const ServiceLayer = require("./src/main/ServiceLayer");
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
    const username = req.query.username || "";
    const result = service.isLoggedIn(username);
    res.send(JSON.stringify({ result }));
});

app.get("/api/login", (req, res) => {
    const username = req.query.username || "";
    const password = req.query.password || "";
    const result = service.login(username, password);
    res.send(JSON.stringify({ result }));
});

app.get("/api/logout", (req, res) => {
    const username = req.query.username || "";
    const result = service.logout(username);
    res.send(JSON.stringify({ result }));
});

app.get("/api/register", (req, res) => {
    const username = req.query.username || "";
    const password = req.query.password || "";
    const permissions = req.query.permissions || "";
    const result = service.register(username, password, permissions);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addNewEmployee", (req, res) => {
    const userName = req.query.userName || "";
    const password = req.query.password || "";
    const firstName = req.query.firstName || "";
    const lastName = req.query.lastName || "";
    const permission = req.query.permission || "";
    const contactDetails = req.query.contactDetails || "";
    const user = req.query.user || "";
    const result = service.addNewEmployee(
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

app.get("/api/editEmployee", (req, res) => {
    const userName = req.query.userName || "";
    const password = req.query.password || "";
    const firstName = req.query.firstName || "";
    const lastName = req.query.lastName || "";
    const permission = req.query.permission || "";
    const contactDetails = req.query.contactDetails || "";
    const user = req.query.user || "";
    const result = service.editEmployee(
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

app.get("/api/removeEmployee", (req, res) => {
    const userName = req.query.userName || "";
    const user = req.query.user || "";
    const result = service.deleteEmployee(userName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addMovieOrder", (req, res) => {
    const orderId = req.query.orderId || "";
    const orderDate = req.query.orderDate || "";
    const supplierName = req.query.supplierName || "";
    const moviesName = req.query.moviesName || "";
    const user = req.query.user || "";
    const result = service.addMovieOrder(
        orderId,
        orderDate,
        supplierName,
        moviesName,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/addMovie", (req, res) => {
    const movieName = req.query.movieName || "";
    const category = req.query.category || "";
    const user = req.query.user || "";
    const result = service.addMovie(movieName, category, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/editMovie", (req, res) => {
    const movieName = req.query.movieName || "";
    const category = req.query.category || "";
    const key = req.query.key || "";
    const examinationRoom = req.query.examinationRoom || "";
    const user = req.query.user || "";
    const result = service.editMovie(
        movieName,
        category,
        key,
        examinationRoom,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeMovie", (req, res) => {
    const movieName = req.query.movieName || "";
    const user = req.query.user || "";
    const result = service.removeMovie(movieName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addNewSupplier", (req, res) => {
    const name = req.query.name || "";
    const contactDetails = req.query.contactDetails || "";
    const user = req.query.user || "";
    const result = service.addNewSupplier(name, contactDetails, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/editSupplier", (req, res) => {
    const name = req.query.name || "";
    const contactDetails = req.query.contactDetails || "";
    const user = req.query.user || "";
    const result = service.editSupplier(name, contactDetails, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeSupplier", (req, res) => {
    const name = req.query.name || "";
    const user = req.query.user || "";
    const result = service.removeSupplier(name, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addNewProduct", (req, res) => {
    const productName = req.query.productName || "";
    const productPrice = req.query.productPrice || "";
    const productQuantity = req.query.productQuantity || "";
    const maxQuantity = req.query.maxQuantity || "";
    const minQuantity = req.query.minQuantity || "";
    const productCategory = req.query.productCategory || "";
    const user = req.query.user || "";
    const result = service.addNewProduct(
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

app.get("/api/editProduct", (req, res) => {
    const productName = req.query.productName || "";
    const productPrice = req.query.productPrice || "";
    const maxQuantity = req.query.maxQuantity || "";
    const minQuantity = req.query.minQuantity || "";
    const productCategory = req.query.productCategory || "";
    const user = req.query.user || "";
    const result = service.editProduct(
        productName,
        productPrice,
        maxQuantity,
        minQuantity,
        productCategory,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeProduct", (req, res) => {
    const productName = req.query.productName || "";
    const user = req.query.user || "";
    const result = service.removeProduct(productName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/addCafeteriaOrder", (req, res) => {
    const orderId = req.query.orderId || "";
    const productsName = req.query.productsName || "";
    const supplierName = req.query.supplierName || "";
    const orderDate = req.query.orderDate || "";
    const user = req.query.user || "";
    const result = service.addCafeteriaOrder(
        orderId,
        productsName,
        supplierName,
        orderDate,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/editCafeteriaOrder", (req, res) => {
    const orderId = req.query.orderId || "";
    const productsWithQuantity = req.query.productsWithQuantity || "";
    const orderDate = req.query.orderDate || "";
    const updatedProducts = req.query.updatedProducts || "";
    const user = req.query.user || "";
    const result = service.editCafetriaOrder(
        orderId,
        productsWithQuantity,
        orderDate,
        updatedProducts,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeCafeteriaOrder", (req, res) => {
    const orderId = req.query.orderId || "";
    const user = req.query.user || "";
    const result = service.removeOrder(orderId, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/confirmCafeteriaOrder", (req, res) => {
    const orderId = req.query.orderId || "";
    const productsName = req.query.productsName || "";
    const updatedProductsAndQuantity = req.query.updatedProductsAndQuantity || "";
    const user = req.query.user || "";
    const result = service.editCafetriaOrder(
        orderId,
        productsName,
        updatedProductsAndQuantity,
        user
    );
    res.send(JSON.stringify({ result }));
});

app.get("/api/addCategory", (req, res) => {
    const categoryName = req.query.categoryName || "";
    const user = req.query.user || "";
    const result = service.addCategory(categoryName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/removeCategory", (req, res) => {
    const categoryName = req.query.categoryName || "";
    const user = req.query.user || "";
    const result = service.removeCategory(categoryName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getSuppliers", (req, res) => {
    const user = req.query.user || "";
    const result = service.getSuppliers(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getSupplierDetails", (req, res) => {
    const supplier = req.query.supplier || "";
    const user = req.query.user || "";
    const result = service.getSupplierDetails(supplier, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getEmployees", (req, res) => {
    const user = req.query.user || "";
    const result = service.getEmployees(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getEmployeeDetails", (req, res) => {
    const employee = req.query.employee || "";
    const user = req.query.user || "";
    const result = service.getEmployeeDetails(employee, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getMovies", (req, res) => {
    const user = req.query.user || "";
    const result = service.getMovies(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getCategories", (req, res) => {
    const user = req.query.user || "";
    const result = service.getCategories(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getCafeteriaProducts", (req, res) => {
    const user = req.query.user || "";
    const result = service.getCafeteriaProducts(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getCafeteriaOrders", (req, res) => {
    const user = req.query.user || "";
    const result = service.getCafeteriaProducts(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getInventoryProducts", (req, res) => {
    const user = req.query.user || "";
    const result = service.getInventoryProducts(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getItemsByDates", (req, res) => {
    const user = req.query.user || "";
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    const result = service.getCafeteriaOrders(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getProductsByOrder", (req, res) => {
    const user = req.query.user || "";
    const orderName = req.query.orderName || "";
    const result = service.getCafeteriaProducts(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getOrderDetails", (req, res) => {
    const order = req.query.order || "";
    const user = req.query.user || "";
    const result = service.getOrderDetails(order, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getMovieDetails", (req, res) => {
    const movieName = req.query.movieName || "";
    const user = req.query.user || "";
    const result = service.getMovieDetails(movieName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getProductDetails", (req, res) => {
    const productName = req.query.productName || "";
    const user = req.query.user || "";
    const result = service.getProductDetails(productName, user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getProductAndQuntityByOrder", (req, res) => {
    const user = req.query.user || "";
    const orderName = req.query.orderName || "";
    const result = service.getProductsAndQuantityByOrder(user, orderName);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getReportTypes", (req, res) => {
    const user = req.query.user || "";
    const result = service.getReportTypes(user);
    res.send(JSON.stringify({ result }));
});

app.get("/api/getReport", (req, res) => {
    const reportType = req.query.reportType || "";
    const date = req.query.date || "";
    const user = req.query.user || "";
    const result = service.getReport(reportType, date, user);
    res.send(JSON.stringify({ result }));
});

app.listen(3001, () => {
    console.log("Express server is running on localhost:3001");
});