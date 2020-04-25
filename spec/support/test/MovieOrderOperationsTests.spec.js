const DB = require("../../../server/src/main/DataLayer/DBManager");
const Movie = require("../../../server/src/main/Movie");
const MovieOrder = require("../../../server/src/main/MovieOrder");
const Order = require("../../../server/src/main/Order");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");

async function validate(serviceLayer, method, params) {
  Object.keys(params).forEach(async (key) => {
    let withEmptyParam = Object.keys(params).map((k) =>
      k === key ? "" : params[k]
    );
    let withUndefinedParam = Object.keys(params).map((k) =>
      k === key ? undefined : params[k]
    );
    let expected = key + "is not valid";
    let result = await method.apply(serviceLayer, withEmptyParam);
    expect(result).toBe(expected);
    result = await method.apply(serviceLayer, withUndefinedParam);
    expect(result).toBe(expected);
  });
}

exports.asyncValidate = validate;

async function testCinemaFunctions(cinemaSystem, method) {
  let result = await method();
  expect(result).toBe(
    "The operation cannot be completed - the user is not connected to the system"
  );
  let user = { isLoggedin: () => false };
  cinemaSystem.users.set(1, user);
  result = await method();
  expect(result).toBe(
    "The operation cannot be completed - the user is not connected to the system"
  );
  user = { isLoggedin: () => true, permissionCheck: () => false };
  cinemaSystem.users.set(1, user);
  result = await method();
  expect(result).toBe("User does not have proper permissions");
}

exports.asyncTestCinemaFunctions = testCinemaFunctions;

