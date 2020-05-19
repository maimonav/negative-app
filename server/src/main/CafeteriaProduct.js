const DataBase = require("./DataLayer/DBManager");
const Product = require("./Product");
const CafeteriaProductOrder = require("./CafeteriaProductOrder");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");

class CafeteriaProduct extends Product {
  constructor(id, name, categoryId, price, quantity, maxQuantity, minQuantity) {
    super(id, name, categoryId);
    this.price = price;
    this.quantity = quantity;
    this.maxQuantity = maxQuantity ? maxQuantity : 9999999;
    this.minQuantity = minQuantity ? minQuantity : 0;
    this.isProductRemoved = null;
  }

  async initCafeteriaProduct() {
    let res = await DataBase.singleAdd("cafeteria_product", {
      id: this.id,
      name: this.name,
      categoryId: this.categoryId,
      price: this.price,
      quantity: this.quantity,
      maxQuantity: this.maxQuantity,
      minQuantity: this.minQuantity,
    });
    if (typeof res === "string") {
      this.writeToLog("error", "initCafeteriaProduct", res);
      return res;
    }
    return true;
  }

  createOrder(order, quantity) {
    let productOrder = new CafeteriaProductOrder(this, order, quantity);
    this.productOrders.set(order.id, productOrder);
    return productOrder;
  }

  isNeedToUpdate(param, isQuantityFiled) {
    if (typeof param === "undefined") return false;
    if (param === null) return false;
    if (typeof param === "string" && param === "") return false;
    if (!isNaN(param)) {
      let paramNumbet = parseInt(param);
      if (paramNumbet < 0) return false;
    }
    return true;
  }
  quantityCheck(maxQuantity, minQuantity) {
    if (this.isNeedToUpdate(maxQuantity, true)) {
      if (
        this.isNeedToUpdate(minQuantity, false) &&
        maxQuantity <= minQuantity
      ) {
        this.writeToLog(
          "info",
          "quantityCheck",
          "The max quntity(" +
            maxQuantity +
            ") have to be greater then new min quntity(" +
            minQuantity +
            ")"
        );
        return "The max quntity have to be greater then min quntity";
      }
      if (
        !this.isNeedToUpdate(minQuantity, false) &&
        maxQuantity <= this.minQuantity
      ) {
        this.writeToLog(
          "info",
          "quantityCheck",
          "The max quntity(" +
            maxQuantity +
            ") have to be greater then current min quntity(" +
            this.minQuantity +
            ")"
        );
        return "The max quntity have to be greater then min quntity";
      }
    }
    if (this.isNeedToUpdate(minQuantity, false)) {
      if (
        this.isNeedToUpdate(maxQuantity, true) &&
        maxQuantity <= minQuantity
      ) {
        this.writeToLog(
          "info",
          "quantityCheck",
          "The new max quntity(" +
            maxQuantity +
            ") have to be greater then min quntity(" +
            minQuantity +
            ")"
        );
        return "The max quntity have to be greater then min quntity";
      }
      if (
        !this.isNeedToUpdate(maxQuantity, true) &&
        this.maxQuantity <= minQuantity
      ) {
        this.writeToLog(
          "info",
          "quantityCheck",
          "The current max quntity(" +
            this.maxQuantity +
            ") have to be greater then min quntity(" +
            minQuantity +
            ")"
        );
        return "The max quntity have to be greater then min quntity";
      }
    }
    return true;
  }
  async editProduct(categoryId, price, quantity, maxQuantity, minQuantity) {
    let result = this.quantityCheck(maxQuantity, minQuantity);
    if (typeof result === "string") {
      return result;
    }
    const backupObj = {
      categoryId: this.categoryId,
      price: this.price,
      quantity: this.quantity,
      maxQuantity: this.maxQuantity,
      minQuantity: this.minQuantity,
    };
    let isNeedUpdate = false;
    if (this.isNeedToUpdate(categoryId, false)) {
      isNeedUpdate = true;
      this.categoryId = categoryId;
    }
    if (this.isNeedToUpdate(price, true)) {
      isNeedUpdate = true;
      this.price = price;
    }
    if (this.isNeedToUpdate(quantity, true)) {
      isNeedUpdate = true;
      this.quantity = quantity;
    }
    if (
      this.isNeedToUpdate(maxQuantity, true) &&
      ((this.isNeedToUpdate(minQuantity, false) && maxQuantity > minQuantity) ||
        (!this.isNeedToUpdate(minQuantity, false) &&
          maxQuantity > this.minQuantity))
    ) {
      isNeedUpdate = true;
      this.maxQuantity = maxQuantity;
    }
    if (
      this.isNeedToUpdate(minQuantity, false) &&
      minQuantity < this.maxQuantity
    ) {
      isNeedUpdate = true;
      this.minQuantity = minQuantity;
    }
    if (isNeedUpdate) {
      let result = await DataBase.singleUpdate(
        "cafeteria_product",
        { id: this.id },
        {
          name: this.name,
          categoryId: this.categoryId,
          price: this.price,
          quantity: this.quantity,
          maxQuantity: this.maxQuantity,
          minQuantity: this.minQuantity,
        }
      );
      if (typeof result === "string") {
        this.categoryId = backupObj.categoryId;
        this.price = backupObj.price;
        this.quantity = backupObj.quantity;
        this.maxQuantity = backupObj.maxQuantity;
        this.minQuantity = backupObj.minQuantity;
        this.writeToLog("error", "editProduct", "DB failure " + result);
        return "The edited operation failed";
      }
    }
    return "Product details update successfully completed";
  }

  async removeProduct() {
    if (this.isProductRemoved == null) {
      this.isProductRemoved = new Date();
      let result = await DataBase.singleUpdate(
        "cafeteria_product",
        { id: this.id },
        { isProductRemoved: this.isProductRemoved }
      );
      if (typeof result === "string") {
        this.isProductRemoved = null;
        this.writeToLog("error", "removeProduct", "DB failure " + result);
        return "The removed operation failed - DB failure";
      }
      return true;
    }
    return "The product already removed";
  }
  /**
   * Returns the action to update the quantity of products in stock
   * @param {string} addedQuantity The actual inventory that came in the order.
   * @returns {Object} The action.
   **/
  getConfirmOrderDB(addedQuantity) {
    let updatedQuantity = this.quantity + parseInt(addedQuantity);
    return {
      name: DataBase._update,
      model: "cafeteria_product",
      params: {
        where: {
          id: this.id,
        },
        element: {
          quantity: updatedQuantity,
        },
      },
    };
  }
  /**
   * Returns the action to update the quantity of products in stock
   * @param {string} addedQuantity The actual inventory that came in the order.
   * @returns {Object} The action.
   **/
  confirmOrder(addedQuantity) {
    let updatedQuantity = this.quantity + parseInt(addedQuantity);
    this.quantity = updatedQuantity;
  }
  equals(toCompare) {
    return (
      super.equals(toCompare) &&
      toCompare.price === this.price &&
      toCompare.quantity === this.quantity &&
      toCompare.maxQuantity === this.maxQuantity &&
      toCompare.minQuantity === this.minQuantity &&
      toCompare.isProductRemoved === this.isProductRemoved
    );
  }

  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "cafeteriaProduct", functionName, msg);
  }
}
module.exports = CafeteriaProduct;
