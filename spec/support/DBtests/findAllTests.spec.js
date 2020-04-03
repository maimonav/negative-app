const { createConnection, connectAndCreate, dropAndClose } = require("./connectAndCreate");
const DB = require("../../../server/src/main/DBManager");
const { addEmployee } = require("./UserEmployeeTests.spec");



describe("DB Unit Testing - findAll", function () {


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


  it("findAll - employee", async function () {
    await addEmployee(0);
    await addEmployee(1);
    let result = await DB.findAll('employee',{},{ fn: 'max', fnField: 'id' });
    expect(result[0].id).toBe(1);
  });

  it("findAll - general purpose report", async function () {
    await addEmployee(0);
    await DB.add('general_purpose_daily_report', { date: new Date("2016-01-01"), additionalProps: [["oldField"], {}],creatorEmployeeId:0 });
    await DB.add('general_purpose_daily_report', { date: new Date("2015-01-01"), additionalProps: [["oldField"], {}],creatorEmployeeId:0 });
    let result = await DB.findAll('general_purpose_daily_report',{},{ fn: 'max', fnField: 'date' , fields: ['additionalProps']});
    expect(result[0].date).toEqual(new Date("2016-01-01"));
    expect(result[0].additionalProps).toEqual([["oldField"], {}]);

  });



});


