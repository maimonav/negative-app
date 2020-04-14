const DataBase = require("./DataLayer/DBManager");

class CafeteriaProductOrder {

    constructor(product, order, quantity) {
        this.actualQuantity = 0;
        this.expectedQuantity = quantity;
        this.order = order;
        this.product = product;
        this.order.addProductOrder(product.id, this);
    }

   
    async initCafeteriaProductOrder() {
        return DataBase.singleAdd('cafeteria_product_order', { orderId: order.id, productId: product.id, expectedQuantity: quantity });
    }

    remove() {
        DataBase.singleRemove('cafeteria_product_order', { orderId: order.id });
    }

    editCafeteriaProductOrder(actualQuantity) {
        this.actualQuantity = actualQuantity;
    }

    equals(toCompare) {
        return (
            toCompare.actualQuantity === this.actualQuantity &&
            toCompare.expectedQuantity === this.expectedQuantity &&
            toCompare.order.equals(this.order) &&
            toCompare.product.equals(this.product)
        );
    }
}
module.exports = CafeteriaProductOrder;