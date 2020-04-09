const DataBase = require("./DBManager");


class ReportController {

    static types = {
        INVENTORY: 'inventory_daily_report',
        GENERAL: 'general_purpose_daily_report',
        MOVIES: 'movie_daily_report',
        INCOMES: 'incomes_daily_report'
    }


    static async init() {
        await DataBase.setDestroyTimer(this.types.GENERAL, true, '1 YEAR', '1 DAY');
        await DataBase.setDestroyTimer(this.types.INVENTORY, true, '1 YEAR', '1 DAY');
        await DataBase.setDestroyTimer(this.types.MOVIES, true, '1 YEAR', '1 DAY');
        await DataBase.setDestroyTimer(this.types.INCOMES, true, '1 YEAR', '1 DAY');
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

    static async createDailyReport(type, records) {
        //validate type from enum of types
        if (!this.isValidType(type))
            return "The requested report type is invalid"
        for (let i in records) {
            records[i].date = new Date(this.getSyncDateFormat(new Date(records[i].date)));
            let result = await DataBase.add(type, records[i]);
            if (result == 'error') {
                return "The report can not be created"
            }
        }
        return "The report created successfully";

    }


    static async getReport(type, date) {
        if (!this.isValidType(type))
            return "The requested report type is invalid"

        if (!this.isValidDate(date))
            return "The requested report date is invalid"
        return DataBase.getById(type, { date: new Date(this.getSyncDateFormat(new Date(date))) }).then((result) => {
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


    //TODO:: return msg of success/failure

    static async addFieldToDailyReport(newField) {
        await DataBase.findAll(this.types.GENERAL, {}, { fn: 'max', fnField: 'date', fields: ['additionalProps'] })
            .then(async (result) => {
                //TODO:: return msg??
                /*
                if (result.length === 0) {
                    let date = new Date().toISOString().substring(0, 10);
                    await DataBase.add(this.types.GENERAL, { date: new Date(date), additionalProps: [[newField], {}], creatorEmployeeId: null });
                }
                else {
                    */
                let newProps = result[0].additionalProps[0].concat(newField);
                await DataBase.update(this.types.GENERAL, { date: result[0].date }, { additionalProps: [newProps, result[0].additionalProps[1]] });

                // }
            });


    }

    static async removeFieldFromDailyReport(fieldToRemove) {
        await DataBase.findAll(this.types.GENERAL, {}, { fn: 'max', fnField: 'date', fields: ['additionalProps'] })
            .then(async (result) => {
                if (result.length !== 0) {
                    let newProps = result[0].additionalProps[0].filter((value) => (value !== fieldToRemove));
                    await DataBase.update(this.types.GENERAL, { date: result[0].date }, { additionalProps: [newProps, result[0].additionalProps[1]] });
                }

            });

    }


}
module.exports = ReportController;
exports.DataBase = DataBase;