const DB = require("../../../server/src/main/DataLayer/DBManager");
const ReportController = require("../../../server/src/main/ReportController");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const CafeteriaProduct = require("../../../server/src/main/CafeteriaProduct");

const {
  validate,
  testCinemaFunctions,
} = require("./MovieOperationsTests.spec");

describe("Report Operations Tests", () => {
  beforeAll(() => {
    DB._testModeOn();
  });
  it("Unit & Integration addField", async () => {
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initSeviceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.addFieldToDailyReport("test", "User")
    );
  });

  it("Unit & Integration removeField", async () => {
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initSeviceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.removeFieldFromDailyReport("test", "User")
    );
  });

  it("UnitTest getReport - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();

    await validate(serviceLayer, serviceLayer.getReport, {
      "Type ": "type",
      "Date ": "date",
      "Username ": "User",
    });

    await testFunctions(
      async () => serviceLayer.getReport("type", "date", "User"),
      "The user performing the operation does not exist in the system"
    );
  });

  it("UnitTest createDailyReport - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();
    let date = new Date("2020-03-02 14:35:00");
    let reports = [];

    await validate(serviceLayer, serviceLayer.createDailyReport, {
      "Date ": date,
      "Reports ": JSON.stringify(reports),
      "Username ": "User",
    });

    await testFunctions(
      async () =>
        serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
      "The user performing the operation does not exist in the system"
    );

    serviceLayer.users.set("User", null);
    await testFunctions(
      async () =>
        serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
      "There is missing information in the report - Please try again."
    );

    reports = reports.concat({ type: "type" });
    await testFunctions(
      async () =>
        serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
      "Given report type is invalid"
    );

    await testInventoryTypeServiceLayer(reports, serviceLayer, date);
    await testIncomesAndGeneralTypeServiceLayer(reports, serviceLayer, date);
  });

  it("UnitTest createDailyReport - Cinema System", async () => {
    let cinemaSystem = new CinemaSystem();
    cinemaSystem = await testCinemaFunctions(
      cinemaSystem,
      async () => cinemaSystem.createDailyReport(undefined, 1),
      true,
      "create report"
    );
    cinemaSystem.employeeManagement.employeeDictionary.set(1, null);
    await testInventoryTypeCinemaSystem(cinemaSystem);
    await testIncomesTypeCinemaSystem(cinemaSystem);
    await testGeneralTypeCinemaSystem(cinemaSystem);
  });
  it("UnitTest  getReport - Cinema System", async () => {
    let cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, async () =>
      cinemaSystem.getReport("type", "date", 1)
    );
  });

  it("UnitTest createDailyReport - ReportController", async () => {
    let reports = [
      {
        content: [{}],
      },
    ];
    let result = await ReportController.createDailyReport(reports);
    expect(result).toBe("Report record date is invalid");
    reports[0].content[0].date = "date";
    result = await ReportController.createDailyReport(reports);
    expect(result).toBe("Report record date is invalid");
    reports[0].content[0].date = new Date().toDateString();
    result = await ReportController.createDailyReport(reports);
    expect(result).toBe("The report created successfully");
  });

  it("UnitTest getReport - ReportController", async () => {
    let result = await ReportController.getReport("lol", "test");
    expect(result).toBe("The requested report type is invalid");
    let todayDate;
    let types = [
      "inventory_daily_report",
      "incomes_daily_report",
      "general_purpose_daily_report",
    ];
    for (let i in types) {
      let type = types[i];
      result = await ReportController.getReport(type, "test");
      expect(result).toBe("The requested report date is invalid");

      todayDate = new Date();
      let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2));
      result = await ReportController.getReport(type, date);
      expect(result).toBe("The requested report date is invalid");
    }
  });

  it("Integration createDailyReport", async () => {
    let serviceLayer = new ServiceLayer();
    let reports = [];
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.createDailyReport(JSON.stringify(reports), "User")
    );

    let user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    let result = await serviceLayer.createDailyReport(
      JSON.stringify(reports),
      "User"
    );
    expect(result).toBe(
      "Cannot create report - creator employee id is not exist"
    );
    serviceLayer.cinemaSystem.employeeManagement.employeeDictionary.set(
      1,
      null
    );

    result = await serviceLayer.createDailyReport(
      JSON.stringify(reports),
      "User"
    );
    expect(result).toBe("Invalid report - missing information");

    reports = reports.concat({ type: "type" });
    result = await serviceLayer.createDailyReport(
      JSON.stringify(reports),
      "User"
    );
    expect(result).toBe("Requested report type is invalid");
    ReportController._currentGeneralDailyReoprtFormat = [
      "Cash Counted",
      "Report Z Taken",
    ];
    let todayDate = new Date();
    reports = [
      {
        type: "inventory_daily_report",
        content: [
          {
            date: todayDate,
            productName: "Product",
            creatorEmployeeName: "User",
            quantitySold: "4",
            //quantityInStock: "8",
            stockThrown: "8",
          },
        ],
      },
      {
        type: "incomes_daily_report",
        content: [
          {
            date: todayDate,
            creatorEmployeeName: "User",
            numOfTabsSales: "0",
            cafeteriaCashRevenues: "20.0",
            cafeteriaCreditCardRevenues: "20.0",
            ticketsCashRevenues: "20.0",
            ticketsCreditCardRevenues: "20.0",
            tabsCashRevenues: "20.0",
            tabsCreditCardRevenues: "20.0",
          },
        ],
      },
      {
        type: "general_purpose_daily_report",
        content: [
          {
            date: todayDate,
            creatorEmployeeName: "User",
            "Cash Counted": true,
            "Report Z Taken": true,
          },
        ],
      },
    ];

    result = await serviceLayer.createDailyReport(
      JSON.stringify(reports),
      "User"
    );
    expect(result).toBe("The report created successfully");
  });

  it("Integration getReport", async () => {
    //add report
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initSeviceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.getReport("type", "test", "User")
    );
    let user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    serviceLayer.cinemaSystem.inventoryManagement.products.set(0, null);
    let result = await serviceLayer.getReport("lol", "test", "User");
    expect(result).toBe("The requested report type is invalid");
    let todayDate;
    let types = [
      "inventory_daily_report",
      "incomes_daily_report",
      "general_purpose_daily_report",
    ];
    for (let i in types) {
      let type = types[i];
      result = await serviceLayer.getReport(type, "test", "User");
      expect(result).toBe("The requested report date is invalid");

      todayDate = new Date();
      let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2));
      result = await serviceLayer.getReport(type, date, "User");
      expect(result).toBe("The requested report date is invalid");
    }
  });
});

