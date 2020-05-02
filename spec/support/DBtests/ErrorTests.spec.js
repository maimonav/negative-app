const DB = require("../../../server/src/main/DataLayer/DBManager");

describe("DB Error Tests", function() {
  it("Connect - wrong password", async function() {
    await DB.connectAndCreate("mydbTest", "lalala");
    let returnedMsg = await DB.initDB("mydbTest");
    expect(typeof returnedMsg).toBe("string");
    expect(returnedMsg.includes(DB._connectionMsg)).toBe(true);
  });

  it("Duplicate primary key", async function() {
    //Testing connection
    await DB.connectAndCreate("mydbtest");
    await DB.initDB("mydbTest");

    await DB.singleAdd("user", {
      id: 0,
      username: "admin",
      password: "admin",
      permissions: "ADMIN",
    });
    let returnedMsg = await DB.singleAdd("user", {
      id: 0,
      username: "admin",
      password: "admin",
      permissions: "ADMIN",
    });
    expect(typeof returnedMsg).toBe("string");
    expect(
      returnedMsg.includes(
        "Database Error: Unique constraint is violated in the database."
      )
    ).toBe(true);
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
  });

  it("Foreign key and general Msg", async function() {
    //Testing connection
    await DB.connectAndCreate("mydbtest");
    await DB.initDB("mydbTest");
    let returnedMsg = await DB.singleAdd("movie", {
      id: 0,
      name: "Spiderman",
      categoryId: 1,
    });
    expect(typeof returnedMsg).toBe("string");
    expect(
      returnedMsg.includes(
        "Database Error: Foreign key constraint is violated in the database."
      )
    ).toBe(true);
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
  });
});
