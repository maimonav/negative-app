const DataBase = require("./DBManager");
const uniqid = require("uniqid");
const DBlogger = require("simple-node-logger").createSimpleLogger({
  logFilePath: "database.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
const {
  generalPurposeDailyReportSchema,
  inventoryDailyReportSchema,
  moviesDailyReportSchema,
  incomesDailyReportSchema,
  supplierSchema,
  movieSchema,
  cafeteriaProductSchema,
  categorySchema,
  movieOrderSchema,
  cafeteriaProductOrderSchema,
  orderSchema,
  userSchema,
  employeeSchema,
} = require("./Models");
const Sequelize = require("sequelize");
const mysql = require("mysql2");

async function _setDestroyTimerForAllTables() {
  let userObj = {
    table: "users",
    prop: "isUserRemoved",
    deleteTime: "2 YEAR",
    eventTime: "1 DAY",
  };
  let employeeObj = {
    table: "employees",
    prop: "isEmployeeRemoved",
    deleteTime: "2 YEAR",
    eventTime: "1 DAY",
  };
  let movieObj = {
    table: "movies",
    prop: "isMovieRemoved",
    deleteTime: "2 YEAR",
    eventTime: "1 DAY",
  };
  let productObj = {
    table: "cafeteria_products",
    prop: "isProductRemoved",
    deleteTime: "2 YEAR",
    eventTime: "1 DAY",
  };
  let categoryObj = {
    table: "categories",
    prop: "isCategoryRemoved",
    deleteTime: "2 YEAR",
    eventTime: "1 DAY",
  };
  let supplierObj = {
    table: "suppliers",
    prop: "isSupplierRemoved",
    deleteTime: "2 YEAR",
    eventTime: "1 DAY",
  };

  let orderObj = {
    table: "orders",
    afterCreate: true,
    deleteTime: "1 YEAR",
    eventTime: "1 DAY",
  };
  let productOrderObj = {
    table: "cafeteria_product_orders",
    afterCreate: true,
    deleteTime: "1 YEAR",
    eventTime: "1 DAY",
  };
  let movieOrderObj = {
    table: "movie_orders",
    afterCreate: true,
    deleteTime: "1 YEAR",
    eventTime: "1 DAY",
  };
  let moviesReportObj = {
    table: "movie_daily_reports",
    afterCreate: true,
    deleteTime: "1 YEAR",
    eventTime: "1 DAY",
  };
  let incomesReportObj = {
    table: "incomes_daily_reports",
    afterCreate: true,
    deleteTime: "1 YEAR",
    eventTime: "1 DAY",
  };
  let inventoryReportObj = {
    table: "inventory_daily_reports",
    afterCreate: true,
    deleteTime: "1 YEAR",
    eventTime: "1 DAY",
  };
  let generalReportObj = {
    table: "general_purpose_daily_reports",
    afterCreate: true,
    deleteTime: "1 YEAR",
    eventTime: "1 DAY",
  };
  return DataBase.executeActions([
    { name: DataBase.setDestroyTimer, params: userObj },
    { name: DataBase.setDestroyTimer, params: employeeObj },
    { name: DataBase.setDestroyTimer, params: movieObj },
    { name: DataBase.setDestroyTimer, params: productObj },
    { name: DataBase.setDestroyTimer, params: categoryObj },
    { name: DataBase.setDestroyTimer, params: supplierObj },
    { name: DataBase.setDestroyTimer, params: orderObj },
    { name: DataBase.setDestroyTimer, params: productOrderObj },
    { name: DataBase.setDestroyTimer, params: movieOrderObj },
    { name: DataBase.setDestroyTimer, params: moviesReportObj },
    { name: DataBase.setDestroyTimer, params: incomesReportObj },
    { name: DataBase.setDestroyTimer, params: inventoryReportObj },
    { name: DataBase.setDestroyTimer, params: generalReportObj },
  ]);
}

/**
 * Initialize database - create and init models and tables
 * @param {string} dbName Name of the database
 * @param {string} password Password for database connecting
 * @returns {Promise(Sequelize | string)} Sequelize ORM object in seccess or string in failure
 */
async function initDB(dbName, password) {
  if (DataBase._isTestMode) return;
  let defaultDBName = "mydb";
  let defaultPassword = "admin";
  DataBase.sequelize = new Sequelize(
    dbName ? dbName : defaultDBName,
    "root",
    password ? password : defaultPassword,
    {
      host: "localhost",
      dialect: "mysql",
    }
  );

  try {
    await DataBase.sequelize.authenticate();
  } catch (error) {
    let errId = uniqid();
    DBlogger.error(
      errId,
      " - DBInitialization - initDB - authenticate - ",
      dbName ? dbName : defaultDBName,
      ", ",
      password ? password : defaultPassword,
      " - ",
      error
    );
    return DataBase._errorHandler.apply(DataBase, [error, errId]);
  }

  _initModels();

  DataBase.models = {
    user: DataBase.User,
    employee: DataBase.Employee,
    supplier: DataBase.Supplier,
    category: DataBase.Category,
    order: DataBase.Order,
    movie: DataBase.Movie,
    cafeteria_product: DataBase.CafeteriaProduct,
    movie_order: DataBase.MovieOrder,
    cafeteria_product_order: DataBase.CafeteriaProductOrder,
    general_purpose_daily_report: DataBase.GeneralPurposeDailyReport,
    inventory_daily_report: DataBase.InventoryDailyReport,
    movie_daily_report: DataBase.MoviesDailyReport,
    incomes_daily_report: DataBase.IncomesDailyReport,
  };

  try {
    const keys = Object.keys(DataBase.models);
    for (let idx in keys) {
      await DataBase.models[keys[idx]].sync();
    }

    let result;
    if (dbName === undefined || dbName.toLowerCase() !== "mydbtest") {
      result = await _setDestroyTimerForAllTables();
      if (typeof result === "string") {
        DBlogger.info(
          " - DBInitialization - initDB - setDestroyTimerForAllTables - ",
          result
        );
        return result;
      }
    }

    result = await _initGeneralReport();
    if (typeof result === "string") {
      DBlogger.info(
        " - DBInitialization - initDB - initGeneralReport - ",
        result
      );
      return result;
    }
  } catch (error) {
    let errId = uniqid();
    DBlogger.error(
      errId,
      " - DBInitialization - initDB - init tables - ",
      dbName ? dbName : defaultDBName,
      ", ",
      password ? password : defaultPassword,
      " - ",
      error
    );
    return DataBase._errorHandler.apply(DataBase, [error, errId]);
  }

  return DataBase.sequelize;
}

async function _initGeneralReport() {
  let result = await DataBase.singleGetById("general_purpose_daily_report", {});
  if (result != null) return;
  let todayDate = new Date();
  let date = new Date(todayDate.setDate(todayDate.getDate() - 1));
  return DataBase.singleAdd("general_purpose_daily_report", {
    date: date.toISOString().substring(0, 10),
    additionalProps: [[], {}],
  });
}

/**
 * Create database and connect to it
 * @param {string} dbName The name of the database
 * @param {string} password The password to connect database
 * @returns {Promise(void | string)} string in failure
 */
async function connectAndCreate(dbName, password) {
  if (DataBase._isTestMode) return;
  let defaultDBName = "mydb";
  let defaultPassword = "admin";
  try {
    DataBase.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: password ? password : defaultPassword,
    });

    await DataBase.connection.connect(async function(error) {
      if (error) {
        throw error;
      }
      console.log("Connected!");
    });

    await DataBase.connection
      .promise()
      .query(
        "CREATE DATABASE IF NOT EXISTS " + (dbName ? dbName : defaultDBName)
      );
    console.log("Database created");
  } catch (error) {
    let errId = uniqid();
    DBlogger.error(
      errId,
      " - DBInitialization - connectAndCreate - ",
      dbName ? dbName : defaultDBName,
      ", ",
      password ? password : defaultPassword,
      " - ",
      error
    );
    return DataBase._errorHandler.apply(DataBase, [error, errId]);
  }
}

