
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
        this.suppliers.set(supplierID, new Supplier(supplierID,supplierName,contactDetails));
        return "The supplier added successfully"
    }

    editSupplier(
        supplierID,
        supplierName,
        contactDetails) {
        if (!this.suppliers.has(supplierID))
            return "The supplier does not exist";
        return this.suppliers.get(supplierID).editSupplier(supplierName,contactDetails);
    }

    removeSupplier(supplierID) {
        if (!this.suppliers.has(supplierID))
            return "The supplier does not exist";
        return this.suppliers.get(supplierID).removeSupplier();

    }


}
module.exports = InventoryManagemnt;