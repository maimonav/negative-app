const DataBase = require("./DataLayer/DBManager");
const _ = require("lodash");

class Order {
    constructor(id, supplierId, date, creatorEmployeeId, orderName) {
        this.id = id;
        this.name = orderName;
        this.date = date;
        this.creatorEmployeeId = creatorEmployeeId;
        this.recipientEmployeeId = null;
        this.supplierId = supplierId;
        this.productOrders = new Map();
    }

    getOrderAdditionObject = () => ({
        name: DataBase.add,
        model: "order",
        params: {
            element: {
                id: this.id,
                date: this.date.toISOString().substring(0, 10),
                creatorEmployeeId: this.creatorEmployeeId,
                supplierId: this.supplierId,
            },
        },
    });

    getOrderRemovingObjectsList = () => {
        let list = [];
        this.productOrders.forEach((productOrder) => {
            list = list.concat(productOrder.getOrderRemovingObject());
        });
        list = list.concat({
            name: DataBase.remove,
            model: "order",
            params: { where: { id: this.id } },
        });

        return list;
    };

    getOrderRemovingObjectsList = () => {
        let list = [{
            name: DataBase.remove,
            model: "order",
            params: { where: { id: this.id } },
        }, ];
        this.productOrders.forEach((productOrder) => {
            list = list.concat(productOrder.getOrderRemovingObject());
        });
        return list;
    };

    removeProductOrders = () => {
        this.productOrders.forEach((productOrder) => {
            productOrder.remove();
        });
    };

    equals(toCompare) {
        return (
            toCompare.id === this.id &&
            toCompare.date.toISOString() === this.date.toISOString() &&
            toCompare.creatorEmployeeId === this.creatorEmployeeId &&
            toCompare.recipientEmployeeId === this.recipientEmployeeId &&
            toCompare.supplierId === this.supplierId &&
            _.isEqualWith(toCompare.productOrders, this.productOrders, function(
                val1,
                val2
            ) {
                if (_.isFunction(val1) && _.isFunction(val2)) {
                    return val1.toString() === val2.toString();
                }
            })
        );
    }
}
module.exports = Order;