async function testInventoryTypeServiceLayer(reports, serviceLayer, date) {
  await testConvertionForAllTypesServiceLayer(
    "inventory_daily_report",
    reports,
    serviceLayer,
    date
  );
  reports[0].content = [{}];
  await testFunctions(
    async () =>
      serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
    "Product Name is not valid"
  );
  reports[0].content = [{ productName: "Product" }];
  await testFunctions(
    async () =>
      serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
    "The product does not exist."
  );
}

async function testIncomesAndGeneralTypeServiceLayer(
  reports,
  serviceLayer,
  date
) {
  await testConvertionForAllTypesServiceLayer(
    "incomes_daily_report",
    reports,
    serviceLayer,
    date
  );
  await testConvertionForAllTypesServiceLayer(
    "general_purpose_daily_report",
    reports,
    serviceLayer,
    date
  );
}

async function testConvertionForAllTypesServiceLayer(
  type,
  reports,
  serviceLayer,
  date
) {
  reports[0] = { type: type };
  await testFunctions(
    async () =>
      serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
    "There is missing information in the report - Please try again."
  );
  reports[0].content = {};
  await testFunctions(
    async () =>
      serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
    "Report content structure is invalid"
  );
}

async function testInventoryTypeCinemaSystem(cinemaSystem) {
  spyOn(ReportController, "createDailyReport").and.returnValue("test");

  let reports = [{ type: "inventory_daily_report", content: [{}] }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Report content structure is invalid"
  );
  reports[0].content = [{ quantitySold: "lala" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Report content structure is invalid"
  );
  reports[0].content = [{ quantitySold: "2", stockThrown: "-4" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Negative numbers are invalid"
  );
  let product = new CafeteriaProduct(0, "product", 1, 1, 4, 12, 2);
  cinemaSystem.inventoryManagement.products.set(0, product);
  reports[0].content = [{ productId: 0, quantitySold: "2", stockThrown: "4" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "lalalalala" //todo:: edit product failed
  );

  product = new CafeteriaProduct(0, "product", 1, 1, 7, 12, 2);
  cinemaSystem.inventoryManagement.products.set(0, product);
  reports[0].content = [{ productId: 0, quantitySold: "2", stockThrown: "4" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "test"
  );
}
async function testIncomesTypeCinemaSystem(cinemaSystem) {
  spyOn(ReportController, "createDailyReport").and.returnValue("test");

  let reports = [{ type: "incomes_daily_report", content: [{}] }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Report content structure is invalid"
  );
  reports[0].content = [{ quantitySold: "lala" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Report content structure is invalid"
  );
  reports[0].content = [{ quantitySold: "2", stockThrown: "-4" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Negative numbers are invalid"
  );
  let product = new CafeteriaProduct(0, "product", 1, 1, 4, 12, 2);
  cinemaSystem.inventoryManagement.products.set(0, product);
  reports[0].content = [{ productId: 0, quantitySold: "2", stockThrown: "4" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "test"
  );
}
async function testGeneralTypeCinemaSystem(cinemaSystem) {}

async function testFunctions(method, output) {
  let result = await method();
  expect(result).toBe(output);
}
