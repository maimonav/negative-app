const DB = require("../../../server/src/main/DBManager");
const { createConnection, connectAndCreate, dropAndClose } = require("./../DBtests/connectAndCreate");
const { testAddInventoryDailyReport, testAddIncomesDailyReport, testAddGeneralPurposeDailyReport,
    testInventoryDailyReportResult, testIncomeDailyReportResult, testGeneralPurposeDailyReportResult } = require("./../DBtests/ReportsTests.spec");
const { addCategory, addProductAfterCategory } = require("./../DBtests/ProductsTests.spec");
const { addEmployee } = require("./../DBtests/UserEmployeeTests.spec");
const ReportController = require("../../../server/src/main/ReportController");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const { validate, testCinemaFunctions } = require("./MovieOperationsTests.spec");
const { asyncValidate, asyncTestCinemaFunctions } = require("./MovieOrderOperationsTests.spec");



describe("Report Operations Unit Tests", () => {
    let sequelize;
    beforeEach(async function () {
        //create connection & mydb
        var con = createConnection();
        await connectAndCreate(con);
        sequelize = await DB.initDB('mydbTest');
    });

    afterEach(async function () {
        //create connection & drop mydb
        con = createConnection();
        await dropAndClose(con);
    });

    it("init", async function () {
        //Testing connection
        await sequelize.authenticate().catch(err => fail('Unable to connect to the database:', err));
    });


    it('UnitTest createDailyReport, getReport - Service Layer', async () => {
        let serviceLayer = new ServiceLayer();
        let records = JSON.stringify([{
            date: new Date('2020-03-02 14:35:00'),
            productId: 0,
            creatorEmployeeId: 0,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        }]);

        validate(serviceLayer, serviceLayer.createDailyReport, { 'Type ': 'type', 'Records ': records, 'Username ': 'User' });
        await asyncValidate(serviceLayer, serviceLayer.getReport, { 'Type ': 'type', 'Date ': 'date', 'Username ': 'User' });

        testServiceFunctions(() => serviceLayer.createDailyReport("type", records, "User"));
        let result = await serviceLayer.getReport("type", 'date', "User")
        expect(result).toBe("The user performing the operation does not exist in the system");


    });

    it('UnitTest createDailyReport, getReport - Cinema System', async (done) => {
        setTimeout(done, 2000);

        let cinemaSystem = new CinemaSystem();
        let records = [{
            date: new Date('2020-03-02 14:35:00'),
            productId: 0,
            creatorEmployeeId: 0,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        }];
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.createDailyReport('type', records, 1));
        cinemaSystem = new CinemaSystem();
        await asyncTestCinemaFunctions(cinemaSystem, () => cinemaSystem.getReport("type", 'date', 1));

    });


    it('UnitTest createDailyReport - ReportController', async (done) => {
        setTimeout(done, 5000);

        let todayDate = new Date();
        await addEmployee(0);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();

        let testFunctions = [testAddInventoryDailyReport, testAddIncomesDailyReport, testAddGeneralPurposeDailyReport];
        let types = ['inventory_daily_report', 'incomes_daily_report', 'general_purpose_daily_report'];
        let reports = [{ date: todayDate, productId: 0, creatorEmployeeId: 0, quantitySold: 4, quantityInStock: 8, stockThrown: 8 }, {
            date: todayDate, creatorEmployeeId: 0, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0, tabsCashRevenues: 20.0, tabsCreditCardRevenues: 20.0
        }, { date: todayDate, creatorEmployeeId: 0, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];

        for (let i in types) {

            records = [reports[i]];
            result = ReportController.createDailyReport(types[i], records);
            expect(result).toBe("The report created successfully");
            setTimeout(() => {
                testFunctions[i](reports[i], true);
            }, (i + 1) * 1000);

        }

        /*

        let report = [{ date: todayDate, productId: 0, creatorEmployeeId: 0, quantitySold: 4 }];
        createReport('inventory_daily_report', report, testAddInventoryDailyReport, (report) => {
            report[0].quantityInStock = 8; report[0].stockThrown = 8;
        }, true);
        report = [{
            date: todayDate, creatorEmployeeId: 0, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0
        }];
        createReport('incomes_daily_report', report, testAddIncomesDailyReport, (report) => {
            report[0].tabsCashRevenues = 20.0; report[0].tabsCreditCardRevenues = 20.0;
        }, true);
        report = [{ date: todayDate, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];
        createReport('general_purpose_daily_report', report, testAddGeneralPurposeDailyReport, (report) => {
            report[0].creatorEmployeeId = 0;
        }, true);*/



    }, 8000);

    it('UnitTest getReport - ReportController', async (done) => {
        setTimeout(done, 6000);


        let result = await ReportController.getReport('lol', 'test');
        expect(result).toBe('The requested report type is invalid');
        let todayDate;
        let types = ['inventory_daily_report', 'incomes_daily_report', 'general_purpose_daily_report'];

        for (let i in types) {
            let type = types[i];
            result = await ReportController.getReport(type, 'test');
            expect(result).toBe('The requested report date is invalid');


            todayDate = new Date();
            let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2))
            result = await ReportController.getReport(type, date);
            expect(result).toBe('The requested report date is invalid');
        }


        todayDate = new Date();
        await addEmployee(0);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();


        let testFunctions = [testInventoryDailyReportResult, testIncomeDailyReportResult, testGeneralPurposeDailyReportResult];
        let reports = [{ date: todayDate, productId: 0, creatorEmployeeId: 0, quantitySold: 4, quantityInStock: 8, stockThrown: 8 }, {
            date: todayDate, creatorEmployeeId: 0, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0, tabsCashRevenues: 20.0, tabsCreditCardRevenues: 20.0
        }, { date: todayDate, creatorEmployeeId: 0, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];

        for (let i in types) {
            ReportController.createDailyReport(types[i], [reports[i]]);
            reports[i].date = new Date(getSyncDateFormat(todayDate));
            setTimeout(async () => {
                result = await ReportController.getReport(types[i], todayDate);
                testFunctions[i](result, reports[i]);
            }, (i + 1) * 1000);
        }


    }, 7000);





    it('UnitTest addField , removeField - ReportController', async (done) => {
        setTimeout(done, 3000);

        //addField
        let todayDate = new Date();
        await addEmployee(0);


        let reports = [{ date: todayDate, creatorEmployeeId: 0, additionalProps: [["oldField"], { "oldField": "true" }] }];
        ReportController.createDailyReport('general_purpose_daily_report', reports);



        setTimeout(() => {
            let result = ReportController.addFieldToDailyReport("Report Z taken");
            expect(result).toEqual("The report field added successfully");

            reports[0].date = new Date(getSyncDateFormat(todayDate));
            setTimeout(async () => {
                let actualResult = await ReportController.getReport('general_purpose_daily_report', todayDate);
                let expectedResult = {
                    date: new Date(getSyncDateFormat(todayDate)),
                    additionalProps: [["oldField", "Report Z taken"], { "oldField": "true" }], creatorEmployeeId: 0
                };


                expect(expectedResult.date).toEqual(actualResult.date);
                expect(expectedResult.additionalProps).toEqual(actualResult.additionalProps);
                expect(expectedResult.creatorEmployeeId).toEqual(actualResult.creatorEmployeeId);

                //remove
                result = ReportController.removeFieldFromDailyReport("Report Z taken");
                expect(result).toEqual("The report field removed successfully");

                setTimeout(async () => {
                    actualResult = await ReportController.getReport('general_purpose_daily_report', todayDate);

                    expect(reports[0].date).toEqual(actualResult.date);
                    expect(reports[0].additionalProps).toEqual(actualResult.additionalProps);
                    expect(reports[0].creatorEmployeeId).toEqual(actualResult.creatorEmployeeId);
                }, 500);
            }, 500);



        }, 500);

    });

    it('Integration createDailyReport', async (done) => {


        setTimeout(done, 3000);
        let serviceLayer = new ServiceLayer('mydbtest');
        let records = JSON.stringify([]);
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.createDailyReport("type", records, "User"));
        await addEmployee(1);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);
        let result = serviceLayer.createDailyReport("lol", records, "User");
        expect(result).toBe("The requested report type is invalid");

        let todayDate = new Date();
        let types = ['inventory_daily_report', 'incomes_daily_report', 'general_purpose_daily_report'];
        let reports = [{ date: todayDate, productId: 0, creatorEmployeeId: 1, quantitySold: 4, quantityInStock: 8, stockThrown: 8 }, {
            date: todayDate, creatorEmployeeId: 1, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0, tabsCashRevenues: 20.0, tabsCreditCardRevenues: 20.0
        }, { date: todayDate, creatorEmployeeId: 1, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];

        for (let i in types) {

            records = JSON.stringify([reports[i]]);
            result = serviceLayer.createDailyReport(types[i], records, "User");
            expect(result).toBe("The report created successfully");

        }



    });

    it('Integration getReport', async (done) => {
        setTimeout(done, 4000);


        //add report
        let serviceLayer = new ServiceLayer('mydbtest');
        serviceLayer.users.set("User", 1);
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);


        await addEmployee(1);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();
        let todayDate = new Date();
        let types = ['inventory_daily_report', 'incomes_daily_report', 'general_purpose_daily_report'];
        let reports = [{ date: todayDate, productId: 0, creatorEmployeeId: 1, quantitySold: 4, quantityInStock: 8, stockThrown: 8 }, {
            date: todayDate, creatorEmployeeId: 1, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0, tabsCashRevenues: 20.0, tabsCreditCardRevenues: 20.0
        }, { date: todayDate, creatorEmployeeId: 1, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];
        let testFunctions = [testInventoryDailyReportResult, testIncomeDailyReportResult, testGeneralPurposeDailyReportResult];

        for (let i in types) {
            records = JSON.stringify([reports[i]]);
            result = serviceLayer.createDailyReport(types[i], records, "User");
        }



        //get report
        serviceLayer.cinemaSystem.users.delete(1);
        asyncTestCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.getReport("test", "test", "User"));
        setTimeout(async () => {
            user = { isLoggedin: () => true, permissionCheck: () => true };
            serviceLayer.cinemaSystem.users.set(1, user);
            result = await serviceLayer.getReport("test", "test", "User");
            expect(result).toBe("The requested report type is invalid");

            for (let i in types) {
                result = await serviceLayer.getReport(types[i], "test", "User");
                expect(result).toBe("The requested report date is invalid");
                result = await serviceLayer.getReport(types[i], todayDate, "User");
                reports[i].date = new Date(getSyncDateFormat(todayDate));
                testFunctions[i](result, reports[i]);
            }
        }, 2000);


    });



    it('Integration addField', async (done) => {
        setTimeout(done, 4000);


        //add report
        let serviceLayer = new ServiceLayer('mydbtest');
        serviceLayer.users.set("User", 1);
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);
        await addEmployee(1);
        let todayDate = new Date();
        let report = { date: todayDate, creatorEmployeeId: 1, additionalProps: [["Cash counted"], { "Cash counted": "true" }] };
        records = JSON.stringify([report]);
        serviceLayer.createDailyReport('general_purpose_daily_report', records, "User");

        //add field
        serviceLayer.cinemaSystem.users.delete(1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.addFieldToDailyReport("test", "User"));

        //get report

        setTimeout(async () => {
            user = { isLoggedin: () => true, permissionCheck: () => true };
            serviceLayer.cinemaSystem.users.set(1, user);
            result = serviceLayer.addFieldToDailyReport('new_field', "User");
            expect(result).toBe("The report field added successfully");
            setTimeout(async () => {
                result = await serviceLayer.getReport("general_purpose_daily_report", todayDate, "User");
                report.date = new Date(getSyncDateFormat(todayDate));
                report.additionalProps = [["Cash counted", "new_field"], { "Cash counted": "true" }];
                testGeneralPurposeDailyReportResult(result, report);
            }, 500);
        }, 2000);


    });

    
    it('Integration removeField', async (done) => {
        setTimeout(done, 4000);


        //add report
        let serviceLayer = new ServiceLayer('mydbtest');
        serviceLayer.users.set("User", 1);
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);
        await addEmployee(1);
        let todayDate = new Date();
        let report = { date: todayDate, creatorEmployeeId: 1, additionalProps: [["Cash counted", "new_field"], { "Cash counted": "true" }] };
        records = JSON.stringify([report]);
        serviceLayer.createDailyReport('general_purpose_daily_report', records, "User");

        //remove field
        serviceLayer.cinemaSystem.users.delete(1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.removeFieldFromDailyReport("test", "User"));

        //get report

        setTimeout(async () => {
            user = { isLoggedin: () => true, permissionCheck: () => true };
            serviceLayer.cinemaSystem.users.set(1, user);
            result = serviceLayer.removeFieldFromDailyReport('new_field', "User");
            expect(result).toBe("The report field removed successfully");
            setTimeout(async () => {
                result = await serviceLayer.getReport("general_purpose_daily_report", todayDate, "User");
                report.date = new Date(getSyncDateFormat(todayDate));
                report.additionalProps = [["Cash counted"], { "Cash counted": "true" }];
                testGeneralPurposeDailyReportResult(result, report);
            }, 500);
        }, 2000);


    });





});



function testServiceFunctions(method) {
    result = method();
    expect(result).toBe("The user performing the operation does not exist in the system");
}

function getSyncDateFormat(date) { return date.toISOString().substring(0, 10); }
/*
function createReport(type, report, method, customizer, isTest) {
    if (isTest) {
        let result = ReportController.createDailyReport('lol', report);
        expect(result).toBe('The requested report type is invalid');
    /*    result = ReportController.createDailyReport(type, report);
        setTimeOut(()=>{method(report[0], false)},500);
    }
    if (customizer) {
        customizer(report);
    }
    result = ReportController.createDailyReport(type, report);
    if (isTest) {
        expect(result).toBe('The report created successfully');
        setTimeOut(()=>{method(report[0], true);},500);
    }
}
*/
