class Product {

    constructor(id, name, categoryId) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.productOrders = new Map();
    }


    removeOrder(orderId) {
        this.productOrders.delete(orderId);
    }

    equals(toCompare) {
        return (
            toCompare.id === this.id &&
            toCompare.name === this.name &&
            toCompare.categoryId === this.categoryId
        );
    }


}
module.exports = Product;