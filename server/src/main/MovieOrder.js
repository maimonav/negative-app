const DataBase = require("./DBManager");

class MovieOrder {

    constructor(movie, order) {
        this.actualQuantity = 0;
        this.expectedQuantity = 1;
        this.order = order;
        this.movie = movie;
        this.order.addProductOrder(this);
        DataBase.add('movie_order', { orderId: order.id, movieId: movie.id });
        DataBase.setDestroyTimer('movie_orders', true, '1 YEAR', '1 DAY');
    }
    
    editMovieOrder(actualQuantity){
        this.actualQuantity=actualQuantity;
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