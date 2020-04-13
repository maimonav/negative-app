const Sequelize = require('sequelize');
const mysql = require('mysql2');
var uniqid = require('uniqid');

const { generalPurposeDailyReportSchema, inventoryDailyReportSchema, moviesDailyReportSchema, incomesDailyReportSchema,
    supplierSchema, movieSchema, cafeteriaProductSchema, categorySchema, movieOrderSchema, cafeteriaProductOrderSchema, orderSchema,
    userSchema, employeeSchema } = require("./Models");

class DataBase {

    static sequelize;
    static connection;
    static models;
    static isTestMode = false;

    static testModeOn() {
        this.isTestMode = true;
    }
    static testModeOff() {
        this.isTestMode = false;

    }

    static connectionMsg = 'Database Error: Unable to connect to the database.';

    static errorHandler(error) {
        console.log(error);
        let handler = error ? this.errorsHandling[error.name] : undefined;
        let msg = handler ? handler(error) :
            'Database Error: Cannot complete action.';
        ;
        return msg + '\nError ID: ' + uniqid();
    }

    //TODO:: add log
    static errorsHandling = {

        //errors/validation
        SequelizeUniqueConstraintError: (error) =>
            'Database Error: Unique constraint is violated in the database.', //validation, dupplicate primary key - programmers

        //errors/database
        SequelizeForeignKeyConstraintError: (error) =>
            'Database Error: Foreign key constraint is violated in the database.', //link to foreign key while does not exist      

        //errors/connection
        SequelizeConnectionError: (error) => this.connectionMsg,
        SequelizeConnectionRefusedError: (error) =>
            this.connectionMsg + ' MySql server has stopped running.', //mysql server stopped 
        SequelizeAccessDeniedError: (error) =>
            this.connectionMsg + ' Refused due to insufficient privileges'
            + ' - Password to database should be checked.' // wrong password

    };



    static async initDB(dbName, password) {
        if (this.isTestMode)
            return;


        this.sequelize = new Sequelize(dbName ? dbName : 'mydb', "root",
            password ? password : "admin", {
            host: "localhost",
            dialect: 'mysql'
        });

        try {
            await this.sequelize.authenticate();
        } catch (error) {
            return this.errorHandler(error);
        }
        
        DataBase.initModels();

        this.models = {
            user: this.User, employee: this.Employee, supplier: this.Supplier, category: this.Category,
            order: this.Order, movie: this.Movie, cafeteria_product: this.CafeteriaProduct, movie_order: this.MovieOrder,
            cafeteria_product_order: this.CafeteriaProductOrder, general_purpose_daily_report: this.GeneralPurposeDailyReport,
            inventory_daily_report: this.InventoryDailyReport, movie_daily_report: this.MoviesDailyReport,
            incomes_daily_report: this.IncomesDailyReport
        };

        try {
            const keys = Object.keys(this.models);
            for (let idx in keys)
                await DataBase.models[keys[idx]].sync();


        } catch (error) {
            return this.errorHandler(error);
        }

        

        return this.sequelize;
    }


