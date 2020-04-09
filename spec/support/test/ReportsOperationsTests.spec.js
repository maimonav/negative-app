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


    it('UnitTest createDailyReport, getReport - Service Layer', () => {
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
        validate(serviceLayer, serviceLayer.getReport, { 'Type ': 'type', 'Date ': 'date', 'Username ': 'User' });

        testServiceFunctions(() => serviceLayer.createDailyReport("type", records, "User"));
        testServiceFunctions(() => serviceLayer.getReport("type", 'date', "User"));


    });

    it('UnitTest createDailyReport, getReport - Cinema System', () => {
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
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.getReport("type", 'date', 1));

    });


    it('UnitTest createDailyReport - ReportController', async () => {
        let todayDate = new Date();
        await addEmployee(0);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();

        let report = [{ date: todayDate, productId: 0, creatorEmployeeId: 0, quantitySold: 4 }];
        await createReport('inventory_daily_report', report, testAddInventoryDailyReport, (report) => {
            report[0].quantityInStock = 8; report[0].stockThrown = 8;
        }, true);
        report = [{
            date: todayDate, creatorEmployeeId: 0, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0
        }];
        await createReport('incomes_daily_report', report, testAddIncomesDailyReport, (report) => {
            report[0].tabsCashRevenues = 20.0; report[0].tabsCreditCardRevenues = 20.0;
        }, true);
        report = [{ date: todayDate, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];
        await createReport('general_purpose_daily_report', report, testAddGeneralPurposeDailyReport, (report) => {
            report[0].creatorEmployeeId = 0;
        }, true);

    });

    it('UnitTest getReport - ReportController', async () => {
        let todayDate = new Date();


        let result = await ReportController.getReport('lol', 'test');
        expect(result).toBe('The requested report type is invalid');

        result = await ReportController.getReport('lol', 'test');
        expect(result).toBe('The requested report type is invalid');


        result = await ReportController.getReport('inventory_daily_report', 'test');
        expect(result).toBe('The requested report date is invalid');

        result = await ReportController.getReport('incomes_daily_report', 'test');
        expect(result).toBe('The requested report date is invalid');

        result = await ReportController.getReport('general_purpose_daily_report', 'test');
        expect(result).toBe('The requested report date is invalid');


        let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2))
        result = await ReportController.getReport('inventory_daily_report', date);
        expect(result).toBe('The requested report date is invalid');

        todayDate = new Date();
        date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2))
        result = await ReportController.getReport('incomes_daily_report', date);
        expect(result).toBe('The requested report date is invalid');

        todayDate = new Date();
        date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2))
        result = await ReportController.getReport('general_purpose_daily_report', date);
        expect(result).toBe('The requested report date is invalid');

        todayDate = new Date();
        await addEmployee(0);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();


        testFunctions = [testInventoryDailyReportResult, testIncomeDailyReportResult, testGeneralPurposeDailyReportResult];
        types = ['inventory_daily_report', 'incomes_daily_report', 'general_purpose_daily_report'];
        reports = [{ date: todayDate, productId: 0, creatorEmployeeId: 0, quantitySold: 4, quantityInStock: 8, stockThrown: 8 }, {
            date: todayDate, creatorEmployeeId: 0, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0, tabsCashRevenues: 20.0, tabsCreditCardRevenues: 20.0
        }, { date: todayDate, creatorEmployeeId: 0, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];

        for (let i in types) {
            await createReport(types[i], [reports[i]]);
            reports[i].date = new Date(getSyncDateFormat(todayDate));
            result = await ReportController.getReport(types[i], todayDate);
            testFunctions[i](result, reports[i]);
        }


    });





    it('UnitTest addField , removeField - ReportController', async () => {
        //addField
        let todayDate = new Date();
        await addEmployee(0);


        let reports = [{ date: todayDate, creatorEmployeeId: 0, additionalProps: [["oldField"], { "oldField": "true" }] }];


        await createReport('general_purpose_daily_report', reports);
        await ReportController.addFieldToDailyReport("Report Z taken");
        reports[0].date = new Date(getSyncDateFormat(todayDate));
        let actualResult = await ReportController.getReport('general_purpose_daily_report', todayDate);
        let expectedResult = {
            date: new Date(getSyncDateFormat(todayDate)),
            additionalProps: [["oldField", "Report Z taken"], { "oldField": "true" }], creatorEmployeeId: 0
        };


        expect(expectedResult.date).toEqual(actualResult.date);
        expect(expectedResult.additionalProps).toEqual(actualResult.additionalProps);
        expect(expectedResult.creatorEmployeeId).toEqual(actualResult.creatorEmployeeId);



        //remove

        await ReportController.removeFieldFromDailyReport("Report Z taken");
        actualResult = await ReportController.getReport('general_purpose_daily_report', todayDate);

        expect(reports[0].date).toEqual(actualResult.date);
        expect(reports[0].additionalProps).toEqual(actualResult.additionalProps);
        expect(reports[0].creatorEmployeeId).toEqual(actualResult.creatorEmployeeId);


    });

    it('Integration createDailyReport', async () => {
        let serviceLayer = new ServiceLayer('mydbtest');
        let records = JSON.stringify([]);
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.createDailyReport("type", records, "User"));
        await addEmployee(1);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);
        let result = await serviceLayer.createDailyReport("lol", records, "User");
        expect(result).toBe("The requested report type is invalid");


        todayDate = new Date();
        await addEmployee(0);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();

        types = ['inventory_daily_report', 'incomes_daily_report', 'general_purpose_daily_report'];
        reports = [{ date: todayDate, productId: 0, creatorEmployeeId: 0, quantitySold: 4, quantityInStock: 8, stockThrown: 8 }, {
            date: todayDate, creatorEmployeeId: 0, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0, tabsCashRevenues: 20.0, tabsCreditCardRevenues: 20.0
        }, { date: todayDate, creatorEmployeeId: 0, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];

        for (let i in types) {

            records = JSON.stringify([reports[i]]);
            result = await serviceLayer.createDailyReport(types[i], records, "User");
            expect(result).toBe("The report created successfully");

            result = await serviceLayer.createDailyReport(types[i], records, "User");
            expect(result).toBe("The report can not be created");

        }




    });

    it('Integration getReport', async () => {
        //add report
        let serviceLayer = new ServiceLayer('mydbtest');
        serviceLayer.users.set("User", 1);
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);


        let todayDate = new Date();
        await addEmployee(0);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();

        testFunctions = [testInventoryDailyReportResult, testIncomeDailyReportResult, testGeneralPurposeDailyReportResult];
        types = ['inventory_daily_report', 'incomes_daily_report', 'general_purpose_daily_report'];
        reports = [{ date: todayDate, productId: 0, creatorEmployeeId: 0, quantitySold: 4, quantityInStock: 8, stockThrown: 8 }, {
            date: todayDate, creatorEmployeeId: 0, numOfTabsSales: 0, cafeteriaCashRevenues: 20.0, cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0, ticketsCreditCardRevenues: 20.0, tabsCashRevenues: 20.0, tabsCreditCardRevenues: 20.0
        }, { date: todayDate, creatorEmployeeId: 0, additionalProps: [["Cash counted"], { "Cash counted": "true" }] }];

        for (let i in types) {

            records = JSON.stringify([reports[i]]);
            result = await serviceLayer.createDailyReport(types[i], records, "User");
            expect(result).toBe("The report created successfully");

        }



        //get report
        serviceLayer = new ServiceLayer('mydbtest');
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.getReport("test", "test", "User"));
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


    });


});



function testServiceFunctions(method) {
    result = method();
    expect(result).toBe("The user performing the operation does not exist in the system");
}

function getSyncDateFormat(date) { return date.toISOString().substring(0, 10); }

async function createReport(type, report, method, customizer, isTest) {
    if (isTest) {
        let result = await ReportController.createDailyReport('lol', report);
        expect(result).toBe('The requested report type is invalid');
        result = await ReportController.createDailyReport(type, report);
        expect(result).toBe('The report can not be created');
        await method(report[0], false);
    }
    if (customizer) {
        customizer(report);
    }
    result = await ReportController.createDailyReport(type, report);
    if (isTest) {
        expect(result).toBe('The report created successfully');
        await method(report[0], true);
    }
}

