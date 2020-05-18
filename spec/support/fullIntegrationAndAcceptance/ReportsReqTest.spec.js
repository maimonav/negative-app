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

//TODO:: test general
describe("Report Operations Tests", function() {
  let service = new ServiceLayer();
  let dbName = "reporttest";
  let todayDate = new Date();
  let types = [
    "incomes_daily_report",
    "inventory_daily_report",
    "general_purpose_daily_report",
  ];
  let records = [
    {
      date: getSyncDateFormat(todayDate),
      numOfTabsSales: 2,
      cafeteriaCashRevenues: 2.2,
      cafeteriaCreditCardRevenues: 5.5,
      ticketsCashRevenues: 4,
      ticketsCreditCardRevenues: 3,
      tabsCashRevenues: 0,
      tabsCreditCardRevenues: 0,
      creatorEmployeeId: 1,
    },
    {
      date: getSyncDateFormat(todayDate),
      productId: 0,
      quantitySold: 2,
      stockThrown: 4,
      quantityInStock: 4,
      creatorEmployeeId: 1,
    },
    {
      date: getSyncDateFormat(todayDate),
      creatorEmployeeId: 1,
      allProps: ["Cash Counted", "Report Z Taken"],
      currentProps: ["Cash Counted", "Report Z Taken"],
      propsObject: { "Cash Counted": "true", "Report Z Taken": "true" },
    },
  ];

  let reports = [
    {
      type: "incomes_daily_report",
      content: [
        {
          numOfTabsSales: "2",
          cafeteriaCashRevenues: "2.2",
          cafeteriaCreditCardRevenues: "5.5",
          ticketsCashRevenues: "4",
          ticketsCreditCardRevenues: "3",
          tabsCashRevenues: "0",
          tabsCreditCardRevenues: "0",
        },
      ],
    },
    {
      type: "inventory_daily_report",
      content: [
        {
          productName: "product",
          quantitySold: "2",
          stockThrown: "4",
        },
      ],
    },
    {
      type: "general_purpose_daily_report",
      content: [
        {
          "Cash Counted": "true",
          "Report Z Taken": "true",
        },
      ],
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

  it("addFieldToDailyReport req 2.8", async function() {
    let user = "admin";
    service.login(user, user);

    let result = await service.addFieldToDailyReport("new_field", user);
    expect(result).toBe("The report field added successfully");
    let reportAfter = {
      date: getSyncDateFormat(
        new Date(todayDate.setDate(todayDate.getDate() - 1))
      ),
      creatorEmployeeId: null,
      allProps: ["new_field"],
      currentProps: ["new_field"],
      propsObject: {},
    };
    await testAddGeneralPurposeDailyReport(reportAfter, true);
  });

  it("removeFieldFromDailyReport req 2.9", async function() {
    let user = "admin";
    service.login(user, user);

    await service.addFieldToDailyReport("new_field", user);

    let result = await service.removeFieldFromDailyReport("new_field", user);
    expect(result).toBe("The report field removed successfully");
    let reportAfter = {
      date: getSyncDateFormat(
        new Date(todayDate.setDate(todayDate.getDate() - 1))
      ),
      creatorEmployeeId: null,
      allProps: ["new_field"],
      currentProps: [],
      propsObject: {},
    };
    await testAddGeneralPurposeDailyReport(reportAfter, true);
  });

  it("createDailyReport req 1.1.13, 2.4, 2.6, 3.1", async function(done) {
    setTimeout(done, 5000);

    let user = "admin";
    service.login(user, user);

    await service.addFieldToDailyReport("Cash Counted", user);
    await service.addFieldToDailyReport("Report Z Taken", user);

    let result = await service.createDailyReport(
      todayDate.toISOString(),
      JSON.stringify(reports),
      user
    );
    expect(result).toBe("The product does not exist.");
    await service.addCategory("category", "admin");
    await service.addNewProduct(
      "product",
      "10",
      "10",
      "2",
      "20",
      "category",
      "admin"
    );

    result = await service.createDailyReport(
      todayDate.toISOString(),
      JSON.stringify(reports),
      user
    );
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

    result = await service.createDailyReport(
      todayDate.toISOString(),
      JSON.stringify(reports),
      "username"
    );
    expect(result).toBe("The report created successfully");

    let testFunctions = [
      testAddIncomesDailyReport,
      testAddInventoryDailyReport,
      testAddGeneralPurposeDailyReport,
    ];

    for (let i in types) {
      setTimeout(async () => {
        await testFunctions[i](records[i], true);
      }, (i + 1) * 1000);
    }
  }, 6000);

  it("getReport req 1.1.14, 2.5, 2.7", async function(done) {
    setTimeout(done, 5000);

    let user = "admin";
    service.login(user, user);

    await service.addFieldToDailyReport("Cash Counted", user);
    await service.addFieldToDailyReport("Report Z Taken", user);

    await service.addCategory("category", "admin");
    await service.addNewProduct(
      "product",
      "10",
      "10",
      "2",
      "20",
      "category",
      "admin"
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

    await service.createDailyReport(
      todayDate.toISOString(),
      JSON.stringify(reports),
      "username"
    );

    //Get reports

    let testFunctions = [
      testIncomeDailyReportResult,
      testInventoryDailyReportResult,
      testGeneralPurposeDailyReportResult,
    ];

    let reportsAfter = records;
    reportsAfter[1].productName = "product";
    for (let i in reportsAfter) {
      reportsAfter[i].date = reportsAfter[i].date.toDateString();
      reportsAfter[i].creatorEmployeeName = "first last";
    }

    for (let i in types) {
      let result = await service.getReport(
        types[i],
        todayDate.toISOString(),
        "username"
      );
      testFunctions[i](result[0], reportsAfter[i]);
    }
  }, 6000);

  it("getFullDailyReport req  2.10, 2.11", async function(done) {
    setTimeout(done, 5000);

    let user = "admin";
    service.login(user, user);

    await service.addFieldToDailyReport("Cash Counted", user);
    await service.addFieldToDailyReport("Report Z Taken", user);

    await service.addCategory("category", "admin");
    await service.addNewProduct(
      "product",
      "10",
      "10",
      "2",
      "20",
      "category",
      "admin"
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

    await service.createDailyReport(
      todayDate.toISOString(),
      JSON.stringify(reports),
      "username"
    );

    //Get reports

    let testFunctions = [
      testIncomeDailyReportResult,
      testInventoryDailyReportResult,
      testGeneralPurposeDailyReportResult,
    ];

    let result = await service.getFullDailyReport(
      todayDate.toISOString(),
      "username"
    );

    let reportsAfter = records;
    reportsAfter[1].productName = "product";
    for (let i in reportsAfter) {
      reportsAfter[i].date = reportsAfter[i].date.toDateString();
      reportsAfter[i].creatorEmployeeName = "first last";
    }

    for (let i in types) {
      let report = result[i].content;
      testFunctions[i](report[0], reportsAfter[i]);
    }
  }, 6000);
});
