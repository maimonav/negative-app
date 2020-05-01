const DBlogger = require("simple-node-logger").createSimpleLogger({
  logFilePath: "database.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
const uniqid = require("uniqid");

class DataBase {
  static sequelize;
  static connection;
  static models;
  static _isTestMode = false;

  static _testModeOn() {
    this._isTestMode = true;
  }
  static _testModeOff() {
    this._isTestMode = false;
  }

  static _connectionMsg = "Database Error: Unable to connect to the database.";

  static _errorHandler(error, errId) {
    let handler = error ? this._errorsHandling[error.name] : undefined;
    let msg = handler
      ? handler(error)
      : "Database Error: Cannot complete action.";
    return msg + "\nError ID: " + errId;
  }

  static _errorsHandling = {
    //errors/validation
    SequelizeUniqueConstraintError: () =>
      "Database Error: Unique constraint is violated in the database.", //validation, dupplicate primary key - programmers

    //errors/database
    SequelizeForeignKeyConstraintError: () =>
      "Database Error: Foreign key constraint is violated in the database.", //link to foreign key while does not exist

    //errors/connection
    SequelizeConnectionError: () => this._connectionMsg,
    SequelizeConnectionRefusedError: () =>
      this._connectionMsg + " MySql server has stopped running.", //mysql server stopped
    SequelizeAccessDeniedError: () =>
      this._connectionMsg +
      " Refused due to insufficient privileges" +
      " - Password to database should be checked.", // wrong password
  };
  /* to remove
  static async _initGeneralReport() {
    const DBInitial = require("./DBInitializtion");
    return DBInitial._initGeneralReport();
  }
*/

  /**
   * Initialize database - create and init models and tables
   * @param {string} dbName Name of the database
   * @param {string} password Password for database connecting
   * @returns {Promise(Sequelize | string)} Sequelize ORM object in seccess or string in failure
   */
  static async initDB(dbName, password) {
    const DBInitial = require("./DBInitializtion");
    return DBInitial.initDB(dbName, password);
  }

  /**
   * Create database and connect to it
   * @param {string} dbName The name of the database
   * @param {string} password The password to connect database
   * @returns {Promise(void | string)} string in failure
   */
  static async connectAndCreate(dbName, password) {
    const DBInitial = require("./DBInitializtion");
    return DBInitial.connectAndCreate(dbName, password);
  }

  static async close() {
    if (this._isTestMode) return;
    try {
      await this.sequelize.close();
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(errId, " - DBManager - close  - ", error);
      return this._errorHandler(error, errId);
    }
  }

  static async executeActions(actionsList) {
    if (this._isTestMode) return;
    let action;
    let model;
    let name;
    try {
      return this.sequelize
        .transaction(async (t) => {
          for (let i in actionsList) {
            action = actionsList[i];
            model = action.model ? this.models[action.model] : undefined;
            await action.name(action.params, t, model);
          }
        })
        .catch((error) => {
          let errId = uniqid();
          DBlogger.error(
            errId,
            " - DBManager - executeActions  - ",
            "add",
            ", ",
            model,
            ", ",
            action.params,
            " - ",
            error
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(
        errId,
        " - DBManager - executeActions  - transaction - ",
        error
      );
      return this._errorHandler(error, errId);
    }
  }

  static async add(params, t, model) {
    return model.create(params.element, { transaction: t });
  }

  static async getById(params, t, model) {
    return model.findOne({ where: params.where, transaction: t });
  }

  static async update(params, t, model) {
    return model.update(params.element, {
      where: params.where,
      transaction: t,
    });
  }
  static async findAll(params, t, model) {
    const attributes = params.attributes;
    const order = params.order;
    let attributesArray;
    if (attributes)
      attributesArray = [
        [
          this.sequelize.fn(
            attributes.fn,
            this.sequelize.col(attributes.fnField)
          ),
          attributes.fnField,
        ],
      ];
    let argument = {
      where: params.where,
      transaction: t,
    };
    if (attributes) argument.attributes = attributesArray;
    if (order) argument.order = order;
    return model.findAll(argument);
  }

  static async remove(params, t, model) {
    return model.destroy({ where: params.where, transaction: t });
  }

  static async findAll(params, t, model) {
    const attributes = params.attributes;
    let attributesArray = [
      [
        this.sequelize.fn(
          attributes.fn,
          this.sequelize.col(attributes.fnField)
        ),
        attributes.fnField,
      ],
    ];
    return model.findAll({
      attributes: attributesArray,
      where: params.where,
      transaction: t,
    });
  }

  static async setDestroyTimer(params, t) {
    let destroyQuery = DataBase.getDestroyQuery(
      params.table,
      params.afterCreate,
      params.deleteTime,
      params.eventTime,
      params.prop
    );
    return DataBase.sequelize.query(destroyQuery, { t }).catch((error) => {
      let errId = uniqid();
      DBlogger.error(
        errId,
        " - DBManager - setDestroyTimer - query - ",
        destroyQuery,
        " - ",
        error
      );
      return this._errorHandler(error, errId);
    });
  }

  static async singleAdd(modelName, element) {
    if (this._isTestMode) return;
    const model = this.models[modelName];
    try {
      return this.sequelize
        .transaction((t) => {
          return model.create(element, { transaction: t });
        })
        .catch((error) => {
          let errId = uniqid();
          DBlogger.error(
            errId,
            " - DBManager - singleAdd - ",
            modelName,
            ", ",
            element,
            " - ",
            error
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(errId, " - DBManager - singleAdd - transaction - ", error);
      return this._errorHandler(error, errId);
    }
  }

  static async singleGetById(modelName, where) {
    if (this._isTestMode) return;
    const model = this.models[modelName];
    try {
      return this.sequelize
        .transaction((t) => {
          let res = model.findOne({ where: where, transaction: t });
          return res;
        })
        .catch((error) => {
          let errId = uniqid();
          DBlogger.error(
            errId,
            " - DBManager - singleGetById - ",
            modelName,
            ", ",
            where,
            " - ",
            error
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(
        errId,
        " - DBManager - singleGetById - transaction - ",
        error
      );
      return this._errorHandler(error, errId);
    }
  }

  static async singleUpdate(modelName, where, element) {
    if (this._isTestMode) return;
    const model = this.models[modelName];
    try {
      return this.sequelize
        .transaction((t) => {
          return model.update(element, { where: where, transaction: t });
        })
        .catch((error) => {
          let errId = uniqid();
          DBlogger.error(
            errId,
            " - DBManager - singleUpdate - ",
            modelName,
            ", ",
            where,
            ", ",
            element,
            " - ",
            error
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(
        errId,
        " - DBManager - singleUpdate - transaction - ",
        error
      );
      return this._errorHandler(error, errId);
    }
  }

  static async singleRemove(modelName, where) {
    if (this._isTestMode) return;
    const model = this.models[modelName];
    try {
      return this.sequelize
        .transaction((t) => {
          return model.destroy({ where: where, transaction: t });
        })
        .catch((error) => {
          let errId = uniqid();
          DBlogger.error(
            errId,
            " - DBManager - singleRemove - ",
            modelName,
            ", ",
            where,
            " - ",
            error
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(
        errId,
        " - DBManager - singleRemove - transaction - ",
        error
      );
      return this._errorHandler(error, errId);
    }
  }

  static async singleFindAll(modelName, where, attributes, order) {
    if (this._isTestMode) return;
    let attributesArray;
    if (attributes)
      attributesArray = [
        [
          this.sequelize.fn(
            attributes.fn,
            this.sequelize.col(attributes.fnField)
          ),
          attributes.fnField,
        ],
      ];
    const model = this.models[modelName];
    try {
      return this.sequelize
        .transaction((t) => {
          let argument = {
            where: where,
            transaction: t,
          };
          if (attributes) argument.attributes = attributesArray;
          if (order) argument.order = order;

          return model.findAll(argument);
        })
        .catch((error) => {
          let errId = uniqid();
          DBlogger.error(
            errId,
            " - DBManager - singleFindAll - ",
            modelName,
            ", ",
            where,
            ", ",
            attributes,
            " - ",
            error
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(
        errId,
        " - DBManager - singleFindAll - transaction - ",
        error
      );
      return this._errorHandler(error, errId);
    }
  }

  static async singleSetDestroyTimer(
    table,
    afterCreate,
    deleteTime,
    eventTime,
    prop
  ) {
    if (this._isTestMode) return;
    let destroyQuery = DataBase.getDestroyQuery(
      table,
      afterCreate,
      deleteTime,
      eventTime,
      prop
    );
    try {
      return this.sequelize
        .transaction((t) => {
          return this.sequelize.query(destroyQuery, { t });
        })
        .catch((error) => {
          let errId = uniqid();
          DBlogger.error(
            errId,
            " - DBManager - singleSetDestroyTimer - ",
            table,
            ", ",
            afterCreate,
            ", ",
            deleteTime,
            ", ",
            eventTime,
            ", ",
            prop,
            " - ",
            error
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.error(
        errId,
        " - DBManager - singleSetDestroyTimer - transaction - ",
        error
      );
      return this._errorHandler(error, errId);
    }
  }

  static getDestroyQuery(table, afterCreate, deleteTime, eventTime, prop) {
    let where = "";
    if (afterCreate) {
      where = "createdAt <= (CURRENT_TIMESTAMP - INTERVAL " + deleteTime + ");";
    } else {
      where =
        prop +
        " IS NOT NULL AND " +
        prop +
        " <= (CURRENT_TIMESTAMP - INTERVAL " +
        deleteTime +
        ");";
    }
    return (
      "CREATE EVENT IF NOT EXISTS delete_event_" +
      table +
      " " +
      "ON SCHEDULE " +
      "EVERY " +
      eventTime +
      " " +
      "DO DELETE FROM " +
      table +
      " WHERE " +
      where
    );
  }
}

module.exports = DataBase;
