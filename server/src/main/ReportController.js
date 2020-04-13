const DataBase = require("./DataLayer/DBManager");


class ReportController {

    static types = {
        INVENTORY: 'inventory_daily_report',
        GENERAL: 'general_purpose_daily_report',
        MOVIES: 'movie_daily_report',
        INCOMES: 'incomes_daily_report'
    }


    static getSyncDateFormat = (date) => date.toISOString().substring(0, 10);

    static isValidDate(strDate) {
        let date = new Date(strDate);
        if (isNaN(date.valueOf()))
            return false;
        let requestedDatePlusOneYear = this.getSyncDateFormat(new Date(date.setFullYear(date.getFullYear() + 1)));
        return requestedDatePlusOneYear >= this.getSyncDateFormat(new Date());
    }

    static isValidType(type) {
        return Object.keys(this.types).some((k) => (this.types[k] === type));
    }

    static createDailyReport(type, records) {
        //validate type from enum of types
        if (!this.isValidType(type))
            return "The requested report type is invalid"
        for (let i in records) {
            records[i].date = new Date(this.getSyncDateFormat(new Date(records[i].date)));
            /*let result = */DataBase.singleAdd(type, records[i]).catch((res)=>{
                console.log();
            });
            /*if (result == 'error') {
                return "The report can not be created"
            }*/
        }
        return "The report created successfully";

    }


    static async getReport(type, date) {
        if (!this.isValidType(type))
            return "The requested report type is invalid"

        if (!this.isValidDate(date))
            return "The requested report date is invalid"
        return DataBase.singleGetById(type, { date: new Date(this.getSyncDateFormat(new Date(date))) }).then((result) => {
            if (result == null)
                return "The report does not exist"
            return result;
        });
    }

    static exportMonthlyHoursReportPerEmployee(date, employeeToSearchID, employeeId) { }
    static exportDailyIncome(date) { }
    static exportDailyMovieReport(date) { }
    static exportDailyGeneralReport(date) { }
    static exportDailyReport(date) { }


    //general purpose fields - just from the list additionalProps[0] 
    static getDailyReoprtFormat() { }


    //TODO:: result.length === 0 ??
    static addFieldToDailyReport(newField) {
        DataBase.singleFindAll(this.types.GENERAL, {}, { fn: 'max', fnField: 'date', fields: ['additionalProps'] })
            .then(async (result) => {
                if (result.length !== 0) {
                    let newProps = result[0].additionalProps[0].concat(newField);
                    await DataBase.singleUpdate(this.types.GENERAL, { date: result[0].date }, { additionalProps: [newProps, result[0].additionalProps[1]] });
                }
            });

        return "The report field added successfully";
    }
    //TODO:: result.length === 0 ??
    static removeFieldFromDailyReport(fieldToRemove) {
        DataBase.singleFindAll(this.types.GENERAL, {}, { fn: 'max', fnField: 'date', fields: ['additionalProps'] })
            .then(async (result) => {
                if (result.length !== 0) {
                    let newProps = result[0].additionalProps[0].filter((value) => (value !== fieldToRemove));
                    await DataBase.singleUpdate(this.types.GENERAL, { date: result[0].date }, { additionalProps: [newProps, result[0].additionalProps[1]] });
                }
            });
        return "The report field removed successfully";

    }


}
module.exports = ReportController;
