const DataBase = require("./DataLayer/DBManager");
<<<<<<< HEAD
const simpleLogger = require("simple-node-logger");
const logger = simpleLogger.createSimpleLogger("project.log");
const DBlogger = simpleLogger.createSimpleLogger({
  logFilePath: "database.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
const { CsvToJson } = require("./EventBuzzScript");
=======
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const DBlogger = LogController.getInstance("db");
>>>>>>> master

class ReportController {
  static _types = {
    INCOMES: "incomes_daily_report",
    INVENTORY: "inventory_daily_report",
    GENERAL: "general_purpose_daily_report",
    //MOVIES: "movie_daily_report",
  };
<<<<<<< HEAD
  static _generalDailyReoprtFormat = [];
  static MovieReport = CsvToJson();
=======
  static _allGeneralDailyReoprtFormat;
  static _currentGeneralDailyReoprtFormat;

  static async getAllgeneralDailyReoprtFormat(calledFunctionName) {
    if (!this._allGeneralDailyReoprtFormat)
      await this.updatePropsLists(calledFunctionName);
    return this._allGeneralDailyReoprtFormat;
  }

  static async getCurrentGeneralDailyReoprtFormat(calledFunctionName) {
    if (!this._currentGeneralDailyReoprtFormat)
      await this.updatePropsLists(calledFunctionName);
    return this._currentGeneralDailyReoprtFormat;
  }

  static async updatePropsLists(calledFunctionName) {
    let result = await DataBase.singleFindAll(
      this._types.GENERAL,
      {},
      { fn: "max", fnField: "date" }
    );
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        calledFunctionName ? calledFunctionName : "",
        "getCurrentGeneralDailyReoprtFormat - singleFindAll -" + result
      );
      return (
        "Cannot get reports fields. Action cannot be completed, details:\n" +
        result
      );
    }
    if (result) {
      result = await DataBase.singleGetById(this._types.GENERAL, {
        date: new Date(result[0].date),
      });
      if (typeof result === "string") {
        DBlogger.writeToLog(
          "info",
          "ReportController",
          calledFunctionName ? calledFunctionName : "",
          "getCurrentGeneralDailyReoprtFormat - singleGetById -" + result
        );
        return result;
      }

      this._currentGeneralDailyReoprtFormat = result.currentProps;
      this._allGeneralDailyReoprtFormat = result.allProps;
      return result;
    }
    return { currentProps: [], allProps: [] };
  }
>>>>>>> master

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
   * @param {Array(Object)} reports Records to add in the report
   * @returns {Promise(string)} success or failure
   *
   * @example reports
   *
   * reports= [
        { 
        type:"incomes_daily_report",
        content: [
            {
              date: [Date],
              creatorEmployeeUsername: [Name],
              numOfTabsSales: [#],
              cafeteriaCashRevenues:  [#],
              cafeteriaCreditCardRevenues:  [#],
              ticketsCashRevenues:  [#],
              ticketsCreditCardRevenues:  [#],
              tabsCashRevenues:  [#],
              tabsCreditCardRevenues:  [#],
            }
          ]
        },
        {
        type: "inventory_daily_report",
        content: [
            {
              productName: [Name],
              quantitySold: [#],
              stockThrown: [#],
            },
            {
              productName: [Name],
              quantitySold: [#],
              stockThrown: [#],
            }
          ]
        },
        {
        type: "general_purpose_daily_report",
        content: [
            {
              prop1: [...] (i.e Cash Counted)
              prop2: [...] (i.e Report Z Taken)
            }
          ]
        }
        ]
   */
  static async createDailyReport(reports) {
    let actionsList = [];
    for (let j in reports) {
      let records = reports[j].content;
      let type = reports[j].type;
      for (let i in records) {
        if (!records[i].date || !this._isValidDate(records[i].date)) {
          logger.writeToLog(
            "info",
            "ReportController",
            "createDailyReport",
            "Report record date: " + records[i].date + ", is invalid"
          );
          return "Report record date is invalid";
        }
        records[i].date = new Date(
          this._getSyncDateFormat(new Date(records[i].date))
        );
        let isDailyReportCreated = await DataBase.singleGetById(type, {
          date: records[i].date,
        });
        if (typeof isDailyReportCreated === "string") {
          DBlogger.writeToLog(
            "info",
            "ReportController",
            "createDailyReport",
            isDailyReportCreated
          );
          return "The report cannot be created\n" + isDailyReportCreated;
        }
        if (isDailyReportCreated && isDailyReportCreated !== null) {
          logger.writeToLog(
            "info",
            "ReportController",
            "getReport",
            "daily report already exists in this date " + records[i].date
          );
          return "Cannot add this report - daily report already exists in this date";
        }
        actionsList = actionsList.concat({
          name: DataBase._add,
          model: type,
          params: { element: records[i] },
        });
      }
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
    if (result && result.length === 0) return "The report does not exist";

    return result;
  }

  /**
   * Add new field to general purpose daily report
   * @param {string} newField The field to add
   * @returns {Promise(string)} success or failure
   */
  static async addFieldToDailyReport(newField) {
    let result = await this.updatePropsLists("addFieldToDailyReport");
    if (typeof result === "string") {
      return "The report field cannot be added\n" + result;
    }

    if (this._currentGeneralDailyReoprtFormat.includes(newField)) {
      logger.writeToLog(
        "info",
        "ReportController",
        "addFieldToDailyReport",
        "The field " + newField + " already exists"
      );
      return "The field already exists";
    }
    let newCurrentProps = result.currentProps.concat(newField);
    let newAllProps = result.allProps.concat(newField);

    result = await DataBase.singleUpdate(
      this._types.GENERAL,
      { date: new Date(result.date) },
      { currentProps: newCurrentProps, allProps: newAllProps }
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

    this._currentGeneralDailyReoprtFormat = newCurrentProps;
    this._allGeneralDailyReoprtFormat = newAllProps;

    return "The report field added successfully";
  }

  /**
   * Remove field from general purpose daily report
   * @param {string} fieldToRemove The field to remove
   * @returns {Promise(string)} success or failure
   */
  static async removeFieldFromDailyReport(fieldToRemove) {
    let result = await this.updatePropsLists("removeFieldFromDailyReport");
    if (typeof result === "string") {
      return "The report field cannot be added\n" + result;
    }

    if (!this._currentGeneralDailyReoprtFormat.includes(fieldToRemove)) {
      logger.writeToLog(
        "info",
        "ReportController",
        "removeFieldFromDailyReport",
        "The field " + fieldToRemove + " does not exist"
      );
      return "The field does not exist";
    }

    let newCurrentProps = result.currentProps.filter(
      (value) => value !== fieldToRemove
    );

    result = await DataBase.singleUpdate(
      this._types.GENERAL,
      { date: new Date(result.date) },
      { currentProps: newCurrentProps }
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

    this._currentGeneralDailyReoprtFormat = newCurrentProps;

    return "The report field removed successfully";
  }
}
module.exports = ReportController;
