const DataBase = require("./DataLayer/DBManager");
const CafeteriaProductOrder = require("./CafeteriaProductOrder");
const MovieOrder = require("./MovieOrder");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");

const _ = require("lodash");

class Order {
  constructor(id, supplierId, date, creatorEmployeeId, orderName) {
    this.id = id;
    this.name = orderName;
    this.date = date;
    this.creatorEmployeeId = creatorEmployeeId;
    this.recipientEmployeeId = null;
    this.supplierId = supplierId;
    this.productOrders = new Map();
  }

  getOrderAdditionObject = () => ({
    name: DataBase._add,
    model: "order",
    params: {
      element: {
        id: this.id,
        date: this.date, //this.date.toISOString().substring(0, 10),
        creatorEmployeeId: this.creatorEmployeeId,
        supplierId: this.supplierId,
      },
    },
  });

  getOrderRemovingObjectsList = () => {
    let list = [];
    this.productOrders.forEach((productOrder) => {
      list = list.concat(productOrder.getOrderRemovingObject());
    });
    list = list.concat({
      name: DataBase._remove,
      model: "order",
      params: { where: { id: this.id } },
    });

    return list;
  };

  getOrderRemovingObjectsList = () => {
    let list = [];
    this.productOrders.forEach((productOrder) => {
      list = list.concat(productOrder.getOrderRemovingObject());
    });
    list = list.concat([
      {
        name: DataBase._remove,
        model: "order",
        params: { where: { id: this.id } },
      },
    ]);
    return list;
  };

