const Order = require("./Order");
const Movie = require("./Movie");
let DB = require("./DataLayer/DBManager");
const Supplier = require("./Supplier");
const CafeteriaProduct = require("./CafeteriaProduct");
const Category = require("./Category");
const simpleLogger = require("simple-node-logger");
const logger = simpleLogger.createSimpleLogger("project.log");
const DBlogger = simpleLogger.createSimpleLogger({
    logFilePath: "database.log",
    timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});

class InventoryManagemnt {
    constructor() {
        this.products = new Map();
        this.orders = new Map();
        this.suppliers = new Map();
        this.categories = new Map();
    }

    async addMovie(movieId, name, categoryId) {
        if (this.products.has(movieId)) {
            this.writeToLog(
                "info",
                "addMovie",
                "This movie " + movieId + " already exists"
            );
            return "This movie already exists";
        }
        if (!this.categories.has(categoryId)) {
            this.writeToLog(
                "info",
                "addMovie",
                "Category " + categoryId + " doesn't exist"
            );
            return "Category doesn't exist";
        }
        let movie = new Movie(movieId, name, categoryId);
        let result = await movie.initMovie();
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - addMovie - ", result);
            return "The movie cannot be added\n" + result;
        }
        this.products.set(movieId, movie);
        return "The movie added successfully";
    }

    async editMovie(movieId, categoryId, key, examinationRoom) {
        if (!this.products.has(movieId)) {
            this.writeToLog(
                "info",
                "editMovie",
                "The movie " + movieId + " does not exist"
            );
            return "The movie does not exist";
        }
        if (!this.categories.has(categoryId)) {
            this.writeToLog(
                "info",
                "editMovie",
                "Category " + categoryId + " does not exist"
            );
            return "Category doesn't exist";
        }
        if (examinationRoom < 0) {
            this.writeToLog(
                "info",
                "editMovie",
                "The examination room " + examinationRoom + " is invalid"
            );
            return "The examination room is invalid";
        }
        let result = await this.products
            .get(movieId)
            .editMovie(categoryId, key, examinationRoom);
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - editMovie - ", result);
            return "The movie cannot be edited\n" + result;
        }
        return "The movie edited successfully";
    }

    async removeMovie(movieId) {
        if (!this.products.has(movieId)) {
            this.writeToLog(
                "info",
                "removeMovie",
                "The movie " + movieId + " does not exist"
            );
            return "The movie does not exist";
        }
        let result = await this.products.get(movieId).removeMovie();
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - removeMovie - ", result);
            return "The movie cannot be removed\n" + result;
        }
        this.products.delete(movieId);
        return "The movie removed successfully";
    }

    async addNewSupplier(supplierID, supplierName, contactDetails) {
        if (this.suppliers.has(supplierID)) {
            this.writeToLog(
                "info",
                "addNewSupplier",
                "This supplier " + supplierID + " already exists"
            );
            return "This supplier already exists";
        }
        let supplier = new Supplier(supplierID, supplierName, contactDetails);
        let result = await supplier.initSupplier();
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - addNewSupplier - ", result);
            return "The supplier cannot be added\n" + result;
        }
        this.suppliers.set(supplierID, supplier);
        return "The supplier added successfully";
    }

    async editSupplier(supplierID, supplierName, contactDetails) {
        if (!this.suppliers.has(supplierID)) {
            this.writeToLog(
                "info",
                "editSupplier",
                "The supplier " + supplierID + " does not exist"
            );
            return "The supplier does not exist";
        }
        let result = await this.suppliers
            .get(supplierID)
            .editSupplier(supplierName, contactDetails);
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - editSupplier - ", result);
            return "The supplier cannot be edited\n" + result;
        }
        return "The supplier edited successfully";
    }

    async removeSupplier(supplierID) {
        if (!this.suppliers.has(supplierID)) {
            this.writeToLog(
                "info",
                "removeSupplier",
                "The supplier " + supplierID + " does not exist"
            );
            return "The supplier does not exist";
        }
        let result = await this.suppliers.get(supplierID).removeSupplier();
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - removeSupplier - ", result);
            return "The supplier cannot be removed\n" + result;
        }
        this.suppliers.delete(supplierID);
        return "The supplier removed successfully";
    }

    async addMovieOrder(
        orderId,
        strDate,
        supplierId,
        movieIdList,
        creatorEmployeeId
    ) {
        if (this.orders.has(orderId)) {
            this.writeToLog(
                "info",
                "addMovieOrder",
                "This order " + orderId + " already exists"
            );
            return "This order already exists";
        }
        if (!this.suppliers.has(supplierId)) {
            this.writeToLog(
                "info",
                "addMovieOrder",
                "The supplier " + supplierId + " does not exist"
            );
            return "The supplier does not exist";
        }
        for (let i in movieIdList) {
            if (!this.products.has(movieIdList[i])) {
                this.writeToLog(
                    "info",
                    "addMovieOrder",
                    "The movie " + movieIdList[i] + " does not exist"
                );
                return "Movie does not exist";
            }
        }
        let date = new Date(strDate);
        if (isNaN(date.valueOf())) {
            this.writeToLog(
                "info",
                "addMovieOrder",
                "The order date " + strDate + " is invalid"
            );
            return "The order date is invalid";
        }
        let order = new Order(orderId, supplierId, date, creatorEmployeeId);

        //Database
        let orderObject = order.getOrderAdditionObject();
        let actionsList = [orderObject];
        for (let i in movieIdList) {
            let movieId = movieIdList[i];
            actionsList = actionsList.concat({
                name: DB.add,
                model: "movie_order",
                params: { element: { orderId: orderId, movieId: movieId } },
            });
        }
        let result = await DB.executeActions(actionsList);
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - addMovieOrder - ", result);
            return "The order cannot be added\n" + result;
        }

        //System
        for (let i in movieIdList) {
            let movieId = movieIdList[i];
            let movie = this.products.get(movieId);
            let movieOrder = movie.createOrder(order);
            order.productOrders.set(movieId, movieOrder);
        }
        this.orders.set(orderId, order);
        return "The order added successfully";
    }

    async removeOrder(orderId) {
        if (!this.orders.has(orderId)) {
            this.writeToLog(
                "info",
                "removeOrder",
                "The order " + orderId + " does not exist"
            );
            return "This order does not exist";
        }
        if (this.orders.get(orderId).recipientEmployeeId != null) {
            this.writeToLog(
                "info",
                "removeOrder",
                "Removing supplied order " + orderId + " is not allowed"
            );
            return "Removing supplied orders is not allowed";
        }

        let order = this.orders.get(orderId);

        //Database
        let actionsList = order.getOrderRemovingObjectsList();

        let result = await DB.executeActions(actionsList);
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - removeOrder - ", result);
            return "The order cannot be removed\n" + result;
        }

        //System
        this.orders.get(orderId).removeProductOrders();
        this.orders.delete(orderId);
        return "The order removed successfully";
    }

    async addCafeteriaOrder(
        orderId,
        strDate,
        supplierId,
        productsList,
        creatorEmployeeId
    ) {
        if (this.orders.has(orderId)) {
            this.writeToLog(
                "info",
                "addCafeteriaOrder",
                "This order " + orderId + " already exists"
            );
            return "This order already exists";
        }
        if (!this.suppliers.has(supplierId)) {
            this.writeToLog(
                "info",
                "addCafeteriaOrder",
                "The supplier " + supplierId + " does not exist"
            );
            return "The supplier does not exist";
        }
        for (let i in productsList) {
            if (!this.products.has(productsList[i].id)) {
                this.writeToLog(
                    "info",
                    "addCafeteriaOrder",
                    "The product " + productsList[i].id + " does not exist"
                );
                return "Product does not exist";
            }
            if (productsList[i].quantity < 0) {
                this.writeToLog(
                    "info",
                    "addCafeteriaOrder",
                    "The quantity " + productsList[i].quantity + " is invalid"
                );
                return "Quantity inserted is invalid";
            }
        }
        let date = new Date(strDate);
        if (isNaN(date.valueOf())) {
            this.writeToLog(
                "info",
                "addCafeteriaOrder",
                "The order date " + strDate + " is invalid"
            );
            return "The order date is invalid";
        }

        let order = new Order(orderId, supplierId, date, creatorEmployeeId);

        //Database
        let orderObject = order.getOrderAdditionObject();
        let actionsList = [orderObject];
        for (let i in productsList) {
            let productId = productsList[i].id;
            let quantity = productsList[i].quantity;
            actionsList = actionsList.concat({
                name: DB.add,
                model: "cafeteria_product_order",
                params: {
                    element: {
                        orderId: orderId,
                        productId: productId,
                        expectedQuantity: quantity,
                    },
                },
            });
        }
        let result = await DB.executeActions(actionsList);
        if (typeof result === "string") {
            DBlogger.info("InventoryManagemnt - addCafeteriaOrder - ", result);
            return "The order cannot be added\n" + result;
        }

        //System
        for (let i in productsList) {
            let productId = productsList[i].id;
            let quantity = productsList[i].quantity;
            let product = this.products.get(productId);
            let productOrder = product.createOrder(order, quantity);
            order.productOrders.set(productId, productOrder);
        }
        this.orders.set(orderId, order);
        return "The order added successfully";
    }

    async addCafeteriaProduct(
        productId,
        name,
        categoryID,
        price,
        quantity,
        maxQuantity,
        minQuantity
    ) {
        if (this.products.has(productId)) {
            this.writeToLog(
                "info",
                "addCafeteriaProduct",
                "This product already exists"
            );
            return "This product already exists";
        }
        if (!this.categories.has(categoryID)) {
            this.writeToLog("info", "addCafeteriaProduct", "Category doesn't exist");
            return "Category doesn't exist";
        }
        if (price <= 0) {
            this.writeToLog(
                "info",
                "addCafeteriaProduct",
                "Product price must be greater than 0"
            );
            return "Product price must be greater than 0";
        }
        if (quantity < 0) {
            this.writeToLog(
                "info",
                "addCafeteriaProduct",
                "Product quantity must be greater or equal to 0"
            );
            return "Product quantity must be greater or equal to 0";
        }
        if (
            typeof maxQuantity !== "undefined" &&
            typeof minQuantity !== "undefined" &&
            maxQuantity <= minQuantity
        ) {
            this.writeToLog(
                "info",
                "addCafeteriaProduct",
                "Maximum product quantity must be greater than minimum product quantity"
            );
            return "Maximum product quantity must be greater than minimum product quantity";
        }
        const productToInsert = new CafeteriaProduct(
            productId,
            name,
            categoryID,
            price,
            quantity,
            maxQuantity,
            minQuantity
        );
        let result = await productToInsert.initCafeteriaProduct();
        if (typeof result === "string") {
            this.writeToLog(
                "error",
                "addCafeteriaProduct",
                "The operation failed - DB failure -" + result
            );
            return "The operation failed - DB failure -" + result;
        }
        this.products.set(productToInsert.id, productToInsert);
        return "The product was successfully added to the system";
    }

    async editCafeteriaProduct(
        productId,
        categoryId,
        price,
        quantity,
        maxQuantity,
        minQuantity
    ) {
        if (!this.products.has(productId)) return "This product not exists";
        return await this.products
            .get(productId)
            .editProduct(categoryId, price, quantity, maxQuantity, minQuantity);
    }

    removeCafeteriaProduct = async(productId) => {
        if (!this.products.has(productId)) return "This product not exists";
        let result = await this.products.get(productId).removeProduct();
        if (typeof result === "string") {
            this.writeToLog("error", "removeCafeteriaProduct", result);
            return result;
        }
        this.products.delete(productId);
        return result;
    };
    getSuppliers() {
        const output = [];
        this.suppliers.forEach((supplier) => {
            const value = { title: supplier.name };
            output.push(value);
        });
        return output;
    }

    getCategories() {
        const output = [];
        this.categories.forEach((category) => {
            const value = {
                title: category.name,
            };
            output.push(value);
        });
        return output;
    }

    getCafeteriaProducts() {
        const output = [];
        this.products.forEach((product) => {
            if (product instanceof CafeteriaProduct) {
                const value = {
                    title: product.name,
                };
                output.push(value);
            }
        });
        return output;
    }

    getMovies() {
        const output = [];
        this.products.forEach((movie) => {
            if (movie instanceof Movie) {
                const value = {
                    title: movie.name,
                };
                output.push(value);
            }
        });
        return output;
    }

    getInventoryProducts() {
        const output = {};
        let cafiteriaProducts = this.getCafeteriaProducts();
        let movies = this.getMovies();

        Object.keys(cafiteriaProducts).forEach((productID) => {
            output[productID] = {
                type: "CafeteriaProduct",
                product: cafiteriaProducts[productID],
            };
        });

        Object.keys(movies).forEach((productID) => {
            output[productID] = { type: "Movie", product: movies[productID] };
        });

        return output;
    }

    getSupplierDetails(supplierID) {
        const output = {};
        if (this.suppliers.has(supplierID)) {
            const supplier = this.suppliers.get(supplierID);
            return {
                id: supplier.id,
                name: supplier.name,
                contactDetails: supplier.contactDetails,
            };
        }
        return output;
    }

    mapToObj(inputMap) {
        let obj = {};

        inputMap.forEach(function(value, key) {
            obj[key] = value;
        });

        return obj;
    }

    getOrderDetails(orderId) {
        if (this.orders.has(orderId)) {
            const order = this.orders.get(orderId);
            const supplierName = this.suppliers.has(order.supplierId) ?
                this.suppliers.get(order.supplierId).name :
                -1;
            return {
                orderId: order.id,
                orderDate: order.date,
                supplierDetails: supplierName,
                products: this.mapToObj(order.productOrders),
            };
        }
        return {};
    }

    getMovieDetails(movieID) {
        if (this.products.has(movieID)) {
            const movie = this.products.get(movieID);
            if (movie instanceof Movie) {
                return {
                    movieName: movie.name,
                    category: this.categories.get(movie.categoryId).name,
                    movieKey: movie.movieKey,
                    examinationRoom: movie.examinationRoom,
                };
            }
        }
        return {};
    }

    getCafeteriaProductDetails(productID) {
        const output = {};
        if (this.products.has(productID)) {
            let productMaxQuantityToRepresnt;
            const product = this.products.get(productID);
            if (product.maxQuantity !== 9999999)
                productMaxQuantityToRepresnt = product.maxQuantity;
            return {
                productName: product.name,
                productCategory: this.categories.get(product.categoryId).name,
                productPrice: product.price,
                productQuantity: product.quantity,
                productMaxQunatity: productMaxQuantityToRepresnt,
                productMimQunatity: product.minQuantity,
            };
        }
        return output;
    }

    async addCategory(categoryId, categoryName, parentID) {
        if (this.categories.has(categoryId)) {
            this.writeToLog(
                "info",
                "addCategory",
                "The Category " + categoryId + " already exist"
            );
            return "The Category ID already exist";
        }
        if (parentID !== undefined && !this.categories.has(parentID)) {
            this.writeToLog(
                "info",
                "addCategory",
                "The parent category " + parentID + " doesn't exist"
            );
            return "The parent category  doesn't exist";
        }
        const categoryToInsert = new Category(categoryId, categoryName, parentID);
        let result = await categoryToInsert.initCategory();
        if (typeof result === "string") {
            this.writeToLog(
                "error",
                "addCategory",
                "The operation failed - DB failure" + result
            );
            return result;
        }
        this.categories.set(categoryToInsert.id, categoryToInsert);
        return "The category was successfully added to the system";
    }

    async editCategory(categoryId, parentID) {
        if (!this.categories.has(categoryId)) {
            this.writeToLog(
                "info",
                "editCategory",
                "The Category " + categoryId + " doesn't exist"
            );
            return "The Category ID doesn't exist";
        }
        if (
            parentID !== undefined &&
            !this.categories.has(parentID) &&
            parentID !== -1
        ) {
            this.writeToLog(
                "info",
                "editCategory",
                "The parent category " + parentID + " doesn't exist"
            );
            return "The parent category  doesn't exist";
        }
        let result = await this.categories.get(categoryId).editCategory(parentID);
        if (typeof result === "string") {
            this.writeToLog(
                "error",
                "editCategory",
                "The operation failed - DB failure" + result
            );
            return result;
        }
        return "The category was successfully updateded";
    }
    async removeCategory(categoryId) {
        if (!this.categories.has(categoryId)) {
            this.writeToLog(
                "info",
                "removeCategory",
                "The Category " + categoryId + " doesn't exist"
            );
            return "The Category ID doesn't exist";
        }
        const categoryToRemove = this.categories.get(categoryId);
        if (categoryToRemove.isCategoryRemoved !== null) {
            this.writeToLog("info", "removeCategory", "The category already removed");
            return "The category already removed";
        }
        //DB
        let DBActionList = [];
        //Product category setup;
        this.products.forEach((product) => {
            if (product.categoryId === categoryToRemove.id) {
                if (product instanceof CafeteriaProduct) {
                    DBActionList.push({
                        name: DB.update,
                        model: "cafeteria_product",
                        params: {
                            where: {
                                id: product.id,
                            },
                            element: {
                                categoryId: categoryToRemove.parentId,
                            },
                        },
                    });
                } else {
                    DBActionList.push({
                        name: DB.update,
                        model: "movie",
                        params: {
                            where: {
                                id: product.id,
                            },
                            element: {
                                categoryId: categoryToRemove.parentId,
                            },
                        },
                    });
                }
            }
        });
        //categories tree arrnge
        this.categories.forEach((category) => {
            if (category.parentId === categoryToRemove.id)
                DBActionList.push({
                    name: DB.update,
                    model: "category",
                    params: {
                        where: {
                            id: category.id,
                        },
                        element: {
                            parentId: categoryToRemove.parentId,
                        },
                    },
                });
        });
        //remove the category from DB
        DBActionList.push({
            name: DB.update,
            model: "category",
            params: {
                where: {
                    id: categoryId,
                },
                element: {
                    isCategoryRemoved: new Date(),
                },
            },
        });

        let result = await DB.executeActions(DBActionList);
        if (typeof result === "string") {
            this.writeToLog("error", "removeCategory", "DB failure - " + result);
            return "DB failure - " + result;
        }
        this.products.forEach((product) => {
            if (product.categoryId === categoryToRemove.id) {
                product.categoryId = categoryToRemove.parentId;
            }
        });
        this.categories.forEach((category) => {
            if (category.parentId === categoryToRemove.id)
                category.parentId = categoryToRemove.parentId;
        });
        if (categoryToRemove.removeCategory()) {
            this.categories.delete(categoryId);
            return "The category was successfully removed";
        }
        return "The category already removed";
    }

    getOrdersByDates(startDate, endDate) {
        let result = [];
        this.orders
            .filter((order) => order.date < endDate && order.date > startDate)
            .map((order) => result.push({ title: order.id }));
    }

    writeToLog(type, functionName, msg) {
        logger.log(type, "InventoryManagemnt - " + functionName + " - " + msg);
    }
}
module.exports = InventoryManagemnt;