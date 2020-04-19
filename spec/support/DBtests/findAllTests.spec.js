const DB = require("../../../server/src/main/DataLayer/DBManager");
const { addEmployee } = require("./UserEmployeeTests.spec");

describe("DB Unit Testing - findAll", function () {
  let sequelize;
  beforeEach(async function () {
    //create connection & mydb
    await DB.connectAndCreate("mydbTest");
    sequelize = await DB.initDB("mydbTest");
  });

  afterEach(async function () {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
    console.log("Database deleted");
  });

  it("init", async function () {
    //Testing connection
    await sequelize
      .authenticate()
      .catch((err) => fail("Unable to connect to the database:", err));
  });

  it("findAll - employee", async function () {
    await addEmployee(0);
    await addEmployee(1);
    let result = await DB.singleFindAll(
      "employee",
      {},
      { fn: "max", fnField: "id" }
    );
    expect(result[0].id).toBe(1);

    for (let i = 2; i < 5; i++) await addEmployee(i);

    result = await DB.singleFindAll("employee", {}, undefined, [["id", "ASC"]]);
    expect(result.length).toBe(5);
  });

  it("findAll - general purpose report", async function () {
    await addEmployee(0);
    await DB.singleAdd("general_purpose_daily_report", {
      date: new Date(),
      additionalProps: [["oldField"], {}],
      creatorEmployeeId: 0,
    });
    await DB.singleAdd("general_purpose_daily_report", {
      date: new Date("2015-01-01"),
      additionalProps: [["oldField"], {}],
      creatorEmployeeId: 0,
    });
    let result = await DB.singleFindAll(
      "general_purpose_daily_report",
      {},
      { fn: "max", fnField: "date" }
    );
    result = await DB.singleGetById("general_purpose_daily_report", {
      date: new Date(result[0].date),
    });
    expect(result.date.toISOString().substring(0, 10)).toEqual(
      new Date().toISOString().substring(0, 10)
    );
    expect(result.additionalProps).toEqual([["oldField"], {}]);
  });
});
