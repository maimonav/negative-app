const DataBase = require("./DBManager");


class CafeteriaProduct extends Product {

    constructor(id, name, categoryId, price, quantity, maxQuantity, minQuantity) {
        super(id, name, categoryId);
        this.price = price;
        this.quantity = quantity;
        this.maxQuantity = maxQuantity ? maxQuantity : 9999999;
        this.minQuantity = minQuantity ? minQuantity : 0;
        this.isProductRemoved = null;
        DataBase.add('cafeteria_product', { id: id, name: name, categoryId: categoryId, price: price, 
            quantity: quantity, maxQuantity: maxQuantity , minQuantity:minQuantity});
        DataBase.setDestroyTimer('cafeteria_products',false,'2 YEAR','1 DAY','isProductRemoved');
    }


    equals(toCompare) {
        return (
            super(toCompare) &&
            toCompare.price === this.price &&
            toCompare.quantity === this.quantity &&
            toCompare.maxQuantity === this.maxQuantity &&
            toCompare.minQuantity === this.minQuantity &&
            toCompare.isProductRemoved === this.isProductRemoved
        );
    }

}
module.exports = CafeteriaProduct;