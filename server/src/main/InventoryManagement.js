
const Movie = require('./Movie');

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
        return "The movie was added successfully"
    }

    editMovie(movieId, categoryId, key, examinationRoom) {
        if (!this.products.has(movieId))
            return "The movie does not exist";
        if (!this.categories.has(categoryId))
            return "Category doesn't exist";
        return this.products.get(movieId).editMovie(categoryId, key, examinationRoom);
    }

    removeMovie(movieId){
        if (!this.products.has(movieId))
            return "The movie does not exist";
        return this.products.get(movieId).removeMovie();
    }



}
module.exports = InventoryManagemnt;