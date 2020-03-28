const Sequelize = require('sequelize');
const mysql = require('mysql2');
const { generalPurposeDailyReportSchema, inventoryDailyReportSchema, moviesDailyReportSchema, incomesDailyReportSchema,
    supplierSchema, movieSchema, cafeteriaProductSchema, categorySchema, movieOrderSchema, cafeteriaProductOrderSchema, orderSchema,
    userSchema, employeeSchema } = require("./Models");

class DataBase {

    static testModeOn() {
        this.isTestMode = true;
    }
    static testModeOff() {
        this.isTestMode = false;

    }


    static initDB(dbName) {
        if (this.isTestMode)
            return;
        try {
            this.isTestMode = false;
            this.sequelize = new Sequelize(dbName, 'root', 'admin', {
                host: 'localhost',
                dialect: 'mysql'
            });

            DataBase.initModels();
            this.models = {
                user: this.User, employee: this.Employee, supplier: this.Supplier, category: this.Category,
                order: this.Order, movie: this.Movie, cafeteria_product: this.CafeteriaProduct, movie_order: this.MovieOrder,
                cafeteria_product_order: this.CafeteriaProductOrder, general_purpose_daily_report: this.GeneralPurposeDailyReport,
                inventory_daily_report: this.InventoryDailyReport, movie_daily_report: this.MoviesDailyReport,
                incomes_daily_report: this.IncomesDailyReport
            };

        } catch (error) {
            console.log(error);
        }
        return this.sequelize;
    }


    static initModels() {
        this.User = this.sequelize.define('user', userSchema(), {
            hooks: {
                //define trigger after updating isUserRemoved
                afterBulkUpdate: async (user) => {
                    if (user.attributes.isUserRemoved && user.attributes.isUserRemoved != null) {
                        await DataBase.update('employee', { id: user.where.id }, { isEmployeeRemoved: true });
                    }
                }
            }
        });
        this.Employee = this.sequelize.define('employee', employeeSchema(this.User), {});
        this.Supplier = this.sequelize.define('supplier', supplierSchema(), {});
        this.Category = this.sequelize.define('category', categorySchema(), {
            hooks: {
                //define trigger category had been used
                beforeBulkUpdate: async (category) => {
                    if (category.attributes.isCategoryRemoved && category.attributes.isCategoryRemoved != null) {
                        await this.CafeteriaProduct.sync({transaction : category.transaction}).then(async () => {
                            await this.CafeteriaProduct.count({ categoryId: category.where.id }).then(async (resultProduct) => {
                                if (resultProduct != 0)
                                    category.transaction.rollback();

                                else
                                    await this.Movie.sync({transaction : category.transaction}).then(async () => {
                                        await this.Movie.count({ categoryId: category.where.id }).then(async (resultMovie) => {
                                            if (resultMovie != 0)
                                                category.transaction.rollback();
                                        });
                                    });
                            });
                        });
                    }
                }
            }
        });
        this.Order = this.sequelize.define('order', orderSchema(this.Employee, this.Supplier), {
            hooks: DataBase.getOrderHook('order')
        });
        this.Movie = this.sequelize.define('movie', movieSchema(this.Category), {});
        this.CafeteriaProduct = this.sequelize.define('cafeteria_product', cafeteriaProductSchema(this.Category), {});
        this.MovieOrder = this.sequelize.define('movie_order', movieOrderSchema(this.Movie, this.Order), {
            hooks: DataBase.getOrderHook('movie_order')
        });
        this.CafeteriaProductOrder = this.sequelize.define('cafeteria_product_order', cafeteriaProductOrderSchema(this.CafeteriaProduct, this.Order), {
            hooks: DataBase.getOrderHook('cafeteria_product_order')

        });
        this.GeneralPurposeDailyReport = this.sequelize.define('general_purpose_daily_report', generalPurposeDailyReportSchema(this.Employee), {});
        this.InventoryDailyReport = this.sequelize.define('inventory_daily_report', inventoryDailyReportSchema(this.CafeteriaProduct, this.Employee), {});
        this.MoviesDailyReport = this.sequelize.define('movie_daily_report', moviesDailyReportSchema(this.Movie, this.Employee), {});
        this.IncomesDailyReport = this.sequelize.define('incomes_daily_report', incomesDailyReportSchema(this.Employee), {});
    }



    static getOrderHook(model) {
        return {
            beforeBulkDestroy: async (order) => {
                await DataBase.getById('order', { id: model === 'order' ? order.where.id : order.where.orderId }).then(async (result) => {
                    if (result.recipientEmployeeId != null) {
                        order.transaction.rollback();
                    }
                });
            }
        };
    }

    static init() {
        if (this.isTestMode)
            return;
        this.initDB('mydb');
    }

    static async connectAndCreate() {
        if (this.isTestMode)
            return;
        try {
            const con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "admin"
            });

            await con.connect(async function (err) {
                if (err) throw err;
                console.log("Connected!");
            });
            await con.promise().query("CREATE DATABASE mydb");
            console.log("Database created");
        } catch (error) {
            console.log(error);
        }
    }

    async close() {
        if (this.isTestMode)
            return;
        try {
            await this.sequelize.close();
        } catch (error) {
            console.log(error);
        }
    }

    static add(modelName, element) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.create(element, { transaction: t });
                })
                    .catch((error => console.log(error)));

            } catch (error) {
                console.log(error);
            }
        });
    }

    static getById(modelName, where) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    let res = model.findOne({ where: where, transaction: t });
                    return res;
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }





    static update(modelName, where, element) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.update(element, { where: where, transaction: t });
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }


    static remove(modelName, where) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.destroy({ where: where, transaction: t });
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }


    static setDestroyTimer(table, afterCreate, deleteTime, eventTime, prop) {
        let destroyQuery = DataBase.getDestroyQuery(table, afterCreate, deleteTime, eventTime, prop);
        try {
            return this.sequelize.transaction((t) => {
                return this.sequelize.query(destroyQuery, { t });
            })
                .catch((error => console.log(error)));
        } catch (error) {
            console.log(error);
        }
    }


    static getDestroyQuery(table, afterCreate, deleteTime, eventTime, prop) {
        let where = "";
        if (afterCreate) {
            where = "createdAt <= (CURRENT_TIMESTAMP - INTERVAL " + deleteTime + ");";
        }
        else {
            where = prop + " IS NOT NULL AND " + prop + " <= (CURRENT_TIMESTAMP - INTERVAL " + deleteTime + ");";
        }
        return "CREATE EVENT IF NOT EXISTS delete_event_" + table + " " +
            "ON SCHEDULE " +
            "EVERY " + eventTime + " " +
            "DO DELETE FROM " + table + " WHERE " + where;
    }


};

module.exports = DataBase;
