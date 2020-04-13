const Order = require('./Order');
const DataBase = require("./DBManager");
const Movie = require('./Movie');
const Supplier = require('./Supplier');
const CafeteriaProduct = require('./CafeteriaProduct');
const Category = require('./Category');
const logger = require("simple-node-logger").createSimpleLogger("project.log");

class InventoryManagemnt {

    constructor() {
        this.products = new Map();
        this.orders = new Map();
        this.suppliers = new Map();
        this.categories = new Map();
    }

    async addMovie(movieId, name, categoryId) {
        if (this.products.has(movieId))
            return "This movie already exists";
        if (!this.categories.has(categoryId))
            return "Category doesn't exist";
        let movie = new Movie(movieId, name, categoryId);
        let result = await movie.initMovie();
        if (typeof result !== "string") {
            this.products.set(movieId, movie);
            return "The movie added successfully"
        }
        return "The movie cannot be added\n" + result;
    }

    async editMovie(movieId, categoryId, key, examinationRoom) {
        if (!this.products.has(movieId))
            return "The movie does not exist";
        if (!this.categories.has(categoryId))
            return "Category doesn't exist";
        return this.products.get(movieId).editMovie(categoryId, key, examinationRoom);
    }

    async removeMovie(movieId) {
        if (!this.products.has(movieId))
            return "The movie does not exist";
        return this.products.get(movieId).removeMovie();
    }

    async addNewSupplier(
        supplierID,
        supplierName,
        contactDetails) {
        if (this.suppliers.has(supplierID))
            return "This supplier already exists";
        let supplier = new Supplier(supplierID, supplierName, contactDetails);
        let result = await supplier.initSupplier();
        if (typeof result !== "string") {
            this.suppliers.set(supplierID, supplier);
            return "The supplier added successfully"
        }
        return "The supplier cannot be added\n" + result;
    }

    async editSupplier(
        supplierID,
        supplierName,
        contactDetails) {
        if (!this.suppliers.has(supplierID))
            return "The supplier does not exist";
        return this.suppliers.get(supplierID).editSupplier(supplierName, contactDetails);
    }

    async removeSupplier(supplierID) {
        if (!this.suppliers.has(supplierID))
            return "The supplier does not exist";
        return this.suppliers.get(supplierID).removeSupplier();

    }


    async addMovieOrder(
        orderId,
        strDate,
        supplierId,
        movieIdList,
        creatorEmployeeId) {
        if (this.orders.has(orderId))
            return "This order already exists";
        if (!this.suppliers.has(supplierId))
            return "The supplier does not exist";
        for (let i in movieIdList) {
            if (!this.products.has(movieIdList[i]))
                return "Movie does not exist";
        }
        let date = new Date(strDate);
        if (isNaN(date.valueOf()))
            return "The order date is invalid";
        let order = new Order(orderId, supplierId, date, creatorEmployeeId);
        await order.initOrder();
        for (let i in movieIdList) {
            this.products.get(movieIdList[i]).createOrder(order);

        }
        this.orders.set(orderId, order);
        return "The order added successfully";
    }

    async removeOrder(orderId) {
        if (!this.orders.has(orderId))
            return "This order does not exist";
        if (this.orders.get(orderId).recipientEmployeeId != null)
            return "Removing supplied orders is not allowed";
        await this.orders.get(orderId).removeOrder();
        this.orders.delete(orderId);
        return "The order removed successfully"
    }

    async addCafeteriaOrder(
        orderId,
        strDate,
        supplierId,
        productsList,
        creatorEmployeeId) {
        if (this.orders.has(orderId))
            return "This order already exists";
        if (!this.suppliers.has(supplierId))
            return "The supplier does not exist";
        for (let i in productsList) {
            if (!this.products.has(productsList[i].id))
                return "Product does not exist";
        }
        let date = new Date(strDate);
        if (isNaN(date.valueOf()))
            return "The order date is invalid";
        let order = new Order(orderId, supplierId, date, creatorEmployeeId);
        await order.initOrder();
        for (let i in productsList) {
            this.products.get(productsList[i].id).createOrder(order, productsList[i].quantity);

        }
        this.orders.set(orderId, order);
        return "The order added successfully";
    }
    addCafeteriaProduct(productId, name, categoryID, price, quantity, maxQuantity, minQuantity) {
        if (this.products.has(productId)) return "This product already exists";
        if (!this.categories.has(categoryID)) return "Category doesn't exist";
        if (price <= 0) return "Product price must be greater than 0";
        if (quantity < 0) return "Product quantity must be greater or equal to 0";
        if (maxQuantity != undefined && minQuantity != undefined && maxQuantity <= minQuantity)
            return 'Maximum product quantity must be greater than minimum product quantity';
        const productToInsert = new CafeteriaProduct(productId, name, categoryID, price, quantity, maxQuantity, minQuantity);
        if (productToInsert.initCafeteriaProduct() === "The operation failed - DB failure") {
            logger.console.error("InventoryManagemnt - addCafeteriaProduct - The operation failed - DB failure");
            return 'The operation failed - DB failure';
        }
        this.products.set(productToInsert.id, productToInsert);
        return "The product was successfully added to the system";
    }

    editCafeteriaProduct(productId, categoryId, price, quantity, maxQuantity, minQuantity) {
        if (!this.products.has(productId)) return "This product not exists";
        return this.products.get(productId).editProduct(categoryId, price, quantity, maxQuantity, minQuantity);
    }