function getOrderHook(model) {
  return {
    beforeBulkDestroy: async (order) => {
      await DataBase.singleGetById("order", {
        id: model === "order" ? order.where.id : order.where.orderId,
      }).then(async (result) => {
        if (result.recipientEmployeeId != null) {
          order.transaction.rollback();
        }
      });
    },
  };
}

function _initModels() {
  DataBase.User = DataBase.sequelize.define("user", userSchema(), {
    hooks: {
      //define trigger after updating isUserRemoved
      afterBulkUpdate: async (user) => {
        if (
          user.attributes.isUserRemoved &&
          user.attributes.isUserRemoved != null
        ) {
          await DataBase.singleUpdate(
            "employee",
            { id: user.where.id },
            { isEmployeeRemoved: true }
          );
        }
      },
    },
  });
  DataBase.Employee = DataBase.sequelize.define(
    "employee",
    employeeSchema(DataBase.User),
    {}
  );
  DataBase.Supplier = DataBase.sequelize.define(
    "supplier",
    supplierSchema(),
    {}
  );
  DataBase.Category = DataBase.sequelize.define("category", categorySchema(), {
    hooks: {
      //define trigger category had been used
      beforeBulkUpdate: async (category) => {
        if (
          category.attributes.isCategoryRemoved &&
          category.attributes.isCategoryRemoved != null
        ) {
          await DataBase.CafeteriaProduct.sync({
            transaction: category.transaction,
          }).then(async () => {
            await DataBase.CafeteriaProduct.count({
              categoryId: category.where.id,
            }).then(async (resultProduct) => {
              if (resultProduct !== 0) category.transaction.rollback();
              else
                await DataBase.Movie.sync({
                  transaction: category.transaction,
                }).then(async () => {
                  await DataBase.Movie.count({
                    categoryId: category.where.id,
                  }).then(async (resultMovie) => {
                    if (resultMovie !== 0) category.transaction.rollback();
                  });
                });
            });
          });
        }
      },
    },
  });
  DataBase.Order = DataBase.sequelize.define(
    "order",
    orderSchema(DataBase.Employee, DataBase.Supplier),
    {
      hooks: getOrderHook("order"),
    }
  );
  DataBase.Movie = DataBase.sequelize.define(
    "movie",
    movieSchema(DataBase.Category),
    {}
  );
  DataBase.CafeteriaProduct = DataBase.sequelize.define(
    "cafeteria_product",
    cafeteriaProductSchema(DataBase.Category),
    {}
  );
  DataBase.MovieOrder = DataBase.sequelize.define(
    "movie_order",
    movieOrderSchema(DataBase.Movie, DataBase.Order),
    {
      hooks: getOrderHook("movie_order"),
    }
  );
  DataBase.CafeteriaProductOrder = DataBase.sequelize.define(
    "cafeteria_product_order",
    cafeteriaProductOrderSchema(DataBase.CafeteriaProduct, DataBase.Order),
    {
      hooks: getOrderHook("cafeteria_product_order"),
    }
  );
  DataBase.GeneralPurposeDailyReport = DataBase.sequelize.define(
    "general_purpose_daily_report",
    generalPurposeDailyReportSchema(DataBase.Employee),
    {}
  );
  DataBase.InventoryDailyReport = DataBase.sequelize.define(
    "inventory_daily_report",
    inventoryDailyReportSchema(DataBase.CafeteriaProduct, DataBase.Employee),
    {}
  );
  DataBase.MoviesDailyReport = DataBase.sequelize.define(
    "movie_daily_report",
    moviesDailyReportSchema(DataBase.Movie, DataBase.Employee),
    {}
  );
  DataBase.IncomesDailyReport = DataBase.sequelize.define(
    "incomes_daily_report",
    incomesDailyReportSchema(DataBase.Employee),
    {}
  );
}

exports.initDB = initDB;
exports.connectAndCreate = connectAndCreate;
