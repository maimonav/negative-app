const DataBase = require("./DBManager");
const _ = require('lodash');



class Order {

    constructor(id, supplierId, date, creatorEmployeeId) {
        this.id = id;
        this.date = date;
        this.creatorEmployeeId = creatorEmployeeId;
        this.recipientEmployeeId = null;
        this.supplierId = supplierId;
        this.productOrders = new Map();
        DataBase.add('order', { id: id, date: date, creatorEmployeeId: creatorEmployeeId, supplierId: supplierId });
        DataBase.setDestroyTimer('orders', true, '1 YEAR', '1 DAY');
    }

    //TODO:: might be changed
    removeOrder = () => {
        /*this.productOrders.forEach(async (productOrder)=> {
        await productOrder.removeOrder(this.id).then((res)=>{
            //if(res)
        })
        });*/
        DataBase.remove('order', { id: this.id });
    }

    addProductOrder(id, productOrder) {
        this.productOrders.set(id, productOrder);
    }

    equals(toCompare) {
        return (
            toCompare.id === this.id &&
            toCompare.date.toISOString() === this.date.toISOString() &&
            toCompare.creatorEmployeeId === this.creatorEmployeeId &&
            toCompare.recipientEmployeeId === this.recipientEmployeeId &&
            toCompare.supplierId === this.supplierId &&
            _.isEqualWith(toCompare.productOrders, this.productOrders, function (val1, val2) {
                if (_.isFunction(val1) && _.isFunction(val2)) {
                    return val1.toString() === val2.toString();
                } 
            }));
    }
}
module.exports = Order;