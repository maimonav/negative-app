const DataBase = require("./DataLayer/DBManager");
const simpleLogger = require("simple-node-logger");
const logger = simpleLogger.createSimpleLogger("project.log");

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
        if (typeof res === 'string') {
            this.writeToLog('error', 'initCategory', 'DB failure - ' + res);
            return 'DB failure - ' + res
        }
        return true;
    }

    editCategory = async(parentId) => {
        const tmpParentId = this.parentId;
        this.parentId = parentId;
        let result = await DataBase.singleAdd("category", {
            id: this.id,
            name: this.name,
            parentId: this.parentId,
        });
        if (typeof result === 'string') {
            this.parentId = tmpParentId;
            this.writeToLog('error', 'editCategory', 'DB failure - ' + result);
            return 'DB failure - ' + result
        }
        return true;
    };

    removeCategory = async() => {
        if (this.isCategoryRemoved === null) {
            this.isCategoryRemoved = new Date();
            return true;
        }
        return false;
    };

    equals(toCompare) {
        return (
            toCompare.name === this.name &&
            toCompare.parentId === this.parentId &&
            toCompare.isCategoryRemoved === this.isCategoryRemoved
        );
    }
    writeToLog(type, functionName, msg) {
        logger.log(type, "InventoryManagemnt - " + functionName + " - " + msg);
    }
}
module.exports = Category;