    static initModels() {
        this.User = this.sequelize.define('user', userSchema(), {
            hooks: {
                //define trigger after updating isUserRemoved
                afterBulkUpdate: async (user) => {
                    if (user.attributes.isUserRemoved && user.attributes.isUserRemoved != null) {
                        await DataBase.singleUpdate('employee', { id: user.where.id }, { isEmployeeRemoved: true });
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
                        await this.CafeteriaProduct.sync({ transaction: category.transaction }).then(async () => {
                            await this.CafeteriaProduct.count({ categoryId: category.where.id }).then(async (resultProduct) => {
                                if (resultProduct != 0)
                                    category.transaction.rollback();

                                else
                                    await this.Movie.sync({ transaction: category.transaction }).then(async () => {
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
                await DataBase.singleGetById('order', { id: model === 'order' ? order.where.id : order.where.orderId }).then(async (result) => {
                    if (result.recipientEmployeeId != null) {
                        order.transaction.rollback();
                    }
                });
            }
        };
    }


    static async connectAndCreate(dbName, password) {
        if (this.isTestMode)
            return;

        try {
            this.connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: password ? password : "admin"
            });



            await this.connection.connect(async function (error) {
                if (error) {
                    throw error;
                }
                console.log("Connected!");
            });


            await this.connection.promise().query("CREATE DATABASE " + (dbName ? dbName : 'mydb'));
            console.log("Database created");
        } catch (error) {
            console.log(error);
            return 'error';
        }


    }

    static async close() {
        if (this.isTestMode)
            return;
        try {
            await this.sequelize.close();
        } catch (error) {
            return this.errorHandler(error);
        }
    }

    static executeActions(actionsList) {
        if (this.isTestMode)
            return;
        try {
            return this.sequelize.transaction((t) => {
                for (let i in actionsList) {
                    const action = actionsList[i];
                    const model = action.model ? this.models[action.model] : undefined;
                    action.name(action.params, t, model);
                }

            }).catch((error) => {
                return this.errorHandler(error);
            });
        } catch (error) {
            return this.errorHandler(error);
        }
    }

    static add(params, t, model) {
        //return model.sync().then(() => {
        return model.create(params.element, { transaction: t });
        /*})
            .catch((error => {
                return this.errorHandler(error);
            }));*/
    }


    static getById(params, t, model) {
        //return model.sync().then(() => {

        let res = model.findOne({ where: params.where, transaction: t });
        return res;
        /*})
            .catch((error => {
                return this.errorHandler(error);
            }));*/
    }

    static update(params, t, model) {
        //return model.sync().then(() => {

        return model.update(params.element, { where: params.where, transaction: t });
        /*})
            .catch((error => {
                return this.errorHandler(error);
            }));*/
    }

    static remove(params, t, model) {
        //return model.sync().then(() => {

        return model.destroy({ where: params.where, transaction: t });
        /* })
             .catch((error => {
                 return this.errorHandler(error);
             }));*/

    }


    static findAll(params, t, model) {
        const attributes = params.attributes;
        let attributesArray = [[this.sequelize.fn(attributes.fn, this.sequelize.col(attributes.fnField)), attributes.fnField]];
        attributes.fields && attributes.fields.forEach(e => {
            attributesArray = attributesArray.concat(e);
        })

        //return model.sync().then(() => {
        return model.findAll({
            attributes: attributesArray,
            where: params.where,
            transaction: t
        });
        /*})
            .catch((error => {
                return this.errorHandler(error);
            }));*/
    }

    static setDestroyTimer(params, t) {
        let destroyQuery = DataBase.getDestroyQuery(params.table, params.afterCreate, params.deleteTime,
            params.eventTime, params.prop);
        return this.sequelize.query(destroyQuery, { t })

            .catch((error => {
                return this.errorHandler(error);
            }));
    }



    static singleAdd(modelName, element) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        try {
            return this.sequelize.transaction((t) => {
                //  return model.sync().then(() => {
                return model.create(element, { transaction: t });
                /* })
                     .catch((error => {
                         return this.errorHandler(error);
                     }));*/


            }).catch((error) => {
                return this.errorHandler(error);
            });
        } catch (error) {
            return this.errorHandler(error);
        }
    }

    static singleGetById(modelName, where) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        try {
            return this.sequelize.transaction((t) => {
                //return model.sync().then(() => {
                let res = model.findOne({ where: where, transaction: t });
                return res;
                /*})
                    .catch((error => {
                        return this.errorHandler(error);
                    }));*/


            }).catch((error) => {
                return this.errorHandler(error);
            });
        } catch (error) {
            return this.errorHandler(error);
        }
    }





    static singleUpdate(modelName, where, element) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        try {
            return this.sequelize.transaction((t) => {
                // return model.sync().then(() => {

                return model.update(element, { where: where, transaction: t });
                /*  })
                     .catch((error => {
                          return this.errorHandler(error);
                      }));*/


            }).catch((error) => {
                return this.errorHandler(error);
            });
        } catch (error) {
            return this.errorHandler(error);
        }
    }


    static singleRemove(modelName, where) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        try {
            return this.sequelize.transaction((t) => {
                //return model.sync().then(() => {

                return model.destroy({ where: where, transaction: t });
                /* })
                     .catch((error => {
                         return this.errorHandler(error);
                     }));*/


            }).catch((error) => {
                return this.errorHandler(error);
            });
        } catch (error) {
            return this.errorHandler(error);
        }
    }


    static singleFindAll(modelName, where, attributes) {
        if (this.isTestMode)
            return;

        let attributesArray = [[this.sequelize.fn(attributes.fn, this.sequelize.col(attributes.fnField)), attributes.fnField]];
        attributes.fields && attributes.fields.forEach(e => {
            attributesArray = attributesArray.concat(e);
        })
        const model = this.models[modelName];
        try {
            return this.sequelize.transaction((t) => {
                //return model.sync().then(() => {
                return model.findAll({
                    attributes: attributesArray,
                    where: where,
                    transaction: t
                });
                /*  })
                      .catch((error => {
                          return this.errorHandler(error);
                      }));*/


            }).catch((error) => {
                return this.errorHandler(error);
            });
        } catch (error) {
            return this.errorHandler(error);
        }
    }


    static singleSetDestroyTimer(table, afterCreate, deleteTime, eventTime, prop) {
        if (this.isTestMode)
            return;
        let destroyQuery = DataBase.getDestroyQuery(table, afterCreate, deleteTime, eventTime, prop);
        try {
            return this.sequelize.transaction((t) => {
                return this.sequelize.query(destroyQuery, { t });
            })
                .catch((error => {
                    return this.errorHandler(error);
                }));

        } catch (error) {
            return this.errorHandler(error);
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
