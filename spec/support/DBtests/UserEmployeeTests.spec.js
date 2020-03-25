const { createConnection, connectAndCreate, dropAndClose } = require("../DBtests/connectAndCreate");
const DB = require("../../../server/src/main/DBManager");

async function addUser() {
  console.log("START ADD USER\n");
  await DB.add('user', {
    id: 0,
    username: "admin",
    password: "admin",
    permissions: "ADMIN"
  });
  await DB.getById('user', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.username).toBe("admin");
    expect(result.password).toBe("admin");
    expect(result.permissions).toBe("ADMIN");
    expect(result.isUserRemoved).toBe(false);

  });
}


async function addEmployeeWithoutUser() {
  try {
    await DB.add('employee', {
      id: 1,
      firstName: "Noa",
      lastName: "Cohen",
      contactDetails: '0508888888'
    });

    await DB.getById('employee', { id: 1 }).then((result) => {
      if (result != null)
        fail("addEmployeeWithoutUser failed");
    });
  }
  catch (error) { }
}


async function addEmployee() {
  console.log("START ADD EMPLOYEE\n");
  await DB.add('user', {
    id: 1,
    username: "manager",
    password: "manager",
    permissions: "MANAGER",
  });
  await DB.getById('user', { id: 1 }).then((result) => {
    expect(result.id).toBe(1);
    expect(result.username).toBe("manager");
    expect(result.password).toBe("manager");
    expect(result.permissions).toBe("MANAGER");
    expect(result.isUserRemoved).toBe(false);
  });

  await DB.add('employee', {
    id: 1,
    firstName: "Noa",
    lastName: "Cohen",
    contactDetails: '0508888888'
  });
  await DB.getById('employee', { id: 1 }).then((result) => {
    expect(result.id).toBe(1);
    expect(result.firstName).toBe("Noa");
    expect(result.lastName).toBe("Cohen");
    expect(result.contactDetails).toBe("0508888888");
    expect(result.isEmployeeRemoved).toBe(false);
  });
}

async function updateUser() {
  console.log("START UPDATE USER\n");
  await DB.update('user', { id: 1 }, { username: "noa", password: "noa", permissions: "DEPUTY_MANAGER" });
  await DB.getById('user', { id: 1 }).then((result) => {
    expect(result.id).toBe(1);
    expect(result.username).toBe("noa");
    expect(result.password).toBe("noa");
    expect(result.permissions).toBe("DEPUTY_MANAGER");
  });
}

async function updateEmployee() {
  console.log("START UPDATE EMPLOYEE\n");
  await DB.update('employee', { id: 1 }, { firstName: "Noam", lastName: "Chen", contactDetails: "0500000000" });
  await DB.getById('employee', { id: 1 }).then((result) => {
    expect(result.id).toBe(1);
    expect(result.firstName).toBe("Noam");
    expect(result.lastName).toBe("Chen");
    expect(result.contactDetails).toBe("0500000000");
  });
}

async function removeUser() {
  console.log("START REMOVE USER\n");
  await DB.update('user', { id: 1 }, { isUserRemoved: true });
  await DB.getById('user', { id: 1 }).then((result) => {
    expect(result.isUserRemoved).toBe(true);
  });


  await DB.getById('employee', { id: 1 }).then((result) => {
    expect(result.isEmployeeRemoved).toBe(true);
  });
}


async function removeEmployee() {
  console.log("START REMOVE EMPLOYEE\n");
  await DB.add('user', {
    id: 2,
    username: "manager",
    password: "manager",
    permissions: "MANAGER",
  });

  await DB.add('employee', {
    id: 2,
    firstName: "Noa",
    lastName: "Cohen",
    contactDetails: '0508888888'
  });

  await DB.update('employee', { id: 2 }, { isEmployeeRemoved: true });
  await DB.getById('employee', { id: 2 }).then((result) => {
    expect(result.isEmployeeRemoved).toBe(true);
  });
  await DB.getById('user', { id: 2 }).then((result) => {
    expect(result.isUserRemoved).toBe(false);
  });

}

describe("DB Unit Testing - user and employee", function () {


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


  it("add user", async function () {
    await addUser();
  });

  it("add employee", async function () {
    await addEmployeeWithoutUser();
    await addUser();
    await addEmployee();
  });


  it("update user and employee", async function () {
    await addUser();
    await addEmployee();
    await updateUser();
    await updateEmployee();
  });

  it("remove user and employee", async function () {
    await addUser();
    await addEmployee();
    await removeUser();
    await removeEmployee();
  });



});