describe("MovieOrder Operations Tests", () => {
  beforeAll(() => {
    DB.testModeOn();
  });

  it("UnitTest addMovieOrder  - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();
    //Input validation
    await validate(serviceLayer, serviceLayer.addMovieOrder, {
      "Order ID ": "Order",
      "Date ": "date",
      "Supplier Name ": "Supplier",
      "Movies List ": JSON.parse('["Movie"]'),
      "Username ": "User",
    });

    serviceLayer.orders.set("Order", 1);
    let result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("The order already exists");
    serviceLayer.orders = new Map();
    result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("The supplier does not exist");
    serviceLayer.suppliers.set("Supplier", 1);
    result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("Movie does not exist");
    serviceLayer.products.set("Movie", 1);
    result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe(
      "The user performing the operation does not exist in the system"
    );
  });

  it("UnitTest removeOrder - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();
    //Input validation
    await validate(serviceLayer, serviceLayer.removeOrder, {
      "Order ID ": "Order",
      "Username ": "User",
    });

    let result = await serviceLayer.removeOrder("Order", "User");
    expect(result).toBe("The order does not exist");
    serviceLayer.orders.set("Order", 1);
    result = await serviceLayer.removeOrder("Order", "User");
    expect(result).toBe(
      "The user performing the operation does not exist in the system"
    );
  });

  it("UnitTest addMovieOrder, removeOrder - Cinema System", async () => {
    let cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, () =>
      cinemaSystem.addMovieOrder(1, "", 1, [], 1)
    );

    cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, () =>
      cinemaSystem.removeOrder(1, 1)
    );
  });

  it("UnitTest addMovieOrder - Inventory Management", async () => {
    let inventoryManagement = new InventoryManagement();
    let todayDate = new Date();
    inventoryManagement.orders.set(1, null);
    let result = await inventoryManagement.addMovieOrder(1);
    expect(result).toBe("This order already exists");
    inventoryManagement.orders = new Map();
    result = await inventoryManagement.addMovieOrder(1, "test", 1);
    expect(result).toBe("The supplier does not exist");
    inventoryManagement.suppliers.set(1, null);
    result = await inventoryManagement.addMovieOrder(1, "test", 1, [1]);
    expect(result).toBe("Movie does not exist");
    let movie = new Movie(1);
    inventoryManagement.products.set(1, movie);
    result = await inventoryManagement.addMovieOrder(1, "test", 1, [1]);
    expect(result).toBe("The order date is invalid");
    result = await inventoryManagement.addMovieOrder(
      1,
      todayDate.toISOString(),
      1,
      [1],
      1
    );
    expect(result).toBe("The order added successfully");
    let actualOrder = inventoryManagement.orders.get(1);
    let expectedOrder = new Order(1, 1, todayDate, 1);
    let expectedMovie = new Movie(1);
    let expectedMovieOrder = new MovieOrder(expectedMovie, expectedOrder);
    expectedMovie.productOrders.set(1, expectedMovieOrder);
    expectedOrder.productOrders.set(1, expectedMovieOrder);
    expect(expectedOrder.equals(actualOrder)).toBe(true);
  });

  it("UnitTest removeOrder - Inventory Management", async () => {
    let inventoryManagement = new InventoryManagement();
    let result = await inventoryManagement.removeOrder(1);
    expect(result).toBe("This order does not exist");
    let order = new Order();
    order.recipientEmployeeId = 1;
    inventoryManagement.orders.set(1, order);
    result = await inventoryManagement.removeOrder(1, 1);
    expect(result).toBe("Removing supplied orders is not allowed");
    inventoryManagement.orders.set(1, new Order());
    result = await inventoryManagement.removeOrder(1, 1);
    expect(result).toBe("The order removed successfully");
    expect(inventoryManagement.orders.has(1)).toBe(false);
  });

  it("Integration addMovieOrder", async () => {
    let serviceLayer = new ServiceLayer();
    let todayDate = new Date();
    let userId = serviceLayer.userCounter + 1;
    let supplirId = serviceLayer.supplierCounter;
    let productId = serviceLayer.productsCounter;
    let orderId = serviceLayer.ordersCounter;
    serviceLayer.users.set("User", userId);
    serviceLayer.suppliers.set("Supplier", supplirId);
    serviceLayer.products.set("Movie", productId);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.addMovieOrder(
        "Order",
        "date",
        "Supplier",
        JSON.parse('["Movie"]'),
        "User"
      )
    );
    let user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(userId, user);
    serviceLayer.cinemaSystem.inventoryManagement.orders.set(orderId, null);
    let result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("Cannot add order - creator employee id is not exist");
    serviceLayer.cinemaSystem.employeeManagement.employeeDictionary.set(
      userId,
      null
    );
    result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("This order already exists");
    serviceLayer.cinemaSystem.inventoryManagement.orders = new Map();
    result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("The supplier does not exist");
    serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(
      supplirId,
      null
    );
    result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("Movie does not exist");
    let movie = new Movie(productId);
    serviceLayer.cinemaSystem.inventoryManagement.products.set(
      productId,
      movie
    );
    result = await serviceLayer.addMovieOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("The order date is invalid");
    result = await serviceLayer.addMovieOrder(
      "Order",
      todayDate.toISOString(),
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("The order added successfully");
    let actualOrder = serviceLayer.cinemaSystem.inventoryManagement.orders.get(
      orderId
    );
    let expectedOrder = new Order(orderId, supplirId, todayDate, userId);
    let expectedMovie = new Movie(productId);
    let expectedMovieOrder = new MovieOrder(expectedMovie, expectedOrder);
    expectedMovie.productOrders.set(orderId, expectedMovieOrder);
    expectedOrder.productOrders.set(productId, expectedMovieOrder);
    expect(expectedOrder.equals(actualOrder)).toBe(true);
    result = await serviceLayer.addMovieOrder(
      "Order",
      todayDate.toISOString(),
      "Supplier",
      JSON.parse('["Movie"]'),
      "User"
    );
    expect(result).toBe("The order already exists");
  });

  it("Integration removeOrder", async () => {
    let serviceLayer = new ServiceLayer("mydbtest");
    serviceLayer.users.set("User", 1);
    serviceLayer.orders.set("Order", 0);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.removeOrder("Order", "User")
    );
    user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);

    let result = await serviceLayer.removeOrder("Order", "User");
    expect(result).toBe("This order does not exist");
    let order = new Order(0, 0, new Date("2020-03-02 00:00:00"), 0);
    order.recipientEmployeeId = 1;
    serviceLayer.cinemaSystem.inventoryManagement.orders.set(0, order);
    result = await serviceLayer.removeOrder("Order", "User");
    expect(result).toBe("Removing supplied orders is not allowed");

    order.recipientEmployeeId = null;
    let movie = new Movie(0, "movie", 0);
    let movieOrder = new MovieOrder(movie, order);
    movie.productOrders.set(0, movieOrder);
    order.productOrders.set(0, movieOrder);
    serviceLayer.cinemaSystem.inventoryManagement.orders.set(0, order);

    result = await serviceLayer.removeOrder("Order", "User");
    expect(result).toBe("The order removed successfully");
    expect(serviceLayer.cinemaSystem.inventoryManagement.orders.has(1)).toBe(
      false
    );
    expect(movie.productOrders.has(0)).toBe(false);
    result = await serviceLayer.removeOrder("Order", "User");
    expect(result).toBe("The order does not exist");
  });
});
