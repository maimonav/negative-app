const { createConnection, connectAndCreate, dropAndClose } = require("./connectAndCreate");
const { addCategory, addMovieAfterCategory, addProductAfterCategory } = require("./ProductsTests.spec");

const DB = require("../../../server/src/main/DBManager");

async function addSupplier() {
  console.log("START ADD SUPPLIER\n");
  await DB.add('supplier', {
    id: 0,
    name: "Shupersal",
    contactDetails: "089266584"
  });
  await DB.getById('supplier', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("Shupersal");
    expect(result.contactDetails).toBe("089266584");
    expect(result.isSupplierRemoved).toBe(false);
  });
}



async function addOrderBeforeSupplier() {
  console.log("START ADD ORDER BEFORE SUPPLIER\n");
  try {
    await DB.add('order', {
      id: 0,
      date: new Date('2020-03-02 00:00:00'),
      creatorEmployeeId: 0,
      recipientEmployeeId: 0,
      supplierId: 0
    });

    await DB.getById('order', { id: 0 }).then((result) => {
      if (result != null)
        fail("addOrderBeforeSupplier failed");
    });
  }
  catch (error) { }
}


async function addOrderAftereSupplierCreatorRecipient() {
  console.log("START ADD ORDER AFTER\n");

  await DB.add('order', {
    id: 0,
    date: new Date('2020-03-02 00:00:00'),
    creatorEmployeeId: 0,
    recipientEmployeeId: 0,
    supplierId: 0
  });

  await DB.getById('order', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.date).toEqual(new Date('2020-03-02 00:00:00'));
    expect(result.creatorEmployeeId).toBe(0);
    expect(result.recipientEmployeeId).toBe(0);
    expect(result.supplierId).toBe(0);
    expect(result.isProvided).toBe(false);
  });

}

async function addOrderBeforeRecipient() {
  console.log("START ADD ORDER BEFORE RECIPIENT\n");
  try {
    await DB.add('order', {
      id: 0,
      date: new Date('2020-03-02 00:00:00'),
      creatorEmployeeId: 0,
      recipientEmployeeId: 1,
      supplierId: 0
    });
    await DB.getById('order', { id: 0 }).then((result) => {
      if (result != null)
        fail("addOrderBeforeRecipient failed");
    });
  }
  catch (error) { }

}

async function addOrderBeforeCreator() {
  console.log("START ADD ORDER BEFORE CREATOR\n");
  try {
    await DB.add('order', {
      id: 0,
      date: new Date('2020-03-02 00:00:00'),
      creatorEmployeeId: 2,
      recipientEmployeeId: 0,
      supplierId: 0
    });
    await DB.getById('order', { id: 0 }).then((result) => {
      if (result != null)
        fail("addOrderBeforeCreator failed");
    });
  }
  catch (error) { }
}



async function addEmployee(id, permissions) {
  console.log("START ADD EMPLOYEE\n");
  await DB.add('user', {
    id: id,
    username: "employee" + id,
    password: "employee",
    permissions: permissions,
  });

  await DB.add('employee', {
    id: id,
    firstName: "Noa",
    lastName: "Cohen",
    contactDetails: '0508888888'
  });

}
exports.addEmployee=addEmployee;


async function updateSupplier() {
  console.log("START UPDATE SUPPLIER\n");
  await DB.update('supplier', { id: 0 }, { name: "Mega", contactDetails: "0500000000" });
  await DB.getById('supplier', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("Mega");
    expect(result.contactDetails).toBe("0500000000");
  });

}





async function removeSupplier() {
  console.log("START REMOVE SUPPLIER\n");
  await DB.update('supplier', { id: 0 }, { isSupplierRemoved: true });
  await DB.getById('supplier', { id: 0 }).then((result) => {
    expect(result.isSupplierRemoved).toBe(true);
  });

}



async function removeOrderBeforeProvided(withMovies, withProducts) {
  console.log("START REMOVE ORDER BEFORE\n");
  if (withMovies) {
    await DB.remove('movie_order', { orderId: 0 });
    await DB.getById('movie_order', { orderId: 0 }).then((result) => {
      if (result != null)
        fail("removeOrderBeforeProvided - movie_order - failed");
    });
  }
  if (withProducts) {
    await DB.remove('cafeteria_product_order', { orderId: 0 });
    await DB.getById('cafeteria_product_order', { orderId: 0 }).then((result) => {
      if (result != null)
        fail("removeOrderBeforeProvided - cafeteria_product_order - failed");
    });
  }
  await DB.remove('order', { id: 0 });
  await DB.getById('order', { id: 0 }).then((result) => {
    if (result != null)
      fail("removeOrderBeforeProvided failed");
  });
}