  removeProductOrders = () => {
    this.productOrders.forEach((productOrder) => {
      productOrder.remove();
    });
  };
  /**
   * edit the order
   * @param {string} date New date of the order if exists
   * @param {string} supplierId New supplier Id of the order if exists
   * @param {Array(Objects)} productsList List of objects with the data for each product change (must contain unique identifier of the product)
   * @returns {Promise(string)} Success or failure string
   **/
  async editOrder(date, supplierId, productsList) {
    if (typeof this.recipientEmployeeId === "number") {
      this.writeToLog(
        "info",
        "editOrder",
        "Edit of order " +
          this.name +
          " fail- You cannot edit a previously approved order."
      );
      return (
        "Edit of order " +
        this.name +
        " fail- You cannot edit a previously approved order."
      );
    }
    let productOrderIdSet = new Set();
    productsList.forEach((product) => {
      productOrderIdSet.add(product.id);
    });
    let DBActionList = [];
    //DATABASES
    //If the date is a type that can be converted to a date then you will take the action
    if (
      typeof date === "string" ||
      (typeof date === "object" && date !== null)
    ) {
      DBActionList = DBActionList.concat({
        name: DataBase._update,
        model: "order",
        params: {
          where: {
            id: this.id,
          },
          element: {
            date: date,
          },
        },
      });
    }
    if (typeof supplierId === "number") {
      DBActionList = DBActionList.concat({
        name: DataBase._update,
        model: "order",
        params: {
          where: {
            id: this.id,
          },
          element: {
            supplierId: supplierId,
          },
        },
      });
    }
    this.productOrders.forEach((product) => {
      let id;
      if (product instanceof CafeteriaProductOrder) id = product.product.id;
      else id = product.movie.id;
      if (!productOrderIdSet.has(id))
        DBActionList = DBActionList.concat(product.getProductOrderRemove());
    });
    productsList.forEach((product) => {
      if (this.productOrders.has(product.id)) {
        if (
          this.productOrders.get(product.id) instanceof CafeteriaProductOrder
        ) {
          DBActionList = DBActionList.concat({
            name: DataBase._update,
            model: "cafeteria_product_order",
            params: {
              where: {
                orderId: this.id,
                productId: product.id,
              },
              element: {
                expectedQuantity: parseInt(product.actualQuantity),
              },
            },
          });
        } else if (this.productOrders.get(product.id) instanceof MovieOrder) {
          DBActionList = DBActionList.concat({
            name: DataBase._update,
            model: "movie",
            params: {
              where: {
                id: product.id,
              },
              element: {
                movieKey: product.key,
                examinationRoom: product.examinationRoom,
              },
            },
          });
        }
      }
    });
    let result = await DataBase.executeActions(DBActionList);
    if (typeof result === "string") {
      this.writeToLog("info", "editOrder", result);
      return result;
    }
    //system
    if (typeof date === "string" || typeof date === "object") {
      this.date = date;
    }
    if (typeof supplierId === "number") {
      this.supplierId = supplierId;
    }
    this.productOrders.forEach((product) => {
      let id;
      if (product instanceof CafeteriaProductOrder) id = product.product.id;
      else id = product.movie.id;
      if (!productOrderIdSet.has(id)) {
        product.remove();
        this.productOrders.delete(id);
      }
    });
    productsList.forEach((product) => {
      let res = product.id;
      if (this.productOrders.has(product.id)) {
        if (this.productOrders.get(product.id) instanceof CafeteriaProductOrder)
          this.productOrders
            .get(product.id)
            .editCafeteriaProductOrderExpected(
              parseInt(product.actualQuantity)
            );
        else if (this.productOrders.get(product.id) instanceof MovieOrder) {
          this.productOrders
            .get(product.id)
            .editMovieOrder(
              product.quantity,
              product.key,
              product.examinationRoom
            );
        }
      }
    });
    return "The order edited successfully completed";
  }
  /**
   * Confirmation of the order received by an employee
   * @param {Array(Objects)} productsList List of objects with the id of the product and actual quantity that gotten.
   * @param {Number} recipientEmployeeId Unique identifier of the employee who received the order
   * @returns {Promise(string)} Success or failure string
   **/
  async confirmOrder(productList, recipientEmployeeId) {
    if (typeof this.recipientEmployeeId === "number") {
      this.writeToLog(
        "info",
        "confirmOrder",
        "Confirm of order " + this.name + " fail- You cannot re-confirm order."
      );
      return (
        "Confirm of order " + this.name + " fail- You cannot re-confirm order."
      );
    }
    let numOfProduct = this.productOrders.size;
    //Test parameters are correct
    let problematicProductID;
    productList.forEach((product) => {
      if (this.productOrders.has(product.id)) numOfProduct--;
      if (this.productOrders.get(product.id) instanceof CafeteriaProductOrder) {
        if (product.actualQuantity < 0) problematicProductID = product.id;
      } else {
        if (
          typeof product.examinationRoom === "undefined" ||
          product.examinationRoom === null ||
          product.examinationRoom === "" ||
          typeof product.key === "undefined" ||
          product.key === null ||
          product.key === ""
        )
          problematicProductID = product.id;
      }
    });
    if (numOfProduct > 0) {
      this.writeToLog(
        "info",
        "confirmOrder",
        "No status was received for all order products"
      );
      return "No status was received for all order products";
    }
    if (typeof problematicProductID !== "undefined") {
      this.writeToLog(
        "info",
        "confirmOrder",
        "Not all parameters required for product or film approval were accepted"
      );
      return "Not all parameters required for product or film approval were accepted";
    }
    //Database actions
    let DBActionList = [
      {
        name: DataBase._update,
        model: "order",
        params: {
          where: {
            id: this.id,
          },
          element: {
            recipientEmployeeId: recipientEmployeeId,
          },
        },
      },
    ];
    productList.forEach((product) => {
      if (this.productOrders.has(product.id)) {
        if (
          this.productOrders.get(product.id) instanceof CafeteriaProductOrder
        ) {
          let productAction = this.productOrders
            .get(product.id)
            .getConfirmOrderDB(product.actualQuantity);
          DBActionList.push(productAction[0]);
          DBActionList.push(productAction[1]);
        } else if (this.productOrders.get(product.id) instanceof MovieOrder) {
          let productAction = this.productOrders
            .get(product.id)
            .getConfirmOrderDB(product.key, product.examinationRoom);
          DBActionList.push(productAction[0]);
          DBActionList.push(productAction[1]);
        }
      }
    });
    let result = await DataBase.executeActions(DBActionList);
    if (typeof result === "string") {
      this.writeToLog("info", "confirmOrder", "DB failure- " + result);
      return "DB failure- " + result;
    }
    //system actions
    this.recipientEmployeeId = recipientEmployeeId;
    productList.forEach((product) => {
      if (this.productOrders.has(product.id)) {
        if (
          this.productOrders.get(product.id) instanceof CafeteriaProductOrder
        ) {
          this.productOrders
            .get(product.id)
            .confirmOrder(product.actualQuantity);
        } else if (this.productOrders.get(product.id) instanceof MovieOrder) {
          this.productOrders
            .get(product.id)
            .confirmOrder(product.key, product.examinationRoom);
        }
      }
    });
    return "Order confirmation success";
  }

  equals(toCompare) {
    return (
      toCompare.id === this.id &&
      toCompare.date.toISOString() === this.date.toISOString() &&
      toCompare.creatorEmployeeId === this.creatorEmployeeId &&
      toCompare.recipientEmployeeId === this.recipientEmployeeId &&
      toCompare.supplierId === this.supplierId &&
      _.isEqualWith(toCompare.productOrders, this.productOrders, function(
        val1,
        val2
      ) {
        if (_.isFunction(val1) && _.isFunction(val2)) {
          return val1.toString() === val2.toString();
        }
      })
    );
  }
  /**
   * Checks if ordering is a type of cafeteria order
   * @returns {Boolean}
   **/
  hasCafetriaProductInOrder() {
    let hasCafetriaProduct = false;
    this.productOrders.forEach((value, key) => {
      if (value instanceof CafeteriaProductOrder) hasCafetriaProduct = true;
    });
    return hasCafetriaProduct;
  }
  /**
   * Checks if ordering is a type of cafeteria order
   * @returns {Boolean}
   **/
  hasMoviesInOrder() {
    let hasMovies = false;
    this.productOrders.forEach((value, key) => {
      if (value instanceof MovieOrder) hasMovies = true;
    });
    return hasMovies;
  }

  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "Order", functionName, msg);
  }
}
module.exports = Order;
