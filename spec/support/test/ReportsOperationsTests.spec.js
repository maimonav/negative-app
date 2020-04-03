const DB = require("../../../server/src/main/DBManager");
const { createConnection, connectAndCreate, dropAndClose } = require("./../DBtests/connectAndCreate");
const { testAddInventoryDailyReport , testInventoryDailyReportResult } = require("./../DBtests/ReportsTests.spec");
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
        
        validate(serviceLayer, serviceLayer.createDailyReport, { 'Type ': 'inventory_daily_report', 'Records ': records, 'Username ': 'User' });
        testServiceFunctions(()=>serviceLayer.createDailyReport("inventory_daily_report", records, "User"));
    
        validate(serviceLayer, serviceLayer.getReport, { 'Type ': 'inventory_daily_report', 'Date ': 'date', 'Username ': 'User' });
        testServiceFunctions(()=>serviceLayer.getReport("inventory_daily_report", 'date', "User"));
    
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
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.createDailyReport('inventory_daily_report', records, 1));
        cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.getReport("inventory_daily_report", 'date', 1));

    });


    it('UnitTest createDailyReport - ReportController', async () => {
        let todayDate = new Date();
        await createInventoryReport(todayDate,true);

    });

    it('UnitTest getReport - ReportController', async () => {
        let todayDate = new Date();
        await createInventoryReport(todayDate,false);
        let result = await ReportController.getReport('lol', 'test');
        expect(result).toBe('The requested report type is invalid');
        result = await ReportController.getReport('inventory_daily_report', 'test');
        expect(result).toBe('The requested report date is invalid');
        let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2))
        result = await ReportController.getReport('inventory_daily_report', date);
        expect(result).toBe('The requested report date is invalid');
        todayDate.setFullYear(todayDate.getFullYear() + 2);
        result = await ReportController.getReport('inventory_daily_report', todayDate);
        await testInventoryDailyReportResult(result, {
            date: new Date(getSyncDateFormat(todayDate)),
            productId: 0,
            creatorEmployeeId: 0,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        });   
     });



    /*
    
        it('UnitTest addField , removeField - ReportController', async () => {
            //addField
            await addEmployee(0);
            let date = new Date().toISOString().substring(0, 10);
    
            await DB.add('general_purpose_daily_report', { date: new Date(date), additionalProps: [["oldField"], {}], creatorEmployeeId: 0 });
            let expectedResult = { date: new Date(date), additionalProps: [["oldField", "Report Z taken"], {}], creatorEmployeeId: 0 };
            ReportController.addFieldToDailyReport("Report Z taken");
    
    
            let actualResult = await DB.getById('general_purpose_daily_report', { date: new Date(date) });
            expect(expectedResult.date).toEqual(actualResult.date);
            expect(expectedResult.additionalProps).toEqual(actualResult.additionalProps);
            expect(expectedResult.creatorEmployeeId).toEqual(actualResult.creatorEmployeeId);
    
    
    
            
                    //remove
                    expect(expectedMovie.removeMovie()).toBe("The movie removed successfully");
                    expect(expectedMovie.isMovieRemoved != null).toBe(true);
                    expect(expectedMovie.removeMovie()).toBe("The movie already removed");
    
        });
    */
    it('Integration createDailyReport', async () => {
        let serviceLayer = new ServiceLayer('mydbtest');
        let records = JSON.stringify([{
            date: new Date('2020-03-02 14:35:00'),
            productId: 0,
            creatorEmployeeId: 1,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        }]);
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.createDailyReport("inventory_daily_report", records, "User"));
        await addEmployee(1);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);
        let result = await serviceLayer.createDailyReport("lol", records, "User");
        expect(result).toBe("The requested report type is invalid");
        result = await serviceLayer.createDailyReport("inventory_daily_report", records, "User");
        expect(result).toBe("The report created successfully");
        result = await serviceLayer.createDailyReport("inventory_daily_report", records, "User");
        expect(result).toBe("The report can not be created");

    });

    it('Integration getReport', async () => {
        //add report
        let serviceLayer = new ServiceLayer('mydbtest');
        let todayDate = new Date();
        let records = JSON.stringify([{
            date: todayDate,
            productId: 0,
            creatorEmployeeId: 1,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        }]);
        serviceLayer.users.set("User", 1);
        await addEmployee(1);
        await addCategory(0, "Snacks");
        await addProductAfterCategory();
        let user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);
        result = await serviceLayer.createDailyReport("inventory_daily_report", records, "User");


        //get report
        serviceLayer = new ServiceLayer('mydbtest');
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.getReport("test", "test", "User"));
        user = { isLoggedin: () => true, permissionCheck: () => true };
        serviceLayer.cinemaSystem.users.set(1, user);
        result = await serviceLayer.getReport("test", "test", "User");
        expect(result).toBe("The requested report type is invalid");
        result = await serviceLayer.getReport("inventory_daily_report", "test", "User");
        expect(result).toBe("The requested report date is invalid");
        result = await serviceLayer.getReport("inventory_daily_report", todayDate, "User");
        await testInventoryDailyReportResult(result, {
            date: new Date(getSyncDateFormat(todayDate)),
            productId: 0,
            creatorEmployeeId: 1,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        });  
    });


});



function testServiceFunctions(method) {
    result = method();
    expect(result).toBe("The user performing the operation does not exist in the system");
}

function getSyncDateFormat(date){ return date.toISOString().substring(0, 10);}

async function createInventoryReport(todayDate,isTest) {
    let report = [{
        date: todayDate,
        productId: 0,
        creatorEmployeeId: 0,
        quantitySold: 4
    }];
    await addEmployee(0);
    await addCategory(0, "Snacks");
    await addProductAfterCategory();
    if (isTest) {
        let result = await ReportController.createDailyReport('lol', report);
        expect(result).toBe('The requested report type is invalid');
        result = await ReportController.createDailyReport('inventory_daily_report', report);
        expect(result).toBe('The report can not be created');
        await testAddInventoryDailyReport(report[0], false);
    }
    report[0].quantityInStock = 8;
    report[0].stockThrown = 8;
    result = await ReportController.createDailyReport('inventory_daily_report', report);
    if (isTest)
        expect(result).toBe('The report created successfully');
    await testAddInventoryDailyReport(report[0], true);
}

