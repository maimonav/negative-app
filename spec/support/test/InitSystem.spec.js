const DB = require("../../../server/src/main/DataLayer/DBManager");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const { addEmployee } = require("../DBtests/UserEmployeeTests.spec");

describe("Init System Tests", function () {
  let service;
  let dbName;

  beforeAll(async function () {
    dbName = "inittest";
    service = new ServiceLayer();
    await service.initSeviceLayer(dbName);
  });

  afterAll(async function () {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("Tables creation", async function () {
    try {
      await DB.sequelize.query("use " + dbName + ";");
      let result = await DB.sequelize.query("show tables in " + dbName + ";");
      expect(result[0].length).toBe(13);
    } catch (error) {
      fail("Tables creation test" + error);
    }
  });

  it("admin added", async function () {
    expect(service.users.get("admin")).toBe(0);
    let result = await DB.singleGetById("user", { id: 0 });
    expect(result != null).toBe(true);
    expect(result.username).toBe("admin");
    expect(result.permissions).toBe("ADMIN");
  });

  it("destroy timers added", async function () {
    try {
      await DB.sequelize.query("use " + dbName + ";");
      let result = await DB.sequelize.query("show events in " + dbName + ";");
      expect(result[0].length).toBe(13);
    } catch (error) {
      fail("Tables creation test" + error);
    }
  });

  it("general report added", async function () {
    let todayDate = new Date();
    let date = new Date(todayDate.setDate(todayDate.getDate() - 1));
    let result = await DB.singleGetById("general_purpose_daily_report", {
      date: new Date(date.toISOString().substring(0, 10)),
    });
    expect(result != null).toBe(true);
    expect(result.creatorEmployeeId).toBe(null);
    expect(result.additionalProps).toEqual([[], {}]);
  });
});

describe("Init System Tests - Restore data Tests", function () {
  let dbName;

  afterEach(async function () {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("restore employees", async function () {
    dbName = "inittest";
    await DB.connectAndCreate(dbName);
    sequelize = await DB.initDB(dbName);
    for (let i = 3; i < 7; i++) await addEmployee(i, "employee" + i);

    service = new ServiceLayer();
    await service.initSeviceLayer(dbName);
    service.users.forEach((value, key) => {
      if (key !== "admin") expect(value).toBe(parseInt(key.slice(-1)));
    });
    service.cinemaSystem.employeeManagement.employeeDictionary.forEach(
      (value, key) => {
        expect(key).toBe(value.id);
      }
    );
  });

  it("restore categories", async function () {
    /*dbName = "inittest";
    await DB.connectAndCreate(dbName);
    sequelize = await DB.initDB(dbName);
    for (let i = 3; i < 7; i++) await addEmployee(i, "employee" + i);

    service = new ServiceLayer();
    await service.initSeviceLayer(dbName);
    service.users.forEach((value, key) => {
      if (key !== "admin") expect(value).toBe(parseInt(key.slice(-1)));
    });
    service.cinemaSystem.employeeManagement.employeeDictionary.forEach(
      (value, key) => {
        expect(key).toBe(value.id);
      }
    );*/
  });
});
