const DB = require("../../../server/src/main/DBManager");



describe("DB Error Tests", function () {


  let sequelize;


 it("Connect - wrong password", async function () {
  await DB.connectAndCreate('mydbtest','lalala');
  sequelize = DB.initDB('mydbTest');
  let returnedMsg = await DB.add('user', {
    id: 0,
    username: "admin",
    password: "admin",
    permissions: "ADMIN"
  });
  expect(typeof returnedMsg).toBe('string');
    expect(returnedMsg.includes(DB.connectionMsg + ' Refused due to insufficient privileges'
    + ' - Password to database should be checked.')).toBe(true);
  });

  it("Duplicate primary key", async function () {
    //Testing connection
    await DB.connectAndCreate('mydbtest');
    sequelize = DB.initDB('mydbTest');

    await DB.add('user', {
      id: 0,
      username: "admin",
      password: "admin",
      permissions: "ADMIN"
    });
    let returnedMsg = await DB.add('user', {
      id: 0,
      username: "admin",
      password: "admin",
      permissions: "ADMIN"
    });
    expect(typeof returnedMsg).toBe('string');
    expect(returnedMsg.includes('Database Error: Unique constraint is violated in the database.')).toBe(true);
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
  });


  it("Foreign key and general Msg", async function () {
    //Testing connection
    await DB.connectAndCreate('mydbtest');
    sequelize = DB.initDB('mydbTest');
    let returnedMsg = await DB.add('movie', {
      id: 0,
      name: "Spiderman",
      categoryId: 1
    });
    expect(typeof returnedMsg).toBe('string');
    expect(returnedMsg.includes('Database Error: Cannot complete action.')).toBe(true);
  
    await DB.add('category', {
      id: 0,
      name: 'category'
    });
    returnedMsg = await DB.add('movie', {
      id: 0,
      name: "Spiderman",
      categoryId: 1
    });
    expect(typeof returnedMsg).toBe('string');
    expect(returnedMsg.includes('Database Error: Foreign key constraint is violated in the database.')).toBe(true);
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
  });
  




});


