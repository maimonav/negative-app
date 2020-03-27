const { createConnection, connectAndCreate, dropAndClose } = require("../DBtests/connectAndCreate");
const DB = require("../../../server/src/main/DBManager");

async function addUser(isTest) {
  console.log("START ADD USER\n");
  await DB.add('user', {
    id: 0,
    username: "admin",
    password: "admin",
    permissions: "ADMIN"
  });
  if (isTest)
    await DB.getById('user', { id: 0 }).then((result) => {
      expect(result.id).toBe(0);
      expect(result.username).toBe("admin");
      expect(result.password).toBe("admin");
      expect(result.permissions).toBe("ADMIN");
      expect(result.isUserRemoved).toBe(null);

    });
}
exports.addUser = addUser;


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


async function addEmployee(id,isTest) {
  console.log("START ADD EMPLOYEE\n");
  await DB.add('user', {
    id: id,
    username: "manager",
    password: "manager",
    permissions: "MANAGER",
  });
  if (isTest)
    await DB.getById('user', { id: id }).then((result) => {
      expect(result.id).toBe(id);
      expect(result.username).toBe("manager");
      expect(result.password).toBe("manager");
      expect(result.permissions).toBe("MANAGER");
      expect(result.isUserRemoved).toBe(null);
    });

  await DB.add('employee', {
    id: id,
    firstName: "Noa",
    lastName: "Cohen",
    contactDetails: '0508888888'
  });

  if (isTest)
    await DB.getById('employee', { id: id }).then((result) => {
      expect(result.id).toBe(id);
      expect(result.firstName).toBe("Noa");
      expect(result.lastName).toBe("Cohen");
      expect(result.contactDetails).toBe("0508888888");
      expect(result.isEmployeeRemoved).toBe(null);
    });
}
exports.addEmployee = addEmployee;

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

async function removeUser(id,isTest) {
  console.log("START REMOVE USER\n");
  await DB.update('user', { id: id }, { isUserRemoved: new Date() });

  if (isTest) {
    await DB.getById('user', { id: id }).then((result) => {
      expect(result.isUserRemoved != null).toBe(true);
    });

    await DB.getById('employee', { id: id }).then((result) => {
      expect(result.isEmployeeRemoved != null).toBe(true);
    });
  }
}
exports.removeUser = removeUser;

async function removeEmployee(id,isTest) {
  console.log("START REMOVE EMPLOYEE\n");
  await DB.add('user', {
    id: id,
    username: "manager",
    password: "manager",
    permissions: "MANAGER",
  });

  await DB.add('employee', {
    id: id,
    firstName: "Noa",
    lastName: "Cohen",
    contactDetails: '0508888888'
  });

  await DB.update('employee', { id: id }, { isEmployeeRemoved: true });
  if (isTest) {
    await DB.getById('employee', { id: id }).then((result) => {
      expect(result.isEmployeeRemoved != null).toBe(true);
    });
    await DB.getById('user', { id: id }).then((result) => {
      expect(result.isUserRemoved != null).toBe(false);
    });
  }
}
exports.removeEmployee = removeEmployee;

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
    await addUser(true);
  });

  it("add employee", async function () {
    await addEmployeeWithoutUser();
    await addUser();
    await addEmployee(1,true);
  });


  it("update user and employee", async function () {
    await addUser();
    await addEmployee(1);
    await updateUser();
    await updateEmployee();
  });

  it("remove user and employee", async function () {
    await addUser();
    await addEmployee(1);
    await removeUser(1,true);
    await removeEmployee(2,true);
  });



});