    removeCafeteriaProduct = (productId) => {
        if (!this.products.has(productId)) return "This product not exists";
        this.products.delete(productId);
        return this.products.get(productId).removeProduct();
    }
    getSuppliers() {
        const output = [];
        this.suppliers.forEach(supplier => {
            const value = { 'title': supplier.name };
            output.push(value);
        });
        return output;
    }

    getCategories() {
        const output = [];
        this.categories.forEach(category => {
            const value = {
                'title': category.name,
            }
            output.push(value);
        });
        return output;
    }

    getCafeteriaProducts() {
        const output = [];
        this.products.forEach(product => {
            if (product instanceof CafeteriaProduct) {
                const value = {
                    'title': product.name
                }
                output.push(value);
            }
        });
        return output;
    }

    getMovies() {
        const output = [];
        this.products.forEach(movie => {
            if (movie instanceof Movie) {
                const value = {
                    'title': movie.name,
                }
                output.push(value);
            }
        });
        return output;
    }

    getInventoryProducts() {
        const output = {};
        let cafiteriaProducts = this.getCafeteriaProducts();
        let movies = this.getMovies();

        Object.keys(cafiteriaProducts).forEach(productID => {
            output[productID] = { 'type': "CafeteriaProduct", 'product': cafiteriaProducts[productID] };
        });

        Object.keys(movies).forEach(productID => {
            output[productID] = { 'type': "Movie", 'product': movies[productID] };
        });

        return output;
    }

    getSupplierDetails(supplierID) {
        const output = {};
        if (this.suppliers.has(supplierID)) {
            const supplier = this.suppliers.get(supplierID);
            return { 'id': supplier.id, 'name': supplier.name, 'contactDetails': supplier.contactDetails };
        }
        return output;
    }

    mapToObj(inputMap) {
        let obj = {};

        inputMap.forEach(function (value, key) {
            obj[key] = value
        });

        return obj;
    }

    getOrderDetails(orderId) {
        if (this.orders.has(orderId)) {
            const order = this.orders.get(orderId);
            const supplierName = (this.suppliers.has(order.supplierId)) ? this.suppliers.get(order.supplierId).name : -1;
            return {
                orderId: order.id,
                orderDate: order.date,
                supplierDetails: supplierName,
                products: this.mapToObj(order.productOrders),
            }
        }
        return {};
    }

    getMovieDetails(movieID) {
        if (this.products.has(movieID)) {
            const movie = this.products.get(movieID);
            if (movie instanceof Movie) {
                return {
                    'movieName': movie.name,
                    'category': this.categories.get(movie.categoryId).name,
                    'movieKey': movie.movieKey,
                    'examinationRoom': movie.examinationRoom
                };
            }
        }
        return {};
    }

    getCafeteriaProductDetails(productID) {
        const output = {};
        if (this.products.has(productID)) {
            const product = this.products.get(productID);
            return {
                productName: product.name,
                productCategory: this.categories.get(product.categoryId).name,
                productPrice: product.price,
                productQuantity: product.quantity,
                productMaxQunatity: product.maxQuantity,
                productMimQunatity: product.minQuantity,
            }
        }
        return {};
    }

    addCategory(categoryId, categoryName, parentID) {
        if (this.categories.has(categoryId)) {
            this.writeToLog('info', 'addCategory', 'The Category ' + categoryId + ' already exist');
            return "The Category ID already exist"
        }
        if (parentID !== undefined && !this.categories.has(parentID)) {
            this.writeToLog('info', 'addCategory', 'The parent category ' + parentID + ' doesn\'t exist');
            return "The parent category  doesn't exist"
        }
        const categoryToInsert = new Category(categoryId, categoryName.parentID);
        if (categoryToInsert.initCategory() === "The operation failed - DB failure") {
            this.writeToLog('error', 'addCategory', 'The operation failed - DB failure')
            return 'The operation failed - DB failure';
        }
        this.categories.set(categoryToInsert.id, categoryToInsert);
        return "The category was successfully added to the system";
    }

    editCategory(categoryId, parentID) {
        if (!this.categories.has(categoryId)) {
            this.writeToLog('info', 'editCategory', 'The Category ' + categoryId + ' doesn\'t exist');
            return "The Category ID doesn\'t exist"
        }
        if (parentID !== undefined && !this.categories.has(parentID) && parentID != -1) {
            this.writeToLog('info', 'editCategory', 'The parent category ' + parentID + ' doesn\'t exist');
            return "The parent category  doesn't exist"
        }
        this.categories.get(categoryId).editCategory(parentID);
        return "The category was successfully updateded";
    }
    removeCategory(categoryId) {
        if (!this.categories.has(categoryId)) {
            this.writeToLog('info', 'removeCategory', 'The Category ' + categoryId + ' doesn\'t exist');
            return "The Category ID doesn\'t exist"
        }
        const categoryToRemove = this.categories.get(categoryId);
        this.categories.forEach(category => {
            if (category.parentId === categoryToRemove.id)
                category.editCategory(categoryToRemove.parentId);
        })
        if (categoryToRemove.removeCategory()) {
            this.categories.delete(categoryId);
            return 'The category was successfully removed'
        }
        return 'The category already removed'
    }

    writeToLog(type, functionName, msg) {
        logger.log(type, 'InventoryManagemnt - ' + functionName + ' - ' + msg);
    }


}
module.exports = InventoryManagemnt;