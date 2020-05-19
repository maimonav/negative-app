const DataBase = require("./DataLayer/DBManager");
const Product = require("./Product");
const MovieOrder = require("./MovieOrder");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const DBlogger = LogController.getInstance("db");

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
  editMovieWithoutDB(key, examinationRoom) {
    if (typeof key !== "undefined" && key !== null) this.movieKey = key;
    if (typeof key === "string" || typeof key === "number")
      this.examinationRoom = examinationRoom;
  }

  editMovie(categoryId, key, examinationRoom) {
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
  /**
   * Entering the data with which the movie that came in was checked
   * @param {string} key The key with which the film was tested
   * @param {string} examinationRoom The room in which the film was examined
   * @returns {Promise(string)} if failed return string otherwise return bool.
   **/
  getconfirmOrderDB(key, examinationRoom) {
    return {
      name: DataBase._update,
      model: "movie",
      params: {
        where: {
          id: this.id,
        },
        element: {
          movieKey: key,
          examinationRoom: examinationRoom,
        },
      },
    };
  }

  confirmOrder(key, examinationRoom) {
    this.movieKey = key;
    this.examinationRoom = examinationRoom;
    return true;
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
  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "Movie", functionName, msg);
  }
}
module.exports = Movie;
