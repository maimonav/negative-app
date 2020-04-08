const DataBase = require("./DBManager");
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
        DataBase.add('cafeteria_product', { id: id, name: name, categoryId: categoryId, price: price, 
            quantity: quantity, maxQuantity: maxQuantity , minQuantity:minQuantity});
        DataBase.setDestroyTimer('cafeteria_products',false,'2 YEAR','1 DAY','isProductRemoved');
    }

    
    createOrder(order,quantity){
        this.productOrders.set(order.id,new CafeteriaProductOrder(this,order,quantity));
    }

    removeProduct = () => {
        if (this.isProductRemoved == null) {
            this.isProductRemoved = new Date();
            DataBase.update('cafeteria_product', { id: this.id }, { isProductRemoved: this.isProductRemoved });
            return "The product removed successfully";
        }
        else
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