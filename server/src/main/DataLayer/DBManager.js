const LogControllerFile = require("../LogController");
const LogController = LogControllerFile.LogController;
const DBlogger = LogController.getInstance("db");
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
      DBlogger.writeToLog("error", "DBManager", "close", errId + " - " + error);
      return this._errorHandler(error, errId);
    }
  }

  /**
   * Execute few queries in database in one transaction
   * @param {Array(Object)} actionsList Each action is object with the name of the action
   * and the params needed
   * @returns {Promise(Object | string)} returns string in failure
   *
   *
   * @example
   *  let userObj = {
   *  table: "users",
   *  prop: "isUserRemoved",
   *  deleteTime: "2 YEAR",
   *  eventTime: "1 DAY",
   *  };
   *  let actionsList = [{ name: DataBase._setDestroyTimer, params: userObj }]
   *
   *
   */
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
          let errMsg =
            "add" + ", " + model + ", " + action.params + " - " + error;
          DBlogger.writeToLog(
            "error",
            "DBManager",
            "executeActions",
            errId + " - " + errMsg
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "executeActions - transaction - ",
        errId + " - " + error
      );
      return this._errorHandler(error, errId);
    }
  }

  static async _add(params, t, model) {
    return model.create(params.element, { transaction: t });
  }

  static async _getById(params, t, model) {
    return model.findOne({ where: params.where, transaction: t });
  }

  static async _update(params, t, model) {
    return model.update(params.element, {
      where: params.where,
      transaction: t,
    });
  }
  static async _findAll(params, t, model) {
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

  static async _remove(params, t, model) {
    return model.destroy({ where: params.where, transaction: t });
  }

  static async _findAll(params, t, model) {
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

  static async _setDestroyTimer(params, t) {
    let destroyQuery = DataBase._getDestroyQuery(
      params.table,
      params.afterCreate,
      params.deleteTime,
      params.eventTime,
      params.prop
    );
    return DataBase.sequelize.query(destroyQuery, { t }).catch((error) => {
      let errId = uniqid();
      let errMsg = destroyQuery + " - " + error;
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "setDestroyTimer - query -",
        errId + " - " + errMsg
      );
      return this._errorHandler(error, errId);
    });
  }
  /**
   * Add record to the database
   * @param {string} modelName The name of the model, for example 'user'
   * @param {Object} element The record object with all props
   * @returns {Promise(Object | string)} returns string in failure or sequalize object
   * in success
   */
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
          let errMsg = modelName + ", " + element + " - " + error;
          DBlogger.writeToLog(
            "error",
            "DBManager",
            "singleAdd",
            errId + " - " + errMsg
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "singleAdd - transaction",
        errId + " - " + error
      );
      return this._errorHandler(error, errId);
    }
  }
  /**
   * get single record from the database by specific conditions
   * @param {string} modelName The name of the model, for example 'user'
   * @param {Object} where The conditions to find the record
   * @returns {Promise(Object | string)} returns string in failure or sequalize object
   * in success (the record if found or null if not)
   */
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
          let errMsg = modelName + ", " + where + " - " + error;
          DBlogger.writeToLog(
            "error",
            "DBManager",
            "singleGetById",
            errId + " - " + errMsg
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "singleGetById- transaction ",
        errId + " - " + error
      );
      return this._errorHandler(error, errId);
    }
  }
  /**
   * Update record from the database by specific conditions
   * @param {string} modelName The name of the model, for example 'user'
   * @param {Object} where The conditions to find the record
   * @param {Object} element The props to update with their value
   * @returns {Promise(Object | string)} returns string in failure or sequalize object
   * in success
   */
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
          let errMsg = modelName + ", " + where + " - " + error;
          DBlogger.writeToLog(
            "error",
            "DBManager",
            "singleUpdate",
            errId + " - " + errMsg
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "singleUpdate - transaction",
        errId + " - " + error
      );
      return this._errorHandler(error, errId);
    }
  }

  /**
   * Remove record from the database by specific conditions
   * @param {string} modelName The name of the model, for example 'user'
   * @param {Object} where The conditions to find the record
   * @returns {Promise(Object | string)} returns string in failure or sequalize object
   * in success
   */
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
          let errMsg = modelName + ", " + where + " - " + error;
          DBlogger.writeToLog(
            "error",
            "DBManager",
            "singleRemove",
            errId + " - " + errMsg
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "singleRemove- transaction",
        errId + " - " + error
      );
      return this._errorHandler(error, errId);
    }
  }

  /**
   * Find records from the database by specific conditions
   * @param {string} modelName The name of the model, for example 'user'
   * @param {Object} where The conditions to find the records
   * @param {Array(Object)} attributes Object with 2 props - fn for sql function, fnfield for the column it
   *  execute on (example => {fn: 'max' , fnField:'date'})
   * @param {Array(Array(string))} order Array of arrays with 2 element, first for the name of the prop and the second
   * is the order (example => [['id','ASC']])
   * @returns {Promise(Array(Object) | string)} returns string in failure or array of records found
   * in success
   */
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
          let errMsg =
            modelName + ", " + where + ", " + attributes + " - " + error;
          DBlogger.writeToLog(
            "error",
            "DBManager",
            "singleFindAll",
            errId + " - " + errMsg
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "singleFindAll - transaction ",
        errId + " - " + error
      );
      return this._errorHandler(error, errId);
    }
  }
  /**
   * Set timer that will remove each record under specific conditions
   * @param {string} table The name of the table, for example 'users'
   * @param {boolean} afterCreate Flag to determine if it should destroyed after create or after being
   * removed from the system (meaning specific time after the value in isRemoved prop - if not null)
   * @param {string} deleteTime The requiered Time passed for being destroyed
   * @param {string} eventTime Query will be executed for each eventTime value
   * @returns {Promise(Object | string)} returns string in failure or sequalize object
   * in success
   */
  static async singleSetDestroyTimer(
    table,
    afterCreate,
    deleteTime,
    eventTime,
    prop
  ) {
    if (this._isTestMode) return;
    let destroyQuery = DataBase._getDestroyQuery(
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
          let errMsg =
            table +
            ", " +
            afterCreate +
            ", " +
            deleteTime +
            ", " +
            eventTime +
            ", " +
            prop +
            " - " +
            error;
          DBlogger.writeToLog(
            "error",
            "DBManager",
            "singleSetDestroyTimer",
            errId + " - " + errMsg
          );
          return this._errorHandler(error, errId);
        });
    } catch (error) {
      let errId = uniqid();
      DBlogger.writeToLog(
        "error",
        "DBManager",
        "singleSetDestroyTimer - transaction",
        errId + " - " + error
      );
      return this._errorHandler(error, errId);
    }
  }

  static _getDestroyQuery(table, afterCreate, deleteTime, eventTime, prop) {
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
