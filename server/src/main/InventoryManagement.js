
const Movie = require('./Movie');

class InventoryManagemnt {

    constructor() {
        this.products = new Map();
        this.orders = new Map();
        this.suppliers = new Map();
        this.categories = new Map();
        this.theaters = new Map();
        this.models = {supplier: this.suppliers, category: this.categories, order: this.orders, product: this.products, movie: this.products};
    }

    addMovie(movieId,name,categoryId){
        this.products.set(movieId,new Movie(movieId,name,categoryId));
    }

    isExist = (model,id) => (this.models[model].has(id));



}
module.exports = InventoryManagemnt;