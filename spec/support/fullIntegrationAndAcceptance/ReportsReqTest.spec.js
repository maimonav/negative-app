const DB = require("../../../server/src/main/DataLayer/DBManager");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const ReportController = require("../../../server/src/main/ReportController");
const { csvToJson } = require("../../../server/src/main/EventBuzzScript");

const moment = require("moment");

const {
  testAddInventoryDailyReport,
  testAddIncomesDailyReport,
  testAddGeneralPurposeDailyReport,
  testInventoryDailyReportResult,
  testIncomeDailyReportResult,
  testGeneralPurposeDailyReportResult,
  testMoviesDailyReportResult,
} = require("./../DBtests/ReportsTests.spec");

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

//TODO:: test general
describe("Report Operations Tests", function() {
  let service = new ServiceLayer();
  let dbName = "reporttest";
  let todayDate = moment().toDate();
  let types = [
    "incomes_daily_report",
    "inventory_daily_report",
    "general_purpose_daily_report",
  ];
  let records = [
    {
      date: todayDate,
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
      date: todayDate,
      productId: 0,
      quantitySold: 2,
      stockThrown: 4,
      quantityInStock: 4,
      creatorEmployeeId: 1,
    },
    {
      date: todayDate,
      creatorEmployeeId: 1,
      allProps: ["Cash Counted", "Report Z Taken"],
      currentProps: ["Cash Counted", "Report Z Taken"],
      propsObject: { "Cash Counted": "true", "Report Z Taken": "true" },
    },
  ];

  beforeEach(async function() {
    await service.initServiceLayer(dbName);
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
    let date = new Date("1999-12-31");
    let result = await service.addFieldToDailyReport("new_field", user);
    expect(result).toBe("The report field added successfully");
    let reportAfter = {
      date: date,
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
    let date = new Date("1999-12-31");

    await service.addFieldToDailyReport("new_field", user);

    let result = await service.removeFieldFromDailyReport("new_field", user);
    expect(result).toBe("The report field removed successfully");
    let reportAfter = {
      date: date,
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
      todayDate,
      JSON.stringify(reports),
      user
    );
    expect(result).toBe("The product does not exist.");
    await service.addCategory("category", "admin", "");
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
      todayDate,
      JSON.stringify(reports),
      user
    );
    expect(result).toBe(
      "Cannot create report - only employees can create reports"
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
      todayDate,
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

    await createReport(service, todayDate, reports);

    //Get reports

    let testFunctions = [
      testIncomeDailyReportResult,
      testInventoryDailyReportResult,
      testGeneralPurposeDailyReportResult,
    ];

    let reportsAfter = records;
    reportsAfter[1].productName = "product";
    for (let i in reportsAfter) {
      reportsAfter[i].creatorEmployeeName = "first last";
    }

    for (let i in types) {
      let result = await service.getReport(
        types[i],
        todayDate,
        todayDate,
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

    await service.addCategory("category", "admin", "");
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
      todayDate,
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
      todayDate,
      todayDate,
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

  it("Movies Report Event Buzz - create and get from DB", async () => {
    let report = csvToJson().slice(0, 5);
    let result = await ReportController.createMovieReport(report);
    expect(result).toBe(undefined);
    let reportAfter = report;
    for (let i in report) {
      reportAfter[i].date = moment(
        reportAfter[i].date,
        "DD-MM-YYYY HH:mm"
      ).toDate();
      testMoviesDailyReportResult(report[i], reportAfter[i]);
    }
  });
});
async function createReport(service, todayDate, costumeReports) {
  let user = "admin";
  service.login(user, user);
  await service.addFieldToDailyReport("Cash Counted", user);
  await service.addFieldToDailyReport("Report Z Taken", user);
  await service.addCategory("category", "admin", "");
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
    todayDate,
    JSON.stringify(costumeReports ? costumeReports : reports),
    "username"
  );
}

exports.createReport = createReport;
