const DataBase = require("./DataLayer/DBManager");
const CafeteriaProductOrder = require("./CafeteriaProductOrder");
const MovieOrder = require("./MovieOrder");
const simpleLogger = require("simple-node-logger");
const logger = simpleLogger.createSimpleLogger({
    logFilePath: "database.log",
    timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});

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
        name: DataBase._add,
        model: "order",
        params: {
            element: {
                id: this.id,
                date: this.date, //this.date.toISOString().substring(0, 10),
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
            name: DataBase._remove,
            model: "order",
            params: { where: { id: this.id } },
        });

        return list;
    };

    getOrderRemovingObjectsList = () => {
        let list = [];
        this.productOrders.forEach((productOrder) => {
            list = list.concat(productOrder.getOrderRemovingObject());
        });
        list = list.concat([{
            name: DataBase._remove,
            model: "order",
            params: { where: { id: this.id } },
        }, ]);
        return list;
    };

    removeProductOrders = () => {
        this.productOrders.forEach((productOrder) => {
            productOrder.remove();
        });
    };
    /**
     * edit order of cafetria product
     * @param {string} date New date of the order if exists
     * @param {string} supplierId New supplier Id of the order
     * @param {Array(string)} productsList List of product in the order (list of product's unique name)
     * @returns {Promise(string)} Success or failure string
     **/
    async editOrder(date, supplierId, productsList) {
            let DBActionList = [];
            //DATABASES
            //If the date is a type that can be converted to a date then you will take the action
            if (
                typeof date === "string" ||
                (typeof date === "object" && date !== null)
            ) {
                DBActionList = DBActionList.concat({
                    name: DataBase._update,
                    model: "order",
                    params: {
                        where: {
                            id: this.id,
                        },
                        element: {
                            date: date,
                        },
                    },
                });
            }
            if (typeof supplierId === "number") {
                DBActionList = DBActionList.concat({
                    name: DataBase._update,
                    model: "order",
                    params: {
                        where: {
                            id: this.id,
                        },
                        element: {
                            supplierId: supplierId,
                        },
                    },
                });
            }
            productsList
                .filter((product) => this.productOrders.has(product.id))
                .forEach((product) => {
                    if (product instanceof CafeteriaProductOrder) {
                        DBActionList = DBActionList.concat({
                            name: DataBase._update,
                            model: "cafeteria_product_order",
                            params: {
                                where: {
                                    orderId: this.id,
                                    productId: product.id,
                                },
                                element: {
                                    expectedQuantity: product.quantity,
                                },
                            },
                        });
                    } else if (product instanceof MovieOrder) {
                        DBActionList = DBActionList.concat({
                            name: DataBase._update,
                            model: "movie",
                            params: {
                                where: {
                                    movieId: product.id,
                                },
                                element: {
                                    key: product.key,
                                    examinationRoom: product.examinationRoom,
                                },
                            },
                        });
                        DBActionList = DBActionList.concat({
                            name: DataBase._update,
                            model: "movie_order",
                            params: {
                                where: {
                                    orderId: this.id,
                                    movieId: product.id,
                                },
                                element: {
                                    expectedQuantity: product.quantity,
                                },
                            },
                        });
                    }
                });
            let result = await DataBase.executeActions(DBActionList);
            if (typeof result === "string") {
                this.writeToLog("info", "editOrder", result);
                return result;
            }
            //system
            if (typeof date === "string" || typeof date === "object") {
                this.date = date;
            }
            if (typeof supplierId === "number") {
                this.supplierId = supplierId;
            }
            productsList.forEach((product) => {
                let res = product.id;
                if (this.productOrders.has(product.id)) {
                    if (this.productOrders.get(product.id) instanceof CafeteriaProductOrder)
                        this.productOrders
                        .get(product.id)
                        .editCafeteriaProductOrderExpected(product.quantity);
                    else if (this.productOrders.get(product.id) instanceof MovieOrder) {
                        this.productOrders
                            .get(product.id)
                            .editMovieOrder(
                                product.quantity,
                                product.key,
                                product.examinationRoom
                            );
                    }
                }
            });
            return "The order edited successfully completed";
        }
        /**
         * Confirmation of the order received by an employee
         * @param {list} productList List of all products received
         * @returns {Promise(string)} Success or failure string
         **/
    async confirmOrder(productList, recipientEmployeeId) {
        let numOfProduct = this.productOrders.size;
        //Checks whether all ordered products were accepted within the list
        productList.forEach((product) => {
            if (this.productOrders.has(product.id)) numOfProduct--;
        });
        if (numOfProduct > 0) {
            this.writeToLog(
                "info",
                "confirmOrder",
                "No status was received for all order products"
            );
            return "No status was received for all order products";
        }
        //Database actions
        let DBActionList = [{
            name: DataBase._update,
            model: "order",
            params: {
                where: {
                    id: this.id,
                },
                element: {
                    recipientEmployeeId: recipientEmployeeId,
                },
            },
        }, ];
        productList.forEach((product) => {
            if (this.productOrders.has(product.id)) {
                if (
                    this.productOrders.get(product.id) instanceof CafeteriaProductOrder
                ) {
                    let productAction = this.productOrders
                        .get(product.id)
                        .getConfirmOrderDB(product.actualQuantity);
                    DBActionList.push(productAction[0]);
                    DBActionList.push(productAction[1]);
                } else if (this.productOrders.get(product.id) instanceof MovieOrder) {
                    let productAction = this.productOrders
                        .get(product.id)
                        .getConfirmOrderDB(product.key, product.examinationRoom);
                    DBActionList.push(productAction[0]);
                    DBActionList.push(productAction[1]);
                }
            }
        });
        let result = await DataBase.executeActions(DBActionList);
        if (typeof result === "string") {
            this.writeToLog("info", "confirmOrder", "DB fauiler- " + result);
            return "DB fauiler- " + result;
        }
        //system actions
        this.recipientEmployeeId = recipientEmployeeId;
        productList.forEach((product) => {
            if (this.productOrders.has(product.id)) {
                if (
                    this.productOrders.get(product.id) instanceof CafeteriaProductOrder
                ) {
                    this.productOrders
                        .get(product.id)
                        .confirmOrder(product.actualQuantity);
                } else if (this.productOrders.get(product.id) instanceof MovieOrder) {
                    this.productOrders
                        .get(product.id)
                        .confirmOrder(product.key, product.examinationRoom);
                }
            }
        });
        return "Order confirmation success";
    }

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

    hasCafetriaProductInOrder() {
        let hasCafetriaProduct = false;
        this.productOrders.forEach((value, key) => {
            if (value instanceof CafeteriaProductOrder) hasCafetriaProduct = true;
        });
        return hasCafetriaProduct;
    }
    hasMoviesInOrder() {
        let hasMovies = false;
        this.productOrders.forEach((value, key) => {
            if (value instanceof MovieOrder) hasMovies = true;
        });
        return hasMovies;
    }

    writeToLog(type, functionName, msg) {
        logger.log(type, "Order - " + functionName + " - " + msg);
    }
}
module.exports = Order;