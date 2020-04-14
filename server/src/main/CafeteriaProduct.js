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

    initCafeteriaProduct() {
        let res = DataBase.singleAdd('cafeteria_product', {
            id: this.id,
            name: this.name,
            categoryId: this.categoryId,
            price: this.price,
            quantity: this.quantity,
            maxQuantity: this.maxQuantity,
            minQuantity: this.minQuantity
        });
        if (res === 'error')
            return "The operation failed - DB failure";
        return "";
    }


    createOrder(order, quantity) {
        let productOrder = new CafeteriaProductOrder(this, order, quantity)
        this.productOrders.set(order.id, productOrder);
        return productOrder;
    }

    isNeedToUpdate(param, isQuantityFiled) {
        if (param === undefined || param === "") return false;
        if (isQuantityFiled && param < 0) return false;
        return true;
    }
    editProduct(categoryId, price, quantity, maxQuantity, minQuantity) {
        if (this.isNeedToUpdate(categoryId, false))
            this.categoryId = categoryId;
        if (this.isNeedToUpdate(price, true))
            this.price = price;
        if (this.isNeedToUpdate(quantity, true))
            this.quantity = quantity;
        if (this.isNeedToUpdate(maxQuantity, true))
            this.maxQuantity = maxQuantity;
        if (this.isNeedToUpdate(minQuantity, false))
            this.minQuantity = minQuantity;
        DataBase.singleUpdate('cafeteria_product', { id: this.id }, {
            name: this.name,
            categoryId: this.categoryId,
            price: this.price,
            quantity: this.quantity,
            maxQuantity: this.maxQuantity,
            minQuantity: this.minQuantity
        });
        return 'Product details update successfully completed'
    }

    removeProduct() {
        if (this.isProductRemoved == null) {
            this.isProductRemoved = new Date();
            DataBase.singleUpdate('cafeteria_product', { id: this.id }, { isProductRemoved: this.isProductRemoved });
            return "The product removed successfully";
        } else
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

}
module.exports = CafeteriaProduct;