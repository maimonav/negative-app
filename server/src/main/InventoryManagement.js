const Order = require("./Order");
const Movie = require("./Movie");
let DB = require("./DataLayer/DBManager");
const Supplier = require("./Supplier");
const CafeteriaProduct = require("./CafeteriaProduct");
const CafeteriaProductOrder = require("./CafeteriaProductOrder");
const MovieOrder = require("./MovieOrder");
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
        /** Add a movie to the system
         * @param {number} movieId Must be unique
         * @param {number} category  Movie category id
         * @returns {Promise(string)} Success or failure string
         */
    async addMovie(movieId, name, categoryId) {
            if (this.products.has(movieId)) {
                this.writeToLog("info", "addMovie", "This movie " + movieId + " already exists");
                return "This movie already exists";
            }
            if (!this.categories.has(categoryId)) {
                this.writeToLog("info", "addMovie", "Category " + categoryId + " doesn't exist");
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
        /**
         * @param {number} movieId
         * @param {number} category  Movie category id
         * @param {string} key Movie special key
         * @param {string} examinationRoom The room the movie was checked
         * @returns {Promise(string)} Success or failure string
         */
    async editMovie(movieId, categoryId, key, examinationRoom) {
            if (!this.products.has(movieId)) {
                this.writeToLog("info", "editMovie", "The movie " + movieId + " does not exist");
                return "The movie does not exist";
            }
            if (!this.categories.has(categoryId)) {
                this.writeToLog("info", "editMovie", "Category " + categoryId + " does not exist");
                return "Category doesn't exist";
            }
            if (examinationRoom < 0) {
                this.writeToLog("info", "editMovie", "The examination room " + examinationRoom + " is invalid");
                return "The examination room is invalid";
            }
            let result = await this.products.get(movieId).editMovie(categoryId, key, examinationRoom);
            if (typeof result === "string") {
                this.writeToLog('info', 'editMovie', result);
                return "The movie cannot be edited\n" + result;
            }
            return "The movie edited successfully";
        }
        /**
         * Remove movie from the system - not from DB
         * @param {number} movieId
         * @returns {Promise(string)} Success or failure string
         */
    async removeMovie(movieId) {
            if (!this.products.has(movieId)) {
                this.writeToLog("info", "removeMovie", "The movie " + movieId + " does not exist");
                return "The movie does not exist";
            }
            let result = await this.products.get(movieId).removeMovie();
            if (typeof result === "string") {
                this.writeToLog('info', 'removeMovie', result);
                return "The movie cannot be removed\n" + result;
            }
            this.products.delete(movieId);
            return "The movie removed successfully";
        }
        /**
         * Add new supplier to the system
         * @param {number} supplierID
         * @param {string} supplierName
         * @param {string} contactDetails
         * @returns {Promise(string)} Success or failure string
         */
    async addNewSupplier(supplierID, supplierName, contactDetails) {
            if (this.suppliers.has(supplierID)) {
                this.writeToLog("info", "addNewSupplier", "This supplier " + supplierID + " already exists");
                return "This supplier already exists";
            }
            let supplier = new Supplier(supplierID, supplierName, contactDetails);
            let result = await supplier.initSupplier();
            if (typeof result === "string") {
                this.writeToLog("info", "addNewSupplier", result);
                return "The supplier cannot be added\n" + result;
            }
            this.suppliers.set(supplierID, supplier);
            return "The supplier added successfully";
        }
        /**
         * @param {number} supplierID
         * @param {string} supplierName
         * @param {string} contactDetails
         * @returns {Promise(string)} Success or failure string
         */
    async editSupplier(supplierID, supplierName, contactDetails) {
            if (!this.suppliers.has(supplierID)) {
                this.writeToLog("info", "editSupplier", "The supplier " + supplierID + " does not exist");
                return "The supplier does not exist";
            }
            let result = await this.suppliers
                .get(supplierID)
                .editSupplier(supplierName, contactDetails);
            if (typeof result === "string") {
                this.writeToLog("info", "editSupplier", result);
                return "The supplier cannot be edited\n" + result;
            }
            return "The supplier edited successfully";
        }
        /**
         * Remove supplier from the system - not from DB
         * @param {number} supplierID
         * @returns {Promise(string)} Success or failure string
         */
    async removeSupplier(supplierID) {
            if (!this.suppliers.has(supplierID)) {
                this.writeToLog("info", "removeSupplier", "The supplier " + supplierID + " does not exist");
                return "The supplier does not exist";
            }
            let result = await this.suppliers.get(supplierID).removeSupplier();
            if (typeof result === "string") {
                this.writeToLog("info", "removeSupplier", result);
                return "The supplier cannot be removed\n" + result;
            }
            this.suppliers.delete(supplierID);
            return "The supplier removed successfully";
        }
        /**
         * Add new order of movies to the system
         * @param {number} orderId
         * @param {string} strDate Date the order was performed
         * @param {number} supplierId
         * @param {Array(number)} moviesList List of movies in the order (list of movie's id)
         * @param {number} creatorEmployeeId Id of the employee performed the action
         * @returns {Promise(string)} Success or failure string
         **/
    async addMovieOrder(orderId, strDate, supplierId, movieIdList, creatorEmployeeId, orderName) {
            if (this.orders.has(orderId)) {
                this.writeToLog("info", "addMovieOrder", "This order " + orderId + " already exists");
                return "This order already exists";
            }
            if (!this.suppliers.has(supplierId)) {
                this.writeToLog("info", "addMovieOrder", "The supplier " + supplierId + " does not exist");
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
                this.writeToLog("info", "addMovieOrder",
                    "The order date " + strDate + " is invalid"
                );
                return "The order date is invalid";
            }
            let order = new Order(
                orderId,
                supplierId,
                date,
                creatorEmployeeId,
                orderName
            );

            //Database
            let orderObject = order.getOrderAdditionObject();
            let actionsList = [orderObject];
            for (let i in movieIdList) {
                let movieId = movieIdList[i];
                actionsList = actionsList.concat({
                    name: DB._add,
                    model: "movie_order",
                    params: {
                        element: { orderId: orderId, movieId: movieId, expectedQuantity: 1 },
                    },
                });
            }
            let result = await DB.executeActions(actionsList);
            if (typeof result === "string") {
                this.writeToLog("info", "addMovieOrder", result);
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
        /**
         * Remove order from the system and from DB
         * @param {number} orderId Order unique id
         * @returns {Promise(string)} Success or failure string
         **/
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
                this.writeToLog("info", "removeOrder",
                    "Removing supplied order " + orderId + " is not allowed"
                );
                return "Removing supplied orders is not allowed";
            }

            let order = this.orders.get(orderId);

            //Database
            let actionsList = order.getOrderRemovingObjectsList();

            let result = await DB.executeActions(actionsList);
            if (typeof result === "string") {
                this.writeToLog("info", "removeOrder", result);
                return "The order cannot be removed\n" + result;
            }

            //System
            this.orders.get(orderId).removeProductOrders();
            this.orders.delete(orderId);
            return "The order removed successfully";
        }
        /**
         * Add new order of cafetria products to the system
         * @param {number} orderId unique identifier
         * @param {string} strDate Date the order was performed
         * @param {number} supplierId Order supplier's ID
         * @param {Array(Object)} productsList List of cafetria products in the order 
         * @param {number} creatorEmployeeId Id of the employee performed the action
         * @returns {Promise(string)} Success or failure string
         **/
    async addCafeteriaOrder(
            orderId,
            strDate,
            supplierId,
            productsList,
            creatorEmployeeId,
            orderName
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

            let order = new Order(
                orderId,
                supplierId,
                date,
                creatorEmployeeId,
                orderName
            );

            //Database
            let orderObject = order.getOrderAdditionObject();
            let actionsList = [orderObject];
            for (let i in productsList) {
                let productId = productsList[i].id;
                let quantity = productsList[i].quantity;
                actionsList = actionsList.concat({
                    name: DB._add,
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
        /**
         * edit the order 
         * @param {string} orderId Unique ID of edit invitation
         * @param {string} date New date of the order if exists
         * @param {string} supplierId New supplier Id of the order if exists
         * @param {Array(Objects)} productsList List of objects with the data for each product change (must contain unique identifier of the product)
         * @returns {Promise(string)} Success or failure string
         **/
    async editOrder(orderId, date, supplierId, productsList) {
            if (!this.orders.has(orderId)) {
                this.writeToLog(
                    "info",
                    "editOrder",
                    "Order " + orderId + " does not exsits."
                );
                return "Order " + orderId + " does not exsits.";
            }
            return this.orders.get(orderId).editOrder(date, supplierId, productsList);
        }
        /**
         * Confirmation of the order received by an employee
         * @param {Number} orderId Unique ID of order
         * @param {Array(Objects)} productsList List of objects with the id of the product and actual quantity that gotten.
         * @param {Number} recipientEmployeeId Unique identifier of the employee who received the order
         * @returns {Promise(string)} Success or failure string
         **/
    async confirmOrder(orderId, productsList, recipientEmployeeId) {
            if (!this.orders.has(orderId)) {
                this.writeToLog(
                    "info",
                    "confirmOrder",
                    "Order " + orderId + " does not exsits."
                );
                return "Order " + orderId + " does not exsits.";
            }
            return this.orders
                .get(orderId)
                .confirmOrder(productsList, recipientEmployeeId);
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
         * @returns {Promise(string)} Success or failure string
         **/
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
                typeof maxQuantity === "number" &&
                typeof minQuantity === "number" &&
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
        /**
         * Editing the cafeteria product
         * @param {Number} productId Unique ID of cafeteria product
         * @param {String} categoryID Identifier of the new category to which the product belongs (Optional parameter)
         * @param {Number} price The new price of the product (Optional parameter)
         * @param {Number} quantity New quantity of product in stock (Optional parameter)
         * @param {Number} maxQuantity New maximum limit of product quantity in stock (Optional parameter)
         * @param {Number} minQuantity New minimum limit of product quantity in stock (Optional parameter)
         * @returns {Promise(string)} Success or failure string
         **/
    async editCafeteriaProduct(
        productId,
        categoryId,
        price,
        quantity,
        maxQuantity,
        minQuantity
    ) {
        if (!this.products.has(productId)) {
            this.writeToLog("info", 'editCafeteriaProduct', "This product not exists");
            return "This product not exists";
        };
        return await this.products
            .get(productId)
            .editProduct(categoryId, price, quantity, maxQuantity, minQuantity);
    }

    /**
     * Remove the cafeteria product
     * @param {Number} productId Unique ID of cafeteria product
     * @returns {Promise(string)} Success or failure string
     **/
    removeCafeteriaProduct = async(productId) => {
        if (!this.products.has(productId)) {
            this.writeToLog("info", 'removeCafeteriaProduct', "This product not exists"); {
                return "This product not exists";
            };
        };
        let result = await this.products.get(productId).removeProduct();
        if (typeof result === "string") {
            this.writeToLog("error", "removeCafeteriaProduct", result);
            return result;
        }
        this.products.delete(productId);
        return "The product removed successfully";
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

    getCafeteriaOrders() {
        const output = [];
        this.orders.forEach((order) => {
            let check = false;
            order.productOrders.forEach((product) => {
                if (product instanceof CafeteriaProductOrder) check = true;
            });
            if (check)
                output.push({
                    title: order.name,
                });
        });
        return output;
    }

    getMovieOrders() {
        const output = [];
        this.orders.forEach((order) => {
            let check = false;
            order.productOrders.forEach((product) => {
                if (product instanceof MovieOrder) {
                    check = true;
                }
            });
            if (check)
                output.push({
                    title: order.name,
                });
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
            return supplier.contactDetails;
        }
        return output;
    }

    mapToObj(inputMap) {
        let obj = [];

        inputMap.forEach(function(value, key) {
            if (value.product instanceof CafeteriaProduct)
                obj.push({
                    name: value.product.name,
                    expectedQuantity: value.expectedQuantity,
                    actualQuantity: value.actualQuantity,
                });
            else obj.push(value.movie.name);
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
    getCategoryDetails(categotyId) {
            if (!this.categories.has(categotyId)) {
                this.writeToLog(
                    "info",
                    "getCategoryDetails",
                    "The category - " + categotyId + " doesn't exists"
                );
                return "The category - " + categotyId + " doesn't exists";
            }
            let parent = "The category is root of his tree";
            if (this.categories.has(this.categories.get(categotyId).parentId))
                parent = this.categories.get(this.categories.get(categotyId).parentId)
                .name;
            return {
                categoryName: this.categories.get(categotyId).name,
                categoryParent: parent,
            };
        }
        /**
         * Add a new category to the system
         * @param {Number} categoryId Unique ID of category
         * @param {String} categoryName The name of the new category
         * @param {Number} parentID Id of the new parent category
         * @returns {Promise(string)} Success or failure string
         **/
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
        /**
         * Edit a category's data
         * @param {Number} categoryId Unique ID of category
         * @param {Number} parentID New id of the parent category
         * @returns {Promise(string)} Success or failure string
         **/
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
        /**
         * Deleting a category from the system
         * @param {Number} categoryId Unique ID of category
         * @returns {Promise(string)} Success or failure string
         **/
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
                        name: DB._update,
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
                        name: DB._update,
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
                    name: DB._update,
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
            name: DB._update,
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

    getOrdersByDates(startDateStr, endDateStr, isCafetriaProductOrder) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(endDateStr);
        endDate.setHours(0, 0, 0, 0);
        let result = [];
        this.orders.forEach((order) => {
            const orderDate = order.date;
            orderDate.setHours(0, 0, 0, 0);
            if (!(orderDate > endDate) && !(orderDate < startDate)) {
                if (isCafetriaProductOrder === "undefined")
                    result.push({ title: order.name });
                else {
                    if (
                        order.hasCafetriaProductInOrder() &&
                        isCafetriaProductOrder === "true"
                    ) {
                        result.push({ title: order.name });
                    } else if (
                        isCafetriaProductOrder === "false" &&
                        order.hasMoviesInOrder()
                    )
                        result.push({ title: order.name });
                }
            }
        });
        return result;
    }

    getProductsByOrder(orderId) {
        let result = [];
        if (!this.orders.has(orderId)) {
            this.writeToLog("info", "getProductsByOrder", "The order isn't exist");
            return { title: "The order " + orderId + " doesn't exists" };
        }
        this.orders.get(orderId).productOrders.forEach((product) => {
            if (product instanceof CafeteriaProductOrder) {
                result.push({
                    title: product.product.name,
                    expectedQuantity: product.expectedQuantity,
                    actualQuantity: product.actualQuantity,
                });
            } else {
                result.push({
                    title: product.movie.name,
                    key: "",
                    exeminationRoom: "",
                });
            }
        });
        return result;
    }

    getProductsAndQuantityByOrder(orderId) {
        let result = [];
        if (!this.orders.has(orderId)) {
            this.writeToLog("info", "getProductsByOrder", "The order isn't exist");
            return { title: "The order " + orderId + " doesn't exists" };
        }
        this.orders.get(orderId).productOrders.forEach((product) => {
            if (product instanceof CafeteriaProductOrder) {
                result.push({
                    name: product.product.name,
                    expectedQuantity: product.expectedQuantity,
                    actualQuantity: product.actualQuantity,
                });
            } else {
                result.push({ name: product.movie.name, key: "", examinationRoom: "" });
            }
        });
        return result;
    }

    writeToLog(type, functionName, msg) {
        logger.log(type, "InventoryManagemnt - " + functionName + " - " + msg);
    }
}
module.exports = InventoryManagemnt;