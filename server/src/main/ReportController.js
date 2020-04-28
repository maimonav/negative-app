const DataBase = require("./DataLayer/DBManager");
const simpleLogger = require("simple-node-logger");
const logger = simpleLogger.createSimpleLogger("project.log");
const DBlogger = simpleLogger.createSimpleLogger({
  logFilePath: "database.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});

class ReportController {
  static types = {
    INVENTORY: "inventory_daily_report",
    GENERAL: "general_purpose_daily_report",
    MOVIES: "movie_daily_report",
    INCOMES: "incomes_daily_report",
  };

  static getSyncDateFormat = (date) => date.toISOString().substring(0, 10);

  static isValidDate(strDate) {
    let date = new Date(strDate);
    if (isNaN(date.valueOf())) return false;
    let requestedDatePlusOneYear = this.getSyncDateFormat(
      new Date(date.setFullYear(date.getFullYear() + 1))
    );
    return requestedDatePlusOneYear >= this.getSyncDateFormat(new Date());
  }

  static isValidType(type) {
    return Object.keys(this.types).some((k) => this.types[k] === type);
  }

  static async createDailyReport(type, records) {
    //validate type from enum of types
    if (!this.isValidType(type)) return "The requested report type is invalid";

    let actionsList = [];
    for (let i in records) {
      records[i].date = new Date(
        this.getSyncDateFormat(new Date(records[i].date))
      );
      actionsList = actionsList.concat({
        name: DataBase.add,
        model: type,
        params: { element: records[i] },
      });
    }
    let result = await DataBase.executeActions(actionsList);
    if (typeof result === "string") {
      DBlogger.info("ReportController - createDailyReport - ", result);
      return "The report cannot be created\n" + result;
    }
    return "The report created successfully";
  }

  static async getReport(type, date) {
    if (!this.isValidType(type)) return "The requested report type is invalid";

    if (!this.isValidDate(date)) return "The requested report date is invalid";
    let result = await DataBase.singleFindAll(
      type,
      {
        date: new Date(this.getSyncDateFormat(new Date(date))),
      },
      undefined,
      [["date", "ASC"]]
    );
    if (typeof result === "string") {
      DBlogger.info("ReportController - getReport - ", result);
      return "There was a problem getting the report\n" + result;
    }
    if (result === null) return "The report does not exist";
    return result;
  }

  static exportMonthlyHoursReportPerEmployee(
    date,
    employeeToSearchID,
    employeeId
  ) {}
  static exportDailyIncome(date) {}
  static exportDailyMovieReport(date) {}
  static exportDailyGeneralReport(date) {}
  static exportDailyReport(date) {}

  //general purpose fields - just from the list additionalProps[0]
  static getDailyReoprtFormat() {}

  static async addFieldToDailyReport(newField) {
    let result = await DataBase.singleFindAll(
      this.types.GENERAL,
      {},
      { fn: "max", fnField: "date" }
    );
    if (typeof result === "string") {
      DBlogger.info("ReportController - addFieldToDailyReport - ", result);
      return "The report field cannot be added\n" + result;
    }
    if (result.length === 0) return "The report field cannot be added";
    result = await DataBase.singleGetById(this.types.GENERAL, {
      date: new Date(result[0].date),
    });
    if (typeof result === "string") {
      DBlogger.info("ReportController - addFieldToDailyReport - ", result);
      return "The report field cannot be added\n" + result;
    }
    let newProps = result.additionalProps[0].concat(newField);
    result = await DataBase.singleUpdate(
      this.types.GENERAL,
      { date: new Date(result.date) },
      { additionalProps: [newProps, result.additionalProps[1]] }
    );
    if (typeof result === "string") {
      DBlogger.info("ReportController - addFieldToDailyReport - ", result);
      return "The report field cannot be added\n" + result;
    }
    return "The report field added successfully";
  }

  static async removeFieldFromDailyReport(fieldToRemove) {
    let result = await DataBase.singleFindAll(
      this.types.GENERAL,
      {},
      { fn: "max", fnField: "date" }
    );
    if (typeof result === "string") {
      DBlogger.info("ReportController - removeFieldFromDailyReport - ", result);
      return "The report field cannot be removed\n" + result;
    }
    if (result.length === 0) return "The report field cannot be added";
    result = await DataBase.singleGetById(this.types.GENERAL, {
      date: new Date(result[0].date),
    });
    if (typeof result === "string") {
      DBlogger.info("ReportController - removeFieldFromDailyReport - ", result);
      return "The report field cannot be removed\n" + result;
    }
    let newProps = result.additionalProps[0].filter(
      (value) => value !== fieldToRemove
    );
    result = await DataBase.singleUpdate(
      this.types.GENERAL,
      { date: new Date(result.date) },
      { additionalProps: [newProps, result.additionalProps[1]] }
    );
    if (typeof result === "string") {
      DBlogger.info("ReportController - removeFieldFromDailyReport - ", result);
      return "The report field cannot be removed\n" + result;
    }
    return "The report field removed successfully";
  }
}
module.exports = ReportController;