async function removeOrderAfterProvided(withMovies, withProducts) {
  console.log("START REMOVE ORDER AFTER\n");

  await DB.update('order', { id: 0 }, { isProvided: true });
  await DB.getById('order', { id: 0 }).then((result) => {
    expect(result.isProvided).toBe(true);
  });


  if (withMovies) {
    await DB.remove('movie_order', { orderId: 0 });
    await DB.getById('movie_order', { orderId: 0 }).then((result) => {
      if (result == null)
        fail("removeOrderAfterProvided - movie_order - failed");
    });
  }
  if (withProducts) {
    await DB.remove('cafeteria_product_order', { orderId: 0 });
    await DB.getById('cafeteria_product_order', { orderId: 0 }).then((result) => {
      if (result == null)
        fail("removeOrderAfterProvided - cafeteria_product_order - failed");
    });
  }
  await DB.remove('order', { id: 0 });
  await DB.getById('order', { id: 0 }).then((result) => {
    if (result == null)
      fail("removeOrderAfterProvided failed");
  });
}


async function addProductsOrder() {
  console.log("START ADD PRODUCTS TO ORDER\n");
  await addCategory(0, "fantasy");
  await addProductAfterCategory();

  await DB.add('cafeteria_product_order', {
    orderId: 0,
    productId: 0,
    expectedQuantity: 2
  });
  await DB.getById('cafeteria_product_order', { orderId: 0, productId: 0 }).then((result) => {
    expect(result.orderId).toBe(0);
    expect(result.productId).toBe(0);
    expect(result.expectedQuantity).toBe(2);
    expect(result.actualQuantity).toBe(0);
  });

  await addMovieAfterCategory();

  await DB.add('movie_order', {
    orderId: 0,
    movieId: 0,
    expectedQuantity: 1
  });
  await DB.getById('movie_order', { orderId: 0, movieId: 0 }).then((result) => {
    expect(result.orderId).toBe(0);
    expect(result.movieId).toBe(0);
    expect(result.expectedQuantity).toBe(1);
    expect(result.actualQuantity).toBe(0);
  });
}

async function updateProductsOrder() {
  console.log("START UPDATE PRODUCTS TO ORDER\n");
  await DB.update('cafeteria_product_order', { orderId: 0, productId: 0 }, { expectedQuantity: 3, actualQuantity: 3 });
  await DB.getById('cafeteria_product_order', { orderId: 0, productId: 0 }).then((result) => {
    expect(result.orderId).toBe(0);
    expect(result.productId).toBe(0);
    expect(result.expectedQuantity).toBe(3);
    expect(result.actualQuantity).toBe(3);
  });

  await DB.update('movie_order', { orderId: 0, movieId: 0 }, { actualQuantity: 1 });
  await DB.getById('movie_order', { orderId: 0, movieId: 0 }).then((result) => {
    expect(result.orderId).toBe(0);
    expect(result.movieId).toBe(0);
    expect(result.expectedQuantity).toBe(1);
    expect(result.actualQuantity).toBe(1);
  });
}

describe("DB Unit Testing - suppliers, orders", function () {

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


  it("add empty order & add supplier", async function () {
    await addEmployee(0, "MANAGER");
    await addOrderBeforeSupplier();
    await addSupplier();
    await addOrderBeforeRecipient();
    await addOrderBeforeCreator();
    await addOrderAftereSupplierCreatorRecipient();

  });

  it("update supplier", async function () {
    await addSupplier();
    await updateSupplier();

  });

  it("remove supplier", async function () {
    await addSupplier();
    await removeSupplier();

  });

  it("remove empty order before and after being supplied", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier();
    await addOrderAftereSupplierCreatorRecipient();
    await removeOrderBeforeProvided(false, false);
    await addOrderAftereSupplierCreatorRecipient();
    await removeOrderAfterProvided(false, false);

  });

  it("add full order and add & update product_orders", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier();
    await addOrderAftereSupplierCreatorRecipient();
    await addProductsOrder();
    await updateProductsOrder();
  });


  it("remove full order includes products before provided", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier();
    await addOrderAftereSupplierCreatorRecipient();
    await addProductsOrder();
    await removeOrderBeforeProvided(true, true);
  });

  it("remove full order includes products after provided", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier();
    await addOrderAftereSupplierCreatorRecipient();
    await addProductsOrder();
    await removeOrderAfterProvided(true, true);

  });




});


