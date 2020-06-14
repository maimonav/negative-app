const DataBase = require("./DataLayer/DBManager");
const ProductOrder = require("./ProductOrder");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const DBlogger = LogController.getInstance("db");


class MovieOrder extends ProductOrder {
  constructor(movie, order) {
    super(order, 1);
    this.actualQuantity = 0;
    this.expectedQuantity = 1;
    this.order = order;
    this.movie = movie;
  }

  getOrderRemovingObject = () => ({
    name: DataBase._remove,
    model: "movie_order",
    params: { where: { orderId: this.order.id } },
  });

  getProductOrderRemove = () => ({
    name: DataBase._remove,
    model: "movie_order",
    params: {
      where: {
        orderId: this.order.id,
        movieId: this.movie.id,
      },
    },
  });

  remove() {
    this.movie.removeOrder(this.order.id);
  }

  editMovieOrder(expectedQuantity, key, examinationRoom) {
    if (typeof expectedQuantity === "number" && expectedQuantity >= 0)
      this.expectedQuantity = expectedQuantity;
    this.movie.editMovieWithoutDB(key, examinationRoom);
  }
  /**
   * Entering the data with which the movie that came
   * in was checked if it's success update actualQuantity to 1
   * @param {string} key The key with which the film was tested
   * @param {string} examinationRoom The room in which the film was examined
   * @returns {Promise(string)} if failed return string otherwise return bool.
   **/
  getConfirmOrderDB(key, examinationRoom) {
    let action = {
      name: DataBase._update,
      model: "movie_order",
      params: {
        where: {
          orderId: this.order.id,
          movieId: this.movie.id,
        },
        element: {
          actualQuantity: 1,
        },
      },
    };
    return [action, this.movie.getconfirmOrderDB(key, examinationRoom)];
  }

  /**
   * Entering the data with which the movie that came
   * in was checked if it's success update actualQuantity to 1
   * @param {string} key The key with which the film was tested
   * @param {string} examinationRoom The room in which the film was examined
   * @returns {Promise(string)} if failed return string otherwise return bool.
   **/
  confirmOrder(key, examinationRoom) {
    let result = this.movie.confirmOrder(key, examinationRoom);
    this.actualQuantity = 1;
    return result;
  }

  equals(toCompare) {
    return (
      toCompare.actualQuantity === this.actualQuantity &&
      toCompare.expectedQuantity === this.expectedQuantity &&
      toCompare.order.equals(this.order) &&
      toCompare.movie.equals(this.movie)
    );
  }
  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "MovieOrder", functionName, msg);
  }
}
module.exports = MovieOrder;
