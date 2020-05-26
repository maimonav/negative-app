const DB = require("../../../server/src/main/DataLayer/DBManager");
const {
  testOrder,
  testMovieOrder,
  testCafeteriaOrder,
} = require("../DBtests/OrdersTests.spec");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");

describe("Order Operations Tests", function() {
  let service = new ServiceLayer();
  let dbName = "ordertest";

  beforeEach(async function() {
    await service.initServiceLayer(dbName);
  });

  afterEach(async function() {
    //create connection & drop db
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("addMovieOrder req 2.1.1", async function() {
    let movie = "movieTest";
    let order = "orderTest";
    let supplier = "supplierTest";
    let date = new Date();
    let user = "admin";
    service.login(user, user);

    let result = await service.addMovieOrder(
      order,
      date,
      supplier,
      JSON.parse('["' + movie + '"]'),
      user
    );
    expect(result).toBe("The supplier does not exist");
    await service.addNewSupplier(supplier, "contact", user);

    result = await service.addMovieOrder(
      order,
      date,
      supplier,
      JSON.parse('["' + movie + '"]'),
      user
    );
    expect(result).toBe("Movie does not exist");
    await service.addCategory("categoryTest", user, "");
    result = await service.addMovie(movie, "categoryTest", user);

    result = await service.addMovieOrder(
      order,
      date,
      supplier,
      JSON.parse('["' + movie + '"]'),
      user
    );
    expect(result).toBe(
      "Cannot create order - only employees can create orders"
    );

    await service.addNewEmployee(
      "username",
      "password",
      "name",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");

    result = await service.addMovieOrder(
      order,
      date,
      supplier,
      JSON.parse('["' + movie + '"]'),
      "username"
    );
    expect(result).toBe("The order added successfully");

    await testOrder(service.orders.get(order), {
      date: date.toISOString().substring(0, 10),
      creatorEmployeeId: service.users.get("username"),
      recipientEmployeeId: null,
      supplierId: service.suppliers.get(supplier),
    });

    await testMovieOrder(
      service.orders.get(order),
      service.products.get(movie),
      {
        expectedQuantity: 1,
        actualQuantity: 0,
      }
    );

    result = await service.addMovieOrder(
      order,
      date,
      supplier,
      JSON.parse('["' + movie + '"]'),
      "username"
    );
    expect(result).toBe("The order already exists");
  });

  it("addCafeteriaOrder req 1.1.1", async function() {
    let product = "productTest";
    let order = "orderTest";
    let supplier = "supplierTest";
    let quantity = 4;
    let date = new Date();
    let user = "admin";
    let productsList =
      '[{"name":"' + product + '","quantity":' + quantity + "}]";
    service.login(user, user);

    let result = await service.addCafeteriaOrder(
      order,
      date,
      supplier,
      JSON.parse(productsList),
      user
    );
    expect(result).toBe("The supplier does not exist");
    await service.addNewSupplier(supplier, "contact", user);

    result = await service.addCafeteriaOrder(
      order,
      date,
      supplier,
      JSON.parse(productsList),
      user
    );
    expect(result).toBe("Product does not exist");
    await service.addCategory("categoryTest", user, "");
    await service.addNewProduct(product, 10, 5, 0, 10, "categoryTest", user);

    result = await service.addCafeteriaOrder(
      order,
      date,
      supplier,
      JSON.parse(productsList),
      user
    );
    expect(result).toBe(
      "Cannot create order - only employees can create orders"
    );

    await service.addNewEmployee(
      "username",
      "password",
      "name",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");

    result = await service.addCafeteriaOrder(
      order,
      date,
      supplier,
      JSON.parse(productsList),
      "username"
    );
    expect(result).toBe("The order added successfully");

    await testOrder(service.orders.get(order), {
      date: date.toISOString().substring(0, 10),
      creatorEmployeeId: service.users.get("username"),
      recipientEmployeeId: null,
      supplierId: service.suppliers.get(supplier),
    });

    await testCafeteriaOrder(
      service.orders.get(order),
      service.products.get(product),
      {
        expectedQuantity: quantity,
        actualQuantity: 0,
      }
    );

    result = await service.addCafeteriaOrder(
      order,
      date,
      supplier,
      JSON.parse(productsList),
      "username"
    );
    expect(result).toBe("The order already exists");
  });

  it("removeOrder req 1.1.2, 2.1.2", async function() {
    let product = "productTest";
    let movie = "movieTest";
    let category = "categoryTest";
    let order_1 = "movieOrderTest";
    let order_2 = "productOrderTest";
    let supplier = "supplierTest";
    let quantity = 4;
    let productsList =
      '[{"name":"' + product + '","quantity":' + quantity + "}]";
    let date = new Date();
    let user = "admin";
    service.login(user, user);

    let result = await service.removeOrder(order_1, user);
    expect(result).toBe("The order does not exist");
    result = await service.removeOrder(order_2, user);
    expect(result).toBe("The order does not exist");

    await service.addNewSupplier(supplier, "contact", user);
    await service.addCategory(category, user, "");
    await service.addMovie(movie, category, user);
    await service.addNewProduct(product, 10, 5, 0, 10, category, user);
    await service.addNewEmployee(
      "username",
      "password",
      "name",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");
    await service.addMovieOrder(
      order_1,
      date,
      supplier,
      JSON.parse('["' + movie + '"]'),
      "username"
    );
    await service.addCafeteriaOrder(
      order_2,
      date,
      supplier,
      JSON.parse(productsList),
      "username"
    );

    let order_1Id = service.orders.get(order_1);
    let order_2Id = service.orders.get(order_2);

    result = await service.removeOrder(order_1, user);
    expect(result).toBe("The order removed successfully");
    result = await service.removeOrder(order_2, user);
    expect(result).toBe("The order removed successfully");

    await DB.singleGetById("order", { id: order_1Id }).then((result) => {
      if (result != null) fail("removeOrder 2.1.9 failed");
    });

    let movie_orders = await DB.singleFindAll("movie_order", {});
    if (movie_orders.length != 0) fail("removeOrder 2.1.9 failed");

    let cafeteria_product_orders = await DB.singleFindAll(
      "cafeteria_product_order",
      {}
    );
    if (cafeteria_product_orders.length != 0) fail("removeOrder 1.1.3 failed");

    await DB.singleGetById("order", { id: order_2Id }).then((result) => {
      if (result != null) fail("removeOrder 1.1.3 failed");
    });

    result = await service.removeOrder(order_1, user);
    expect(result).toBe("The order does not exist");

    result = await service.removeOrder(order_2, user);
    expect(result).toBe("The order does not exist");
  });
});
