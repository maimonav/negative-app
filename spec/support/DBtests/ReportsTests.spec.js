const { createConnection, connectAndCreate, dropAndClose } = require("./connectAndCreate");
const { addEmployee } = require("./OrdersTests.spec");
const { addCategory, addMovieAfterCategory, addProductAfterCategory } = require("./ProductsTests.spec");
const DB = require("../../../server/src/main/DBManager");



async function addIncomesReport(report) {
    try {
        await DB.add('incomes_daily_report', report);
    } catch (e) { }
}
async function addMoviesReport(report) {
    try {
        await DB.add('movie_daily_report', report);
    } catch (e) { }
}
async function addGeneralPurposeReport(report) {
    try {
        await DB.add('general_purpose_daily_report', report);
    } catch (e) { }
}
async function addInventoryReport(report) {
    try {
        await DB.add('inventory_daily_report', report);
    } catch (e) { }
}

async function testAddIncomesDailyReport(report, success) {
    if (success)
        await DB.getById('incomes_daily_report', { date: report.date }).then((result) => {
            testIncomeDailyReportResult(result, report);
        });
    else
        try {
            await DB.getById('incomes_daily_report', { date: report.date }).then((result) => {
                if (result != null)
                    fail("testAddIncomesDailyReport failed");
            });
        } catch (e) { }

}
function testIncomeDailyReportResult(result, report) {
    expect(result.date).toEqual(report.date);
    expect(result.creatorEmployeeId).toBe(report.creatorEmployeeId);
    expect(result.numOfTabsSales).toBe(report.numOfTabsSales);
    expect(result.cafeteriaCashRevenues).toBe(report.cafeteriaCashRevenues);
    expect(result.cafeteriaCreditCardRevenues).toBe(report.cafeteriaCreditCardRevenues);
    expect(result.ticketsCashRevenues).toBe(report.ticketsCashRevenues);
    expect(result.ticketsCreditCardRevenues).toBe(report.ticketsCreditCardRevenues);
    expect(result.tabsCashRevenues).toBe(report.tabsCashRevenues);
    expect(result.tabsCreditCardRevenues).toBe(report.tabsCreditCardRevenues);
}

async function testAddMoviesDailyReport(report, success) {
    if (success)
        await DB.getById('movie_daily_report', { date: report.date }).then((result) => {
            testMoviesDailyReportResult(result, report);
        });
    else
        try {
            await DB.getById('movie_daily_report', { date: report.date }).then((result) => {
                if (result != null)
                    fail("testAddMoviesDailyReport failed");
            });
        } catch (e) { }
}
function testMoviesDailyReportResult(result, report) {
    expect(result.date).toEqual(report.date);
    expect(result.creatorEmployeeId).toBe(report.creatorEmployeeId);
    expect(result.movieId).toBe(report.movieId);
    expect(result.theater).toBe(report.theater);
    expect(result.numOfTicketsSales).toBe(report.numOfTicketsSales);
    expect(result.numOfUsedTickets).toBe(report.numOfUsedTickets);
    expect(result.wasAirConditionGlitches).toBe(report.wasAirConditionGlitches);
}

async function testAddGeneralPurposeDailyReport(report, success) {
    if (success)
        await DB.getById('general_purpose_daily_report', { date: report.date }).then((result) => {
            testGeneralPurposeDailyReportResult(result, report);
        });
    else
        try {
            await DB.getById('general_purpose_daily_report', { date: report.date }).then((result) => {
                if (result != null)
                    fail("testAddGeneralPurposeDailyReport failed");
            });
        } catch (e) { }
}
function testGeneralPurposeDailyReportResult(result, report) {
    expect(result.date).toEqual(report.date);
    expect(result.creatorEmployeeId).toBe(report.creatorEmployeeId);
    expect(result.additionalProps).toEqual(report.additionalProps);
}

async function testAddInventoryDailyReport(report, success) {
    if (success)
        await DB.getById('inventory_daily_report', { date: report.date }).then((result) => {
            testInventoryDailyReportResult(result, report);
        });
    else
        try {
            await DB.getById('inventory_daily_report', { date: report.date }).then((result) => {
                if (result != null)
                    fail("testAddInventoryDailyReport failed");
            });
        } catch (e) { }
}
exports.testAddInventoryDailyReport=testAddInventoryDailyReport;

function testInventoryDailyReportResult(result, report) {
    expect(result.date).toEqual(report.date);
    expect(result.creatorEmployeeId).toBe(report.creatorEmployeeId);
    expect(result.productId).toBe(report.productId);
    expect(result.quantitySold).toBe(report.quantitySold);
    expect(result.quantityInStock).toBe(report.quantityInStock);
    expect(result.stockThrown).toBe(report.stockThrown);
}
exports.testInventoryDailyReportResult=testInventoryDailyReportResult;

