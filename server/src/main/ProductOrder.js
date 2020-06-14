class ProductOrder {
    constructor(order, quantity) {
        this.actualQuantity = 0;
        this.expectedQuantity = quantity;
        this.order = order;
    }
    remove() {
        throw new Error("Method 'remove()' must be implemented.");
    }
}
module.exports = ProductOrder;
