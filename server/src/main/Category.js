const DataBase = require("./DataLayer/DBManager");
const simpleLogger = require("simple-node-logger");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");

class Category {
  constructor(id, name, parentId) {
    this.id = id;
    this.name = name;
    this.parentId = parentId === undefined ? -1 : parentId;
    this.isCategoryRemoved = null;
  }

  async initCategory() {
    let res = await DataBase.singleAdd("category", {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
    });
    if (typeof res === "string") {
      this.writeToLog("error", "initCategory", "DB failure - " + res);
      return "DB failure - " + res;
    }
    return true;
  }

  editCategory = async (parentId) => {
    const tmpParentId = this.parentId;
    this.parentId = parentId;
    let result = await DataBase.singleUpdate(
      "category",
      { id: this.id },
      {
        id: this.id,
        name: this.name,
        parentId: this.parentId,
      }
    );
    if (typeof result === "string") {
      this.parentId = tmpParentId;
      this.writeToLog("error", "editCategory", "DB failure - " + result);
      return "DB failure - " + result;
    }
    return true;
  };

  removeCategory = async () => {
    if (this.isCategoryRemoved === null) {
      this.isCategoryRemoved = new Date();
      let result = await await DataBase.singleUpdate(
        "category",
        { id: this.id },
        { isCategoryRemoved: this.isCategoryRemoved }
      );
      if (typeof result === "string") {
        this.isCategoryRemoved = null;
        this.writeToLog("error", "removeCategory", "DB failure - " + result);
        return "DB failure - " + result;
      }
      return true;
    }
    this.writeToLog("error", "removeCategory", "The category already removed");
    return "The category already removed";
  };

  equals(toCompare) {
    return (
      toCompare.name === this.name &&
      toCompare.parentId === this.parentId &&
      toCompare.isCategoryRemoved === this.isCategoryRemoved
    );
  }
  writeToLog(type, functionName, msg) {
    logger.writeToLog(type, "Category", functionName, msg);
  }
}
module.exports = Category;
