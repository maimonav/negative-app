const DataBase = require("./DataLayer/DBManager");

class CafeteriaProductOrder {

    constructor(product, order, quantity) {
        this.actualQuantity = 0;
        this.expectedQuantity = quantity;
        this.order = order;
        this.product = product;
    }

   
    getOrderRemovingObject = () => ({name: DataBase.remove, model:'cafeteria_product_order' ,params: { orderId: this.order.id }});


    remove() {
        product.removeOrder(order.id);
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