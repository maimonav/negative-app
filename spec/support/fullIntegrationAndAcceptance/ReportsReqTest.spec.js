const DB = require("../../../server/src/main/DataLayer/DBManager");
const { testMovie } = require("../DBtests/ProductsTests.spec");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const {
  getSyncDateFormat,
  testAddInventoryDailyReport,
  testAddIncomesDailyReport,
  testAddGeneralPurposeDailyReport,
  testInventoryDailyReportResult,
  testIncomeDailyReportResult,
  testGeneralPurposeDailyReportResult,
} = require("./../DBtests/ReportsTests.spec");

describe("Report Operations Tests", function() {
  let service = new ServiceLayer();
  let dbName = "reporttest";
  let todayDate = new Date();
  let types = [
    "inventory_daily_report",
    "incomes_daily_report",
    "general_purpose_daily_report",
  ];

  let reports = [
    {
      date: todayDate,
      productId: 0,
      creatorEmployeeId: 1,
      quantitySold: 4,
      quantityInStock: 8,
      stockThrown: 8,
    },
    {
      date: todayDate,
      creatorEmployeeId: 1,
      numOfTabsSales: 0,
      cafeteriaCashRevenues: 20.0,
      cafeteriaCreditCardRevenues: 20.0,
      ticketsCashRevenues: 20.0,
      ticketsCreditCardRevenues: 20.0,
      tabsCashRevenues: 20.0,
      tabsCreditCardRevenues: 20.0,
    },
    {
      date: todayDate,
      creatorEmployeeId: 1,
      additionalProps: [["Cash counted"], { "Cash counted": "true" }],
    },
  ];

  beforeEach(async function() {
    await service.initSeviceLayer(dbName);
  });

  afterEach(async function() {
    //create connection & drop db
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("createDailyReport req 1.1.12, 2.4, 2.6", async function(done) {
    setTimeout(done, 5000);

    let user = "admin";
    let records = JSON.stringify([]);
    service.login(user, user);

    let result = await service.createDailyReport("type", records, user);
    expect(result).toBe(
      "Cannot create report - creator employee id is not exist"
    );

    await service.addNewEmployee(
      "username",
      "password",
      "first",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");
    await service.addCategory("categoryTest", user);
    await service.addNewProduct(
      "productTest",
      10,
      5,
      0,
      10,
      "categoryTest",
      user
    );

    let testFunctions = [
      testAddInventoryDailyReport,
      testAddIncomesDailyReport,
      testAddGeneralPurposeDailyReport,
    ];

    for (let i in types) {
      records = JSON.stringify([reports[i]]);
      result = await service.createDailyReport(types[i], records, "username");
      expect(result).toBe("The report created successfully");
      setTimeout(async () => {
        reports[i].date = getSyncDateFormat(reports[i].date);
        await testFunctions[i](reports[i], true);
      }, (i + 1) * 1000);
    }
  }, 6000);

  it("getReport req 1.1.13, 2.5, 2.7", async function(done) {
    setTimeout(done, 5000);

    let user = "admin";
    let records = JSON.stringify([]);
    service.login(user, user);

    //Create reports
    await service.addNewEmployee(
      "username",
      "password",
      "first",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");
    await service.addCategory("categoryTest", user);
    await service.addNewProduct(
      "productTest",
      10,
      5,
      0,
      10,
      "categoryTest",
      user
    );

    for (let i in types) {
      records = JSON.stringify([reports[i]]);
      await service.createDailyReport(types[i], records, "username");
    }

    //Get reports

    let testFunctions = [
      testInventoryDailyReportResult,
      testIncomeDailyReportResult,
      testGeneralPurposeDailyReportResult,
    ];

    let reportsAfter = reports;
    reportsAfter[0].productName = "productTest";
    for (let i in reportsAfter) {
      reportsAfter[i].date = reportsAfter[i].date.toDateString();
      reportsAfter[i].creatorEmployeeName = "first last";
    }

    for (let i in types) {
      result = await service.getReport(types[i], todayDate, "username");
      testFunctions[i](result[0], reportsAfter[i]);
    }
  }, 6000);

  it("addFieldToDailyReport req 2.8", async function() {
    let user = "admin";
    let records = JSON.stringify([]);
    service.login(user, user);

    //Create reports
    await service.addNewEmployee(
      "username",
      "password",
      "first",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");
    records = JSON.stringify([reports[2]]);
    await service.createDailyReport(types[2], records, "username");

    result = await service.addFieldToDailyReport("new_field", "username");
    expect(result).toBe("The report field added successfully");
    let reportAfter = reports[2];
    reportAfter.date = getSyncDateFormat(reportAfter.date);
    reportAfter.additionalProps[0] = reportAfter.additionalProps[0].concat(
      "new_field"
    );
    await testAddGeneralPurposeDailyReport(reportAfter, true);
  });

  it("removeFieldFromDailyReport req 2.9", async function() {
    let user = "admin";
    let records = JSON.stringify([]);
    service.login(user, user);

    //Create reports
    await service.addNewEmployee(
      "username",
      "password",
      "first",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");
    records = JSON.stringify([reports[2]]);
    await service.createDailyReport(types[2], records, "username");

    result = await service.removeFieldFromDailyReport(
      "Cash counted",
      "username"
    );
    expect(result).toBe("The report field removed successfully");
    let reportAfter = reports[2];
    reportAfter.date = getSyncDateFormat(reportAfter.date);
    reportAfter.additionalProps[0] = [];
    await testAddGeneralPurposeDailyReport(reportAfter, true);
  });
});
