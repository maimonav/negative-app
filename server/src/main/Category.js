const DataBase = require("./DBManager");


class Category {
    constructor(id, name, parentId) {
        this.id = id;
        this.name = name;
        this.parentId = (parentId === undefined) ? -1 : parentId;
        this.isCategoryRemoved = null;
        DataBase.add('category', { id: id, name: name, parentId: parentId });
        DataBase.setDestroyTimer('categories', false,"2 YEAR","1 DAY",'isCategoryRemoved');
    }

    removeCategory = () => {
        if (this.isCategoryRemoved == null) {
            this.isCategoryRemoved = new Date();
            DataBase.update('category', { id: this.id }, { isCategoryRemoved: this.isCategoryRemoved });
            return true;
        }
        else
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