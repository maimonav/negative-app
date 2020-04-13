const DataBase = require("./DataLayer/DBManager");


class Category {
    constructor(id, name, parentId) {
        this.id = id;
        this.name = name;
        this.parentId = (parentId === undefined) ? -1 : parentId;
        this.isCategoryRemoved = null;

    }

    initCategory() {
        let res = DataBase.singleAdd('category', { id: this.id, name: this.name, parentId: this.parentId });
        if (res === 'error')
            return "The operation failed - DB failure";
        return "";
    }

    editCategory = (parentId) => {
        this.parentId = parentId;
        //TODO update in db
    }

    removeCategory = () => {
        if (this.isCategoryRemoved == null) {
            this.isCategoryRemoved = new Date();
            DataBase.singleUpdate('category', { id: this.id }, { isCategoryRemoved: this.isCategoryRemoved });
            return true;
        } else
            return false;
    }

    equals(toCompare) {
        return (
            toCompare.name === this.name &&
            toCompare.parentId === this.parentId &&
            toCompare.isCategoryRemoved === this.isCategoryRemoved
        );
    }
}
module.exports = Category;