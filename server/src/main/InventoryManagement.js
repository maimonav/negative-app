
const Order = require('./Order');
const Movie = require('./Movie');
const Supplier = require('./Supplier');

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


    addMovieOrder(
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
        for (let i in movieIdList) {
            this.products.get(movieIdList[i]).createOrder(order);

        }
        this.orders.set(orderId, order);
        return "The order added successfully";
    }

    addCafeteriaOrder(
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
        for (let i in productsList) {
            this.products.get(productsList[i].id).createOrder(order, productsList[i].quantity);

        }
        this.orders.set(orderId, order);
        return "The order added successfully";
    }

}
module.exports = InventoryManagemnt;