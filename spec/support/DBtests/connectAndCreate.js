const mysql = require('mysql2');



function createConnection (){
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin"
  });
};
exports.createConnection = createConnection;

async function connectAndCreate(con) {
  try {
    await con.connect(async function (err) {
      if (err)
        throw err;
      console.log("Connected!");
    });
    await con.promise().query("CREATE DATABASE mydbTest");
    console.log("Database created");
  }
  catch (error) {
    fail(error);
  }
}
exports.connectAndCreate = connectAndCreate;
async function dropAndClose(con) {
  await con.connect(function (err) {
    if (err)
      throw err;
    console.log("Connected!");
  });
  await con.promise().query("DROP DATABASE mydbTest");
  console.log("Database deleted");
}
exports.dropAndClose = dropAndClose;
