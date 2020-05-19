const DataBase = require("./DataLayer/DBManager");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const DBlogger = LogController.getInstance("db");

class ReportController {
  static _types = {
    INVENTORY: "inventory_daily_report",
    GENERAL: "general_purpose_daily_report",
    MOVIES: "movie_daily_report",
    INCOMES: "incomes_daily_report",
  };
  static _generalDailyReoprtFormat = [];

  static _getSyncDateFormat = (date) => date.toISOString().substring(0, 10);

  static _isValidDate(strDate) {
    let date = new Date(strDate);
    if (isNaN(date.valueOf())) return false;
    let requestedDatePlusOneYear = this._getSyncDateFormat(
      new Date(date.setFullYear(date.getFullYear() + 1))
    );
    return requestedDatePlusOneYear >= this._getSyncDateFormat(new Date());
  }

  static _isValidType(type) {
    return Object.keys(this._types).some((k) => this._types[k] === type);
  }

  /**
   * @param {string} type Type of report from _types
   * @param {Array(Object)} records Records to add in the report
   * @returns {Promise(string)} success or failure
   *
   * @example of one record, record => array of records
   *
   * "inventory_daily_report" =>  {
        date: todayDate,
        productId: 0,
        creatorEmployeeId: 1,
        quantitySold: 4,
        quantityInStock: 8,
        stockThrown: 8,
      }
   * "general_purpose_daily_report" => {
        date: todayDate,
        creatorEmployeeId: 1,
        additionalProps: [["Cash counted"], { "Cash counted": "true" }],
      }
   * "incomes_daily_report" => {
        date: todayDate,
        creatorEmployeeId: 1,
        numOfTabsSales: 0,
        cafeteriaCashRevenues: 20.0,
        cafeteriaCreditCardRevenues: 20.0,
        ticketsCashRevenues: 20.0,
        ticketsCreditCardRevenues: 20.0,
        tabsCashRevenues: 20.0,
        tabsCreditCardRevenues: 20.0,
      }
   */
  static async createDailyReport(type, records) {
    //validate type from enum of types
    if (!this._isValidType(type)) {
      logger.writeToLog(
        "info",
        "ReportController",
        "createDailyReport",
        "The requested report type " + type + " is invalid"
      );
      return "The requested report type is invalid";
    }
    let actionsList = [];
    for (let i in records) {
      if (!records[i].date || !this._isValidDate(records[i].date)) {
        logger.writeToLog(
          "info",
          "ReportController",
          "createDailyReport",
          "Report record date is invalid"
        );
        return "Report record date is invalid";
      }
      records[i].date = new Date(
        this._getSyncDateFormat(new Date(records[i].date))
      );
      actionsList = actionsList.concat({
        name: DataBase._add,
        model: type,
        params: { element: records[i] },
      });
    }
    let result = await DataBase.executeActions(actionsList);
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "createDailyReport",
        result
      );
      return "The report cannot be created\n" + result;
    }
    return "The report created successfully";
  }

  /**
   * @param {string} type Type of report from _types
   * @param {string} date Date of the report
   * @returns {Promise(Array(Object) | string)} In success returns list of records from the report,
   * otherwise returns error string.
   */
  static async getReport(type, date) {
    if (!this._isValidType(type)) {
      logger.writeToLog(
        "info",
        "ReportController",
        "getReport",
        "The requested report type " + type + " is invalid"
      );
      return "The requested report type is invalid";
    }

    if (!this._isValidDate(date)) {
      logger.writeToLog(
        "info",
        "ReportController",
        "getReport",
        "The requested report date " + date + " is invalid"
      );
      return "The requested report date is invalid";
    }
    let result = await DataBase.singleFindAll(
      type,
      {
        date: new Date(this._getSyncDateFormat(new Date(date))),
      },
      undefined,
      [["date", "ASC"]]
    );
    if (typeof result === "string") {
      DBlogger.writeToLog("info", "ReportController", "getReport", result);
      return "There was a problem getting the report\n" + result;
    }
    if (result.length === 0) return "The report does not exist";

    return result;
  }

  /**
   * Add new field to general purpose daily report
   * @param {string} newField The field to add
   * @returns {Promise(string)} success or failure
   */
  static async addFieldToDailyReport(newField) {
    let result = await DataBase.singleFindAll(
      this._types.GENERAL,
      {},
      { fn: "max", fnField: "date" }
    );
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "addFieldToDailyReport",
        result
      );
      return "The report field cannot be added\n" + result;
    }
    if (result.length === 0) return "The report field cannot be added";
    result = await DataBase.singleGetById(this._types.GENERAL, {
      date: new Date(result[0].date),
    });
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "addFieldToDailyReport",
        result
      );
      return "The report field cannot be added\n" + result;
    }
    let newProps = result.additionalProps[0].concat(newField);
    result = await DataBase.singleUpdate(
      this._types.GENERAL,
      { date: new Date(result.date) },
      { additionalProps: [newProps, result.additionalProps[1]] }
    );
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "addFieldToDailyReport",
        result
      );
      return "The report field cannot be added\n" + result;
    }
    this._generalDailyReoprtFormat = this._generalDailyReoprtFormat.concat(
      newField
    );
    return "The report field added successfully";
  }

  /**
   * Remove field from general purpose daily report
   * @param {string} fieldToRemove The field to remove
   * @returns {Promise(string)} success or failure
   */
  static async removeFieldFromDailyReport(fieldToRemove) {
    let result = await DataBase.singleFindAll(
      this._types.GENERAL,
      {},
      { fn: "max", fnField: "date" }
    );
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "removeFieldFromDailyReport",
        result
      );
      return "The report field cannot be removed\n" + result;
    }
    if (result.length === 0) return "The report field cannot be added";
    result = await DataBase.singleGetById(this._types.GENERAL, {
      date: new Date(result[0].date),
    });
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "removeFieldFromDailyReport",
        result
      );
      return "The report field cannot be removed\n" + result;
    }
    let newProps = result.additionalProps[0].filter(
      (value) => value !== fieldToRemove
    );
    result = await DataBase.singleUpdate(
      this._types.GENERAL,
      { date: new Date(result.date) },
      { additionalProps: [newProps, result.additionalProps[1]] }
    );
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "removeFieldFromDailyReport",
        result
      );
      return "The report field cannot be removed\n" + result;
    }
    return "The report field removed successfully";
  }
}
module.exports = ReportController;
