const DataBase = require("./DataLayer/DBManager");

class MovieOrder {

    constructor(movie, order) {
        this.actualQuantity = 0;
        this.expectedQuantity = 1;
        this.order = order;
        this.movie = movie;
    }


    getOrderRemovingObject = () => ({ name: DataBase.remove, model: 'movie_order', params: { where: { orderId: this.order.id } } });


    remove() {
        this.movie.removeOrder(this.order.id);
    }

    editMovieOrder(actualQuantity) {
        this.actualQuantity = actualQuantity;
    }

    equals(toCompare) {
        return (
            toCompare.actualQuantity === this.actualQuantity &&
            toCompare.expectedQuantity === this.expectedQuantity &&
            toCompare.order.equals(this.order) &&
            toCompare.movie.equals(this.movie)
        );
    }
}
module.exports = MovieOrder;