async function updateIncomesDailyReport(report) {
    await addIncomesReport(report);
    await DB.update('incomes_daily_report', { date: report.date }, report);
}
async function updateMoviesDailyReport(report) {
    await addMoviesReport(report);
    await DB.update('movie_daily_report', { date: report.date }, report);
}
async function updateGeneralPurposeDailyReport(report) {
    await addGeneralPurposeReport(report);
    await DB.update('general_purpose_daily_report', { date: report.date }, report);
}
async function updateInventoryDailyReport(report) {
    await addInventoryReport(report);
    await DB.update('inventory_daily_report', { date: report.date }, report);
}

async function testUpdateIncomesDailyReport(report) {
    await DB.getById('incomes_daily_report', { date: report.date }).then((result) => {
        testIncomeDailyReportResult(result, report);
    });

}
async function testUpdateMoviesDailyReport(report) {
    await DB.getById('movie_daily_report', { date: report.date }).then((result) => {
        testMoviesDailyReportResult(result, report);
    });
}
async function testUpdateGeneralPurposeDailyReport(report) {
    await DB.getById('general_purpose_daily_report', { date: report.date }).then((result) => {
        testGeneralPurposeDailyReportResult(result, report);
    });
}
async function testUpdateInventoryDailyReport(report) {
    await DB.getById('inventory_daily_report', { date: report.date }).then((result) => {
        testInventoryDailyReportResult(result, report);
    });
}


async function removeIncomesDailyReport(report, where) {
    await addIncomesReport(report);
    await DB.remove('incomes_daily_report', where);
}
async function removeMoviesDailyReport(report, where) {
    await addMoviesReport(report);
    await DB.remove('movie_daily_report', where);
}
async function removeGeneralPurposeDailyReport(report, where) {
    await addGeneralPurposeReport(report);
    await DB.remove('general_purpose_daily_report', where);
}
async function removeInventoryDailyReport(report, where) {
    await addInventoryReport(report);
    await DB.remove('inventory_daily_report', where);
}

async function testRemoveIncomesDailyReport(where) {
    await DB.getById('incomes_daily_report', where).then((result) => {
        if (result != null)
            fail("removeIncomesDailyReport failed");
    });
}
async function testRemoveMoviesDailyReport(where) {
    await DB.getById('movie_daily_report', where).then((result) => {
        if (result != null)
            fail("removeMoviesDailyReport failed");
    });
}
async function testRemoveGeneralPurposeDailyReport(where) {
    await DB.getById('general_purpose_daily_report', where).then((result) => {
        if (result != null)
            fail("removeGeneralPurposeDailyReport failed");
    });
}
async function testRemoveInventoryDailyReport(where) {
    await DB.getById('inventory_daily_report', where).then((result) => {
        if (result != null)
            fail("removeInventoryDailyReport failed");
    });
}

describe("DB Test - reports", function () {

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


    it("add incomes daily reports", async function () {
        await addIncomesDailyReport(true);
    });

    it("add movies daily reports", async function () {
        await addMoviesDailyReport(true);
    });

    it("add general purpose daily reports", async function () {
        await addGeneralPurposeDailyReport(true);
    });

    it("add inventory daily reports", async function () {
        await addInventoryDailyReport(true);
    });

    it("update incomes daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            creatorEmployeeId: 1,
            numOfTabsSales: 1,
            cafeteriaCashRevenues: 30.5,
            cafeteriaCreditCardRevenues: 30.5,
            ticketsCashRevenues: 30.5,
            ticketsCreditCardRevenues: 30.5,
            tabsCashRevenues: 30.5,
            tabsCreditCardRevenues: 30.5
        };
        await addEmployee(1, "MANAGER");
        await updateIncomesDailyReport(report);
        await testUpdateIncomesDailyReport(report);
    });

    it("update movies daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            creatorEmployeeId: 1,
            movieId: 0,
            theater: 5,
            numOfTicketsSales: 31,
            numOfUsedTickets: 26,
            wasAirConditionGlitches: true
        };
        await addCategory(0, "fantasy");
        await addMovieAfterCategory();
        await addEmployee(1, "MANAGER");
        await updateMoviesDailyReport(report);
        await testUpdateMoviesDailyReport(report);
    });

    it("update general purpose daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            creatorEmployeeId: 1,
            additionalProps: [["Cash counted"],{ "Cash counted": "true" }]
        };
        await addEmployee(1, "MANAGER");
        await updateGeneralPurposeDailyReport(report);
        await testUpdateGeneralPurposeDailyReport(report);
    });

    it("update inventory daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            productId: 0,
            creatorEmployeeId: 1,
            quantitySold: 4,
            quantityInStock: 8,
            stockThrown: 8
        };
        await addEmployee(1, "MANAGER");
        await addCategory(0, "Snacks");
        await addProductAfterCategory();
        await updateInventoryDailyReport(report);
        await testUpdateInventoryDailyReport(report);
    });

    it("remove incomes daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            creatorEmployeeId: 0,
            numOfTabsSales: 0,
            cafeteriaCashRevenues: 20.0,
            cafeteriaCreditCardRevenues: 20.0,
            ticketsCashRevenues: 20.0,
            ticketsCreditCardRevenues: 20.0,
            tabsCashRevenues: 20.0,
            tabsCreditCardRevenues: 20.0
        };
        let where = { date: new Date('2020-03-02 00:00:00') };
        await addEmployee(1, "MANAGER");
        await removeIncomesDailyReport(report, where);
        await testRemoveIncomesDailyReport(where);
    });

    it("remove movies daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            creatorEmployeeId: 0,
            movieId: 0,
            theater: 4,
            numOfTicketsSales: 30,
            numOfUsedTickets: 25,
            wasAirConditionGlitches: false
        };
        let where = { date: new Date('2020-03-02 00:00:00') };
        await addCategory(0, "fantasy");
        await addMovieAfterCategory();
        await addEmployee(1, "MANAGER");
        await removeMoviesDailyReport(report, where);
        await testRemoveMoviesDailyReport(where);
    });

    it("remove general purpose daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            creatorEmployeeId: 0,
            additionalProps: [["Cash counted"],{ "Cash counted": "true" }]
        };
        let where = { date: new Date('2020-03-02 00:00:00') };
        await addEmployee(1, "MANAGER");
        await removeGeneralPurposeDailyReport(report, where);
        await testRemoveGeneralPurposeDailyReport(where);
    });

    it("remove inventory daily reports", async function () {
        let report = {
            date: new Date('2020-03-02 00:00:00'),
            productId: 0,
            creatorEmployeeId: 0,
            quantitySold: 3,
            quantityInStock: 7,
            stockThrown: 7
        };
        let where = { date: new Date('2020-03-02 00:00:00') };
        await addEmployee(1, "MANAGER");
        await addCategory(0, "Snacks");
        await addProductAfterCategory();
        await removeInventoryDailyReport(report, where);
        await testRemoveInventoryDailyReport(where);
    });

});

