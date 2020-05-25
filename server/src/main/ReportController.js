const DataBase = require("./DataLayer/DBManager");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const DBlogger = LogController.getInstance("db");
const moment = require("moment");
const Sequelize = require("sequelize");
const { csvToJson } = require("./EventBuzzScript");

class ReportController {
  static _types = {
    INCOMES: "incomes_daily_report",
    INVENTORY: "inventory_daily_report",
    GENERAL: "general_purpose_daily_report",
    MOVIES: "movies_daily_report",
  };
  static _allGeneralDailyReportFormat;
  static _currentGeneralDailyReportFormat;
  static _MovieReportJson = csvToJson();

  /**
   * add movies report records to db
   * @param {Array(Object)} report list of records to add to movies report
   * @returns {Promise(void|string)} void in success or string in failure
   */
  static async createMovieReport(report) {
    let recordsToAdd = [];
    for (let i in report) {
      let record = report[i];
      recordsToAdd = recordsToAdd.concat({
        name: DataBase._add,
        model: this._types.MOVIES,
        params: {
          element: {
            date: moment(record.date, "DD-MM-YYYY HH:mm").toDate(),
            name: record.name,
            location: record.location,
            numOfTicketsSales: record.numberOfTicketsSales,
            numOfTicketsAssigned: record.numberOfTicketsAssigned,
            totalSalesIncomes: record.totalSalesIncomes,
            totalTicketsReturns: record.totalTicketsReturns,
            totalFees: record.totalFees,
            totalRevenuesWithoutCash: record.totalRevenuesWithoutCash,
            totalCashIncomes: record.totalCashIncomes,
          },
        },
      });
    }
    let result = await DataBase.executeActions(recordsToAdd);
    if (typeof result === "string") {
      DBlogger.writeToLog(
        "info",
        "ReportController",
        "createMovieReport",
        result
      );
      return "The report cannot be added\n" + result;
    }
  }

  static async getAllGeneralDailyReportFormat(calledFunctionName) {
    if (!this._allGeneralDailyReportFormat)
      await this.updatePropsLists(calledFunctionName);
    return this._allGeneralDailyReportFormat;
  }

  static async getCurrentGeneralDailyReportFormat(calledFunctionName) {
    if (!this._currentGeneralDailyReportFormat)
      await this.updatePropsLists(calledFunctionName);
    return this._currentGeneralDailyReportFormat;
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
        "getCurrentGeneralDailyReportFormat - singleFindAll -" + result
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
          "getCurrentGeneralDailyReportFormat - singleGetById -" + result
        );
        return result;
      }

      this._currentGeneralDailyReportFormat = result.currentProps;
      this._allGeneralDailyReportFormat = result.allProps;
      return result;
    }
    return { currentProps: [], allProps: [] };
  }

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
            "createDailyReport",
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
   * @param {string} fromDate The starting date of the report to show
   * @param {string} toDate The last date of the report to show
   * @returns {Promise(Array(Object) | string)} In success returns list of records from the report,
   * otherwise returns error string.
   */
  static async getReport(type, fromDate, toDate) {
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
    //TO DO : to remove
    if (type === this._types.MOVIES)
      return [
        {
          dataValues: {
            date: new Date(),
            name: "",
            location: "",
            numOfTicketsSales: "",
            numOfTicketsAssigned: "",
            totalSalesIncomes: "",
            totalTicketsReturns: "",
            totalFees: "",
            totalRevenuesWithoutCash: "",
            totalCashIncomes: "",
          },
        },
      ];
    let requestedFromDateMidnight = new Date(
      this._getSyncDateFormat(new Date(fromDate))
    );
    let requestedToDateTomorrowMidnight = new Date(
      this._getSyncDateFormat(new Date(toDate.setDate(toDate.getDate() + 1)))
    );
    let where = {
      date: {
        [Sequelize.Op.gte]: requestedFromDateMidnight,
        [Sequelize.Op.lt]: requestedToDateTomorrowMidnight,
      },
    };

    let result = await DataBase.singleFindAll(type, where, undefined, [
      ["date", "ASC"],
    ]);
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

    if (this._currentGeneralDailyReportFormat.includes(newField)) {
      logger.writeToLog(
        "info",
        "ReportController",
        "addFieldToDailyReport",
        "The field " + newField + " already exists"
      );
      return "The field already exists";
    }
    let newCurrentProps = this._currentGeneralDailyReportFormat.concat(
      newField
    );
    let newAllProps = this._allGeneralDailyReportFormat.concat(newField);

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

    this._currentGeneralDailyReportFormat = newCurrentProps;
    this._allGeneralDailyReportFormat = newAllProps;

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

    if (!this._currentGeneralDailyReportFormat.includes(fieldToRemove)) {
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

    this._currentGeneralDailyReportFormat = newCurrentProps;

    return "The report field removed successfully";
  }
}
module.exports = ReportController;
