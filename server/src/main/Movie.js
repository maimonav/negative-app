const DataBase = require("./DataLayer/DBManager");
const Product = require("./Product");
const MovieOrder = require("./MovieOrder");


class Movie extends Product {

    constructor(id, name, categoryId) {
        super(id, name, categoryId);
        this.movieKey = null;
        this.examinationRoom = null;
        this.isMovieRemoved = null;
    }



    async initMovie() {
        return DataBase.singleAdd( 'movie',{ id: this.id, name: this.name, categoryId: this.categoryId } );
    }

    createOrder(order) {
        this.productOrders.set(order.id, new MovieOrder(this, order));
    }


    async editMovie(categoryId, key, examinationRoom) {
        super.categoryId = categoryId;
        this.movieKey = key;
        this.examinationRoom = examinationRoom;
        let result = await DataBase.singleUpdate('movie', { id: this.id }, { categoryId: this.categoryId, movieKey: key, examinationRoom: examinationRoom });
        return typeof result === 'string' ? "The movie cannot be edited\n" + result
            : "The movie edited successfully";
    }

    async removeMovie() {
        if (this.isMovieRemoved == null) {
            this.isMovieRemoved = new Date();
            let result = await DataBase.singleUpdate('movie', { id: this.id }, { isMovieRemoved: this.isMovieRemoved });
            return typeof result === 'string' ? "The movie cannot be removed\n" + result
                : "The movie removed successfully";
        }
        else
            return "The movie already removed";
    }

    equals(toCompare) {
        return (
            super.equals(toCompare) &&
            toCompare.movieKey === this.movieKey &&
            toCompare.examinationRoom === this.examinationRoom &&
            toCompare.isMovieRemoved === this.isMovieRemoved
        );
    }
}
module.exports = Movie;