async function addInventoryDailyReport(isTest) {
    let report = {
        date: new Date('2020-03-02 00:00:00'),
        productId: 0,
        creatorEmployeeId: 0,
        quantitySold: 3,
        quantityInStock: 7,
        stockThrown: 7
    };
    await addInventoryReport(report);
    if (isTest)
        await testAddInventoryDailyReport(report, false);
    await addEmployee(0, "MANAGER");
    await addInventoryReport(report);
    if (isTest)
        await testAddInventoryDailyReport(report, false);
    await addCategory(0, "Snacks");
    await addProductAfterCategory();
    await addInventoryReport(report);
    if (isTest)
        await testAddInventoryDailyReport(report, true);
}
exports.addInventoryDailyReport = addInventoryDailyReport;
async function addGeneralPurposeDailyReport(isTest) {
    let report = {
        date: new Date('2020-03-02 00:00:00'),
        creatorEmployeeId: 0,
        additionalProps: [["Cash counted"],{ "Cash counted": "true" }]
    };
    await addGeneralPurposeReport(report);
    if (isTest)
        await testAddGeneralPurposeDailyReport(report, false);
    await addEmployee(0, "MANAGER");
    await addGeneralPurposeReport(report);
    if (isTest)
        await testAddGeneralPurposeDailyReport(report, true);
}
exports.addGeneralPurposeDailyReport = addGeneralPurposeDailyReport;
async function addMoviesDailyReport(isTest) {
    let report = {
        date: new Date('2020-03-02 00:00:00'),
        creatorEmployeeId: 0,
        movieId: 0,
        theater: 4,
        numOfTicketsSales: 30,
        numOfUsedTickets: 25,
        wasAirConditionGlitches: false
    };
    await addMoviesReport(report);
    if (isTest)
        await testAddMoviesDailyReport(report, false);
    await addCategory(0, "fantasy");
    await addMovieAfterCategory();
    await addMoviesReport(report);
    if (isTest)
        await testAddMoviesDailyReport(report, false);
    await addEmployee(0, "MANAGER");
    await addMoviesReport(report);
    if (isTest)
        await testAddMoviesDailyReport(report, true);
}
exports.addMoviesDailyReport = addMoviesDailyReport;

async function addIncomesDailyReport(isTest) {
    let report = {
        date: new Date('2020-03-02 00:00:00'),
        creatorEmployeeId: 0,
        numOfTabsSales: 0,
        cafeteriaCashRevenues: 20.0,
        cafeteriaCreditCardRevenues: 20.0,
        ticketsCashRevenues: 20.0,
        ticketsCreditCardRevenues: 20.0,
        tabsCashRevenues: 20.0,
        tabsCreditCardRevenues: 20.0
    };
    await addIncomesReport(report);
    if (isTest)
        await testAddIncomesDailyReport(report, false);
    await addEmployee(0, "MANAGER");
    await addIncomesReport(report);
    if (isTest)
        await testAddIncomesDailyReport(report, true);
}
exports.addIncomesDailyReport = addIncomesDailyReport;