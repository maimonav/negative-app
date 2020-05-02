const DB = require("../../../server/src/main/DataLayer/DBManager");
const ReportController = require("../../../server/src/main/ReportController");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const {
  validate,
  testCinemaFunctions,
} = require("./MovieOperationsTests.spec");

describe("Report Operations Tests", () => {
  beforeAll(() => {
    DB._testModeOn();
  });

  it("UnitTest createDailyReport, getReport - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();
    let records = JSON.stringify([
      {
        date: new Date("2020-03-02 14:35:00"),
        productId: 0,
        creatorEmployeeId: 0,
        quantitySold: 4,
        quantityInStock: 8,
        stockThrown: 8,
      },
    ]);

    await validate(serviceLayer, serviceLayer.createDailyReport, {
      "Type ": "type",
      "Records ": records,
      "Username ": "User",
    });
    await validate(serviceLayer, serviceLayer.getReport, {
      "Type ": "type",
      "Date ": "date",
      "Username ": "User",
    });

    await testServiceFunctions(async () =>
      serviceLayer.createDailyReport("type", records, "User")
    );
    let result = await serviceLayer.getReport("type", "date", "User");
    expect(result).toBe(
      "The user performing the operation does not exist in the system"
    );
  });

  it("UnitTest createDailyReport, getReport - Cinema System", async (done) => {
    setTimeout(done, 2000);

    let cinemaSystem = new CinemaSystem();
    let records = [
      {
        date: new Date("2020-03-02 14:35:00"),
        productId: 0,
        creatorEmployeeId: 0,
        quantitySold: 4,
        quantityInStock: 8,
        stockThrown: 8,
      },
    ];
    await testCinemaFunctions(cinemaSystem, async () =>
      cinemaSystem.createDailyReport("type", records, 1)
    );
    cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, async () =>
      cinemaSystem.getReport("type", "date", 1)
    );
  });

  it("UnitTest createDailyReport - ReportController", async () => {
    result = await ReportController.createDailyReport("test");
    expect(result).toBe("The requested report type is invalid");
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
    let records = JSON.stringify([]);
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.createDailyReport("type", records, "User")
    );
    /*await addEmployee(1);
    await addCategory(0, "Snacks");
    await addProductAfterCategory();*/
    let user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    let result = await serviceLayer.createDailyReport("lol", records, "User");
    expect(result).toBe(
      "Cannot create report - creator employee id is not exist"
    );
    serviceLayer.cinemaSystem.employeeManagement.employeeDictionary.set(
      1,
      null
    );
    result = await serviceLayer.createDailyReport("lol", records, "User");
    expect(result).toBe("The requested report type is invalid");
    /*
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

    for (let i in types) {
      records = JSON.stringify([reports[i]]);
      result = await serviceLayer.createDailyReport(types[i], records, "User");
      expect(result).toBe("The report created successfully");
    }*/
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

  it("Integration addField", async () => {
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initSeviceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.addFieldToDailyReport("test", "User")
    );
  });

  it("Integration removeField", async () => {
    let serviceLayer = new ServiceLayer();
    await serviceLayer.initSeviceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.removeFieldFromDailyReport("test", "User")
    );
  });
});

async function testServiceFunctions(method) {
  let result = await method();
  expect(result).toBe(
    "The user performing the operation does not exist in the system"
  );
}
