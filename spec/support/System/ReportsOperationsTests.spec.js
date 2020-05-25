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
    ReportController._allGeneralDailyReportFormat = ["test"];
    ReportController._currentGeneralDailyReportFormat = ["test"];
    let result = await ReportController.addFieldToDailyReport("test");
    expect(result).toBe("The field already exists");

    ReportController._allGeneralDailyReportFormat = [];
    ReportController._currentGeneralDailyReportFormat = [];
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initServiceLayer();
    serviceLayer.users.set("User", 1);
    cinemaSystem = await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.addFieldToDailyReport("test", "User")
    );
    serviceLayer.cinemaSystem = cinemaSystem;
    result = await serviceLayer.addFieldToDailyReport("test", "User");
    expect(result).toBe("The report field added successfully");
    expect(ReportController._allGeneralDailyReportFormat).toEqual(["test"]);
    expect(ReportController._currentGeneralDailyReportFormat).toEqual(["test"]);
  });

  it("Unit & Integration removeField", async () => {
    ReportController._allGeneralDailyReportFormat = [];
    ReportController._currentGeneralDailyReportFormat = [];
    let result = await ReportController.removeFieldFromDailyReport("test");
    expect(result).toBe("The field does not exist");

    ReportController._allGeneralDailyReportFormat = ["test"];
    ReportController._currentGeneralDailyReportFormat = ["test"];
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initServiceLayer();
    serviceLayer.users.set("User", 1);
    cinemaSystem = await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.removeFieldFromDailyReport("test", "User")
    );
    serviceLayer.cinemaSystem = cinemaSystem;
    result = await serviceLayer.removeFieldFromDailyReport("test", "User");
    expect(result).toBe("The report field removed successfully");
    expect(ReportController._allGeneralDailyReportFormat).toEqual(["test"]);
    expect(ReportController._currentGeneralDailyReportFormat).toEqual([]);
  });

  it("UnitTest getReport - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();

    await validate(serviceLayer, serviceLayer.getReport, {
      "Type ": "type",
      "From Date ": "fromDate",
      "To Date ": "toDate",
      "Username ": "User",
    });

    await testFunctions(
      async () => serviceLayer.getReport("type", "fromDate", "toDate", "User"),
      "The user performing the operation does not exist in the system"
    );
  });

  it("UnitTest getFullDailyReport - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();

    await validate(serviceLayer, serviceLayer.getFullDailyReport, {
      "From Date ": "fromDate",
      "To Date ": "toDate",
      "Username ": "User",
    });

    await testFunctions(
      async () => serviceLayer.getFullDailyReport("fromDate", "toDate", "User"),
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
      "report"
    );
    cinemaSystem.employeeManagement.employeeDictionary.set(1, null);
    spyOn(ReportController, "createDailyReport").and.returnValue("test");

    await testInventoryTypeCinemaSystem(cinemaSystem);
    await testIncomesTypeCinemaSystem(cinemaSystem);
  });

  it("UnitTest  getReport - Cinema System", async () => {
    let cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, async () =>
      cinemaSystem.getReport("type", "fromDate", "toDate", 1)
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
    let result = await ReportController.getReport("lol");
    expect(result).toBe("The requested report type is invalid");
    let types = [
      "inventory_daily_report",
      "incomes_daily_report",
      "general_purpose_daily_report",
    ];
    for (let i in types) {
      let type = types[i];
      result = await ReportController.getReport(type, "test");
      expect(result).toBe("The requested report starting date is invalid");

      let todayDate = new Date();
      let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2));
      todayDate = new Date();
      result = await ReportController.getReport(type, date, "test");
      expect(result).toBe("The requested report starting date is invalid");

      result = await ReportController.getReport(type, todayDate, "test");
      expect(result).toBe("The requested report ending date is invalid");

      result = await ReportController.getReport(type, todayDate, date);
      expect(result).toBe("The requested report ending date is invalid");
    }
  });

  it("Integration createDailyReport", async () => {
    let serviceLayer = new ServiceLayer();
    let date = new Date().toISOString();
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
            productName: "Product",
            quantitySold: "2",
            stockThrown: "4",
          },
        ],
      },
    ];
    serviceLayer.users.set("User", 1);
    serviceLayer.products.set("Product", 0);

    await testCinemaFunctions(
      serviceLayer.cinemaSystem,
      () =>
        serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
      true,
      "report"
    );
    serviceLayer.cinemaSystem.employeeManagement.employeeDictionary.set(
      1,
      null
    );
    let product = new CafeteriaProduct(0, "Product", 1, 1, 7, 12, 2);
    serviceLayer.cinemaSystem.inventoryManagement.products.set(0, product);
    let result = await serviceLayer.createDailyReport(
      date,
      JSON.stringify(reports),
      "User"
    );
    expect(result).toBe("The report created successfully");
  });

  it("Integration getReport", async () => {
    //add report
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initServiceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.getReport("type", "test", "test", "User")
    );
    let user = { isLoggedIn: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    serviceLayer.cinemaSystem.inventoryManagement.products.set(0, null);
    let result = await serviceLayer.getReport("lol", "test", "test", "User");
    expect(result).toBe("The requested report type is invalid");
    let types = [
      "inventory_daily_report",
      "incomes_daily_report",
      "general_purpose_daily_report",
    ];

    let todayDate = new Date();
    let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2));
    todayDate = new Date();

    for (let i in types) {
      let type = types[i];
      result = await serviceLayer.getReport(type, "test", "test", "User");
      expect(result).toBe("The requested report starting date is invalid");

      result = await serviceLayer.getReport(type, date, "test", "User");
      expect(result).toBe("The requested report starting date is invalid");

      result = await serviceLayer.getReport(type, todayDate, "test", "User");
      expect(result).toBe("The requested report ending date is invalid");

      result = await serviceLayer.getReport(type, todayDate, date, "User");
      expect(result).toBe("The requested report ending date is invalid");

      result = await serviceLayer.getReport(type, todayDate, todayDate, "User");
      expect(Array.isArray(result)).toBeTrue;
    }
  });

  it("Integration getFullDailyReport", async () => {
    //add report
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initServiceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.getFullDailyReport("test", "test", "User")
    );
    let user = { isLoggedIn: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    serviceLayer.cinemaSystem.inventoryManagement.products.set(0, null);

    let todayDate = new Date();
    let date = new Date(todayDate.setFullYear(todayDate.getFullYear() - 2));
    todayDate = new Date();

    let result = await serviceLayer.getFullDailyReport("test", "test", "User");
    expect(result).toBe("The requested report starting date is invalid");

    result = await serviceLayer.getFullDailyReport(date, "test", "User");
    expect(result).toBe("The requested report starting date is invalid");

    result = await serviceLayer.getFullDailyReport(todayDate, "test", "User");
    expect(result).toBe("The requested report ending date is invalid");

    result = await serviceLayer.getFullDailyReport(todayDate, date, "User");
    expect(result).toBe("The requested report ending date is invalid");

    result = await serviceLayer.getFullDailyReport(
      todayDate.toISOString(),
      todayDate.toISOString(),
      "User"
    );
    expect(Array.isArray(result)).toBeTrue;
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
  serviceLayer.products.set("Product", null);
  reports[0].content = [{ productName: "Product" }, { productName: "Product" }];
  await testFunctions(
    async () =>
      serviceLayer.createDailyReport(date, JSON.stringify(reports), "User"),
    "Cannot add the same product more than once to inventory report."
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
    "Only non-negative numbers are allowed in inventory report"
  );
  let product = new CafeteriaProduct(0, "product", 1, 1, 4, 12, 2);
  cinemaSystem.inventoryManagement.products.set(0, product);
  reports[0].content = [{ productId: 0, quantitySold: "2", stockThrown: "4" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Problem occurred while editing products quantities (you should check the quantity in stock).\n" +
      "Quantity must be greater or equal to 0"
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
  let reports = [{ type: "incomes_daily_report", content: [{}] }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Report content structure is invalid"
  );
  reports[0].content = [{ numOfTabsSales: "lala" }];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Report content structure is invalid"
  );
  reports[0].content = [
    {
      numOfTabsSales: "-2",
      cafeteriaCashRevenues: "2.2",
      cafeteriaCreditCardRevenues: "5.5",
      ticketsCashRevenues: "4",
      ticketsCreditCardRevenues: "3",
      tabsCashRevenues: "0",
      tabsCreditCardRevenues: "0",
    },
  ];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "Only non-negative numbers are allowed in incomes report"
  );
  reports[0].content = [
    {
      numOfTabsSales: "2",
      cafeteriaCashRevenues: "2.2",
      cafeteriaCreditCardRevenues: "5.5",
      ticketsCashRevenues: "4",
      ticketsCreditCardRevenues: "3",
      tabsCashRevenues: "0",
      tabsCreditCardRevenues: "0",
    },
  ];
  await testFunctions(
    async () => cinemaSystem.createDailyReport(reports, 1),
    "test"
  );
}

async function testFunctions(method, output) {
  let result = await method();
  expect(result).toBe(output);
}
