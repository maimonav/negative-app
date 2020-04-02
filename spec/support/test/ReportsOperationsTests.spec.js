const DB = require("../../../server/src/main/DBManager");
const { createConnection, connectAndCreate, dropAndClose } = require("./../DBtests/connectAndCreate");
const { addEmployee } = require("./../DBtests/UserEmployeeTests.spec");
const ReportController = require("../../../server/src/main/ReportController");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");




function validate(serviceLayer, method, params) {
    Object.keys(params).forEach((key) => {
        let withEmptyParam = Object.keys(params).map((k) => (k === key ? '' : params[k]));
        let withUndefinedParam = Object.keys(params).map((k) => (k === key ? undefined : params[k]));
        let expected = key + 'is not valid';
        expect(method.apply(serviceLayer, withEmptyParam)).toBe(expected)
        expect(method.apply(serviceLayer, withUndefinedParam)).toBe(expected)

    })
}
exports.validate = validate;

describe("Report Operations Tests", () => {
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


    /* it('UnitTest .. - Service Layer', () => {
 
     });
     it('UnitTest .., .. - Inventory Management', () => {
 
     });*/

    it('UnitTest createDailyReport - ReportController', () => {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            productId: 0,
            creatorEmployeeId: 1,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        };
        let result = ReportController.createDailyReport('inventory_daily_report',report)

    });





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



        /*
                //remove
                expect(expectedMovie.removeMovie()).toBe("The movie removed successfully");
                expect(expectedMovie.isMovieRemoved != null).toBe(true);
                expect(expectedMovie.removeMovie()).toBe("The movie already removed");*/

    });


    /*it('Integration ...', () => {


    });

    it('Integration ..', () => {

    });


    it('Integration .', () => {

    });*/






});



function testServiceFunctions(serviceLayer, method) {
    let result = method();
    expect(result).toBe("The movie does not exist");
    serviceLayer.movies.set("Movie", 1);
    result = method();
    expect(result).toBe("The user performing the operation does not exist in the system");
}

function testCinemaFunctions(cinemaSystem, method) {
    let result = method();
    expect(result).toBe("The operation cannot be completed - the user is not connected to the system");
    let user = { isLoggedin: () => false };
    cinemaSystem.users.set(1, user);
    result = method();
    expect(result).toBe("The operation cannot be completed - the user is not connected to the system");
    user = { isLoggedin: () => true, permissionCheck: () => false };
    cinemaSystem.users.set(1, user);
    result = method();
    expect(result).toBe("User does not have proper permissions");
}
exports.testCinemaFunctions = testCinemaFunctions;
