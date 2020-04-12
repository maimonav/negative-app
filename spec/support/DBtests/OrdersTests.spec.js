const { addCategory, addMovieAfterCategory, addProductAfterCategory } = require("./ProductsTests.spec");
const DB = require("../../../server/src/main/DBManager");

async function addSupplier(id, isTest) {
  console.log("START ADD SUPPLIER\n");
  await DB.add('supplier', {
    id: id,
    name: "Shupersal",
    contactDetails: "089266584"
  });
  if (isTest)
    await DB.getById('supplier', { id: id }).then((result) => {
      expect(result.id).toBe(id);
      expect(result.name).toBe("Shupersal");
      expect(result.contactDetails).toBe("089266584");
      expect(result.isSupplierRemoved).toBe(null);
    });
}
exports.addSupplier = addSupplier;


async function addOrderBeforeSupplier() {
  console.log("START ADD ORDER BEFORE SUPPLIER\n");
  await DB.add('order', {
    id: 0,
    date: new Date('2020-03-02 00:00:00'),
    creatorEmployeeId: 0,
    supplierId: 0
  });

  await DB.getById('order', { id: 0 }).then((result) => {
    if (typeof result == 'string')
      expect(result.includes("Database Error: Cannot complete action."));
    else if (result != null)
      fail("addOrderBeforeSupplier failed");
  });

}


async function addOrderAftereSupplierCreator(creatorId, isTest) {
  console.log("START ADD ORDER AFTER\n");

  await DB.add('order', {
    id: 0,
    date: new Date('2020-03-02 00:00:00'),
    creatorEmployeeId: creatorId,
    supplierId: 0
  });
  if (isTest)
    await DB.getById('order', { id: 0 }).then((result) => {
      expect(result.id).toBe(0);
      expect(result.date).toEqual(new Date('2020-03-02 00:00:00'));
      expect(result.creatorEmployeeId).toBe(creatorId);
      expect(result.recipientEmployeeId).toBe(null);
      expect(result.supplierId).toBe(0);
    });

}

exports.addOrderAftereSupplierCreator = addOrderAftereSupplierCreator;


async function addOrderBeforeCreator() {
  console.log("START ADD ORDER BEFORE CREATOR\n");

  await DB.add('order', {
    id: 0,
    date: new Date('2020-03-02 00:00:00'),
    creatorEmployeeId: 2,
    supplierId: 0
  });
  await DB.getById('order', { id: 0 }).then((result) => {
    if (typeof result == 'string')
      expect(result.includes("Database Error: Cannot complete action."));
    else if (result != null)
      fail("addOrderBeforeCreator failed");
  });
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
exports.addEmployee = addEmployee;


async function updateSupplier() {
  console.log("START UPDATE SUPPLIER\n");
  await DB.update('supplier', { id: 0 }, { name: "Mega", contactDetails: "0500000000" });
  await DB.getById('supplier', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("Mega");
    expect(result.contactDetails).toBe("0500000000");
  });

}





async function removeSupplier(id, isTest) {
  console.log("START REMOVE SUPPLIER\n");
  await DB.update('supplier', { id: id }, { isSupplierRemoved: new Date() });
  if (isTest)
    await DB.getById('supplier', { id: id }).then((result) => {
      expect(result.isSupplierRemoved != null).toBe(true);
    });

}
exports.removeSupplier = removeSupplier;



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

  await DB.update('order', { id: 0 }, { recipientEmployeeId: 0 });
  await DB.getById('order', { id: 0 }).then((result) => {
    expect(result.recipientEmployeeId).toBe(0);
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


async function addProductsOrder(isTest) {
  console.log("START ADD PRODUCTS TO ORDER\n");
  await addCategory(0, "fantasy");
  await addProductAfterCategory();

  await DB.add('cafeteria_product_order', {
    orderId: 0,
    productId: 0,
    expectedQuantity: 2
  });
  if (isTest)
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
  if (isTest)
    await DB.getById('movie_order', { orderId: 0, movieId: 0 }).then((result) => {
      expect(result.orderId).toBe(0);
      expect(result.movieId).toBe(0);
      expect(result.expectedQuantity).toBe(1);
      expect(result.actualQuantity).toBe(0);
    });
}
exports.addProductsOrder = addProductsOrder;

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

describe("DB Test - suppliers, orders", function () {

  let sequelize;
  beforeEach(async function () {
    //create connection & mydb
    await DB.connectAndCreate('mydbTest');
    sequelize = DB.initDB('mydbTest');
  });

  afterEach(async function () {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
    console.log("Database deleted");
  });


  it("init", async function () {
    //Testing connection
    await sequelize.authenticate().catch(err => fail('Unable to connect to the database:', err));
  });


  it("add empty order & add supplier", async function () {
    await addEmployee(0, "MANAGER");
    await addOrderBeforeSupplier();
    await addSupplier(0, true);
    await addOrderBeforeCreator();
    await addOrderAftereSupplierCreator(0, true);

  });

  it("update supplier", async function () {
    await addSupplier(0);
    await updateSupplier();

  });

  it("remove supplier", async function () {
    await addSupplier(0);
    await removeSupplier(0, true);

  });

  it("remove empty order before and after being supplied", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier(0);
    await addOrderAftereSupplierCreator(0);
    await removeOrderBeforeProvided(false, false);
    await addOrderAftereSupplierCreator(0);
    await removeOrderAfterProvided(false, false);

  });

  it("add full order and add & update product_orders", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier(0);
    await addOrderAftereSupplierCreator(0);
    await addProductsOrder(true);
    await updateProductsOrder();
  });


  it("remove full order includes products before provided", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier(0);
    await addOrderAftereSupplierCreator(0);
    await addProductsOrder();
    await removeOrderBeforeProvided(true, true);
  });

  it("remove full order includes products after provided", async function () {
    await addEmployee(0, "MANAGER");
    await addSupplier(0);
    await addOrderAftereSupplierCreator(0);
    await addProductsOrder();
    await removeOrderAfterProvided(true, true);

  });




});


