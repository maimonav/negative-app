const DataBase = require("./DBManager");


class ReportController {


    static init() {
        DataBase.setDestroyTimer('general_purpose_daily_report', true, '1 YEAR', '1 DAY');
        DataBase.setDestroyTimer('inventory_daily_report', true, '1 YEAR', '1 DAY');
        DataBase.setDestroyTimer('movie_daily_report', true, '1 YEAR', '1 DAY');
        DataBase.setDestroyTimer('incomes_daily_report', true, '1 YEAR', '1 DAY');
    }

    static async getReport(report, date) {
        return DataBase.getById(report,{date: date}).then((result) => {
            if(result == null)
                return "The report does not exist"
            return result;
        });
    }
    
    static exportMonthlyHoursReportPerEmployee(date,employeeToSearchID,employeeId) { }
    static exportDailyIncome(date) { }
    static exportDailyMovieReport(date) { }
    static exportDailyGeneralReport(date) { }
    static exportDailyReport(date) { }


    //general purpose fields - just from the list additionalProps[0] 
    static getDailyReoprtFormat() {}




    static async addFieldToDailyReport(newField){
        await DataBase.findAll('general_purpose_daily_report',{},{fn:'max',field:'date'}).then(async (result)=>{
            let date = result[0].date;
            let newProps = result[0].additionalProps[0].push(newField);
            await DataBase.update('general_purpose_daily_report',{date:date},newProps);
        });

    }

    static async removeFieldFromDailyReport(fieldToRemove){
        await DataBase.findAll('general_purpose_daily_report',{},{fn:'max',field:'date'}).then(async (result)=>{
            let date = result[0].date;
            let newProps = result[0].additionalProps[0].filter((value)=>(value === fieldToRemove));
            await DataBase.update('general_purpose_daily_report',{date:date},newProps);
        });

    }


}
module.exports = ReportController;