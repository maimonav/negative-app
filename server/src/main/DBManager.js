const Sequelize = require('sequelize');
const mysql = require('mysql2');
const {generalPurposeDailyReportSchema, inventoryDailyReportSchema, moviesDailyReportSchema, incomesDailyReportSchema,
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
                order: this.Order, movie: this.Movie, cafeteriaProduct: this.CafeteriaProduct, movieOrder: this.MovieOrder,
                cafeteriaProductOrder: this.CafeteriaProductOrder, generalPurposeDailyReport: this.GeneralPurposeDailyReport,
                inventoryDailyReport: this.InventoryDailyReport, moviesDailyReport: this.MoviesDailyReport,
                incomesDailyReport: this.IncomesDailyReport
            };

        } catch (error) {
            console.log(error);
        }
        return this.sequelize;
    }

    static initModels() {
        this.User = this.sequelize.define('user', userSchema(), {});
        //define trigger after updating isUserRemoved
        this.User.addHook('afterUpdate', async (user) => {
            if(user.isUserRemoved){
                await DataBase.update('employee',user.id,{ isEmployeeRemoved: true });
            }
          });
        this.Employee = this.sequelize.define('employee', employeeSchema(this.User), {});
        this.Supplier = this.sequelize.define('supplier', supplierSchema(), {});
        this.Category = this.sequelize.define('category', categorySchema(), {});
        this.Order = this.sequelize.define('order', orderSchema(this.Employee, this.Supplier), {});
        this.Movie = this.sequelize.define('movie', movieSchema(this.Category), {});
        this.CafeteriaProduct = this.sequelize.define('cafeteria_product', cafeteriaProductSchema(this.Category), {});
        this.MovieOrder = this.sequelize.define('movie_order', movieOrderSchema(this.Movie, this.Order), {});
        this.CafeteriaProductOrder = this.sequelize.define('cafeteria_product_order', cafeteriaProductOrderSchema(this.CafeteriaProduct, this.Order), {});
        this.GeneralPurposeDailyReport = this.sequelize.define('general_purpose_daily_report', generalPurposeDailyReportSchema(this.Employee), {});
        this.InventoryDailyReport = this.sequelize.define('inventory_daily_report', inventoryDailyReportSchema(this.CafeteriaProduct,this.Employee), {});
        this.MoviesDailyReport = this.sequelize.define('movie_daily_reports', moviesDailyReportSchema(this.Movie,this.Employee), {});
        this.IncomesDailyReport = this.sequelize.define('incomes_daily_report', incomesDailyReportSchema(this.Employee), {});
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

    static getById(modelName, id) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    let res = model.findByPk(id, { transaction: t });
                    return res;
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }

    static update(modelName, id, element) {
        if (this.isTestMode)
            return;
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.update(element, { where: { id: id }, transaction: t });
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }


};

module.exports = DataBase;
