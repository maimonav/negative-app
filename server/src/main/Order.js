const DataBase = require("./DBManager");


class Order {

    constructor(id, date, creatorEmployeeId , supplierId) {
        this.id = id;
        this.date = date;
        this.creatorEmployeeId = creatorEmployeeId;
        this.recipientEmployeeId = null;
        this.supplierId = supplierId;
        this.productOrders = new Map();
        DataBase.add('order', { id: id, date: date, creatorEmployeeId: creatorEmployeeId, supplierId:supplierId });
        DataBase.setDestroyTimer('orders',true,'1 YEAR','1 DAY');
    }
    
        //TODO:: might be changed
        removeOrder = () => {
            this.productOrders.forEach(async (productOrder)=> {
            await productOrder.removeOrder(this.id).then((res)=>{
                //if(res)
            })
            });
            DataBase.remove('order', { id: this.id });
        }
    

    //TODO
    equals(toCompare) {
        return (
            toCompare.id === this.id &&
            toCompare.date === this.date &&
            toCompare.creatorEmployeeId === this.creatorEmployeeId &&
            toCompare.recipientEmployeeId === this.recipientEmployeeId &&
            toCompare.supplierId === this.supplierId // &&
           // toCompare.productOrders === this.productOrders 
        );
    }
}
module.exports = Order;