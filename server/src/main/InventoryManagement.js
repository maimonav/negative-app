const Order = require('./Order');
const Movie = require('./Movie');
const Supplier = require('./Supplier');
const CafeteriaProduct = require('./CafeteriaProduct');
const logger = require("simple-node-logger").createSimpleLogger("project.log");

class InventoryManagemnt {

    constructor() {
        this.products = new Map();
        this.orders = new Map();
        this.suppliers = new Map();
        this.categories = new Map();
    }

    addMovie(movieId, name, categoryId) {
        if (this.products.has(movieId))
            return "This movie already exists";
        if (!this.categories.has(categoryId))
            return "Category doesn't exist";
        this.products.set(movieId, new Movie(movieId, name, categoryId));
        return "The movie added successfully"
    }

    editMovie(movieId, categoryId, key, examinationRoom) {
        if (!this.products.has(movieId))
            return "The movie does not exist";
        if (!this.categories.has(categoryId))
            return "Category doesn't exist";
        return this.products.get(movieId).editMovie(categoryId, key, examinationRoom);
    }

    removeMovie(movieId) {
        if (!this.products.has(movieId))
            return "The movie does not exist";
        return this.products.get(movieId).removeMovie();
    }

    addNewSupplier(
        supplierID,
        supplierName,
        contactDetails) {
        if (this.suppliers.has(supplierID))
            return "This supplier already exists";
        this.suppliers.set(supplierID, new Supplier(supplierID, supplierName, contactDetails));
        return "The supplier added successfully"
    }

    editSupplier(
        supplierID,
        supplierName,
        contactDetails) {
        if (!this.suppliers.has(supplierID))
            return "The supplier does not exist";
        return this.suppliers.get(supplierID).editSupplier(supplierName, contactDetails);
    }

    removeSupplier(supplierID) {
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
        return this.products.get(productId).removeProduct();
    }

}
module.exports = InventoryManagemnt;