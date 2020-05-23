const DB = require("../../../server/src/main/DataLayer/DBManager");
const { addEmployee } = require("./UserEmployeeTests.spec");
const moment = require("moment");
const LogControllerFile = require("../../../server/src/main/LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const Sequelize = require("sequelize");

describe("DB Unit Testing - findAll", function() {
  let sequelize;
  beforeEach(async function() {
    //create connection & mydb
    await DB.connectAndCreate("mydbTest");
    sequelize = await DB.initDB("mydbTest");
    logger.testModeOn();
  });

  afterEach(async function() {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
    console.log("Database deleted");
    logger.testModeOff();
  });

  it("init", async function() {
    //Testing connection
    await sequelize
      .authenticate()
      .catch((err) => fail("Unable to connect to the database:", err));
  });

  it("findAll - employee", async function() {
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

  it("findAll - general purpose report", async function() {
    await addEmployee(0);
    await DB.singleAdd("general_purpose_daily_report", {
      date: new Date(),
      propsObject: {},
      allProps: ["oldField"],
      currentProps: ["oldField"],
      creatorEmployeeId: 0,
    });
    await DB.singleAdd("general_purpose_daily_report", {
      date: new Date("2015-01-01"),
      propsObject: {},
      allProps: [],
      currentProps: [],
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

    expect(result.allProps).toEqual(["oldField"]);
    expect(result.currentProps).toEqual(["oldField"]);
  });

  it("findAll - movies report", async function(done) {
    setTimeout(done, 3000);
    let reports = [
      {
        date: moment("08.11.2018 19:30", "DD-MM-YYYY HH:mm").toDate(),
        name: "סרט",
        location: "אולם 6",
        numOfTicketsSales: "7",
        numOfTicketsAssigned: "8",
        totalSalesIncomes: "500",
        totalTicketsReturns: "0",
        totalFees: "1.2",
        totalRevenuesWithoutCash: "500",
        totalCashIncomes: "400",
      },
      {
        date: moment("08.11.2018 21:30", "DD-MM-YYYY HH:mm").toDate(),
        name: "סרט",
        location: "אולם 6",
        numOfTicketsSales: "7",
        numOfTicketsAssigned: "8",
        totalSalesIncomes: "500",
        totalTicketsReturns: "0",
        totalFees: "1.2",
        totalRevenuesWithoutCash: "500",
        totalCashIncomes: "400",
      },
    ];
    await DB.singleAdd("movies_daily_report", reports[0]);
    await DB.singleAdd("movies_daily_report", reports[1]);
    setTimeout(async () => {
      let result = await DB.singleFindAll("movies_daily_report", {
        date: {
          [Sequelize.Op.between]: [
            moment("08.11.2018 00:00", "DD-MM-YYYY HH:mm").toDate(),
            moment("08.11.2018 20:00", "DD-MM-YYYY HH:mm").toDate(),
          ],
        },
      });
      expect(result.length).toBe(1);
    }, 500);
  });
});
