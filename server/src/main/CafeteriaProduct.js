const DataBase = require("./DataLayer/DBManager");
const Product = require("./Product");
const CafeteriaProductOrder = require("./CafeteriaProductOrder");

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
        if (typeof res === 'string') {
            this.writeToLog('error', 'initCafeteriaProduct', res);
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
        if (typeof param === 'undefined') return false
        if (param === null) return false;
        if (typeof param === "string" && param === "") return false;
        if (isQuantityFiled && typeof param === "number" && param < 0) return false;
        return true;
    }
    async editProduct(categoryId, price, quantity, maxQuantity, minQuantity) {
        const backupObj = {
            categoryId: this.categoryId,
            price: this.price,
            quantity: this.quantity,
            maxQuantity: this.maxQuantity,
            minQuantity: this.minQuantity
        }
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
        if (this.isNeedToUpdate(maxQuantity, true) &&
            ((this.isNeedToUpdate(minQuantity, false) && maxQuantity > minQuantity) ||
                (!this.isNeedToUpdate(minQuantity, false) && maxQuantity > this.minQuantity))) {
            isNeedUpdate = true;
            this.maxQuantity = maxQuantity;
        }
        if (this.isNeedToUpdate(minQuantity, false) && minQuantity < this.maxQuantity) {
            isNeedUpdate = true;
            this.minQuantity = minQuantity;
        }
        if (isNeedUpdate) {
            let result = await DataBase.singleUpdate(
                "cafeteria_product", { id: this.id }, {
                    name: this.name,
                    categoryId: this.categoryId,
                    price: this.price,
                    quantity: this.quantity,
                    maxQuantity: this.maxQuantity,
                    minQuantity: this.minQuantity,
                });
            if (typeof result === "string") {
                this.categoryId = backupObj.categoryId;
                this.price = backupObj.price;
                this.quantity = backupObj.quantity;
                this.maxQuantity = backupObj.maxQuantity;
                this.minQuantity = backupObj.minQuantity;
                this.writeToLog('error', 'editProduct', 'DB failure ' + result);
                return 'The edited operation failed';
            }
        }
        return "Product details update successfully completed";
    }

    async removeProduct() {
        if (this.isProductRemoved == null) {
            this.isProductRemoved = new Date();
            let result = await DataBase.singleUpdate("cafeteria_product", { id: this.id }, { isProductRemoved: this.isProductRemoved });
            if (typeof result === "string") {
                this.isProductRemoved = null;
                this.writeToLog('error', 'removeProduct', 'DB failure ' + result);
                return 'The removed operation failed - DB failure';
            }
            return "The product removed successfully";
        }
        return "The product already removed";
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
        logger.log(type, "cafeteriaProduct - " + functionName + " - " + msg);
    }
}
module.exports = CafeteriaProduct;