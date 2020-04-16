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
    return DataBase.singleAdd("movie", {
      id: this.id,
      name: this.name,
      categoryId: this.categoryId,
    });
  }

  createOrder(order) {
    let movieOrder = new MovieOrder(this, order);
    this.productOrders.set(order.id, movieOrder);
    return movieOrder;
  }

  async editMovie(categoryId, key, examinationRoom) {
    super.categoryId = categoryId;
    this.movieKey = key;
    this.examinationRoom = examinationRoom;
    return DataBase.singleUpdate(
      "movie",
      { id: this.id },
      {
        categoryId: this.categoryId,
        movieKey: key,
        examinationRoom: examinationRoom,
      }
    );
  }

  async removeMovie() {
    this.isMovieRemoved = new Date();
    return DataBase.singleUpdate(
      "movie",
      { id: this.id },
      { isMovieRemoved: this.isMovieRemoved }
    );
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
