const DB = require("../../../server/src/main/DataLayer/DBManager");
const CafeteriaProduct = require("../../../server/src/main/CafeteriaProduct");
const CafeteriaProductOrder = require("../../../server/src/main/CafeteriaProductOrder");
const Order = require("../../../server/src/main/Order");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");
const {
  asyncValidate,
  asyncTestCinemaFunctions,
} = require("./MovieOrderOperationsTests.spec");

describe("CafeteriaProductOrder Operations Tests", () => {
  beforeAll(() => {
    DB._testModeOn();
  });

  it("UnitTest addCafeteriaOrder  - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();
    //Input validation
    await asyncValidate(serviceLayer, serviceLayer.addCafeteriaOrder, {
      "Order ID ": "Order",
      "Date ": "date",
      "Supplier Name ": "Supplier",
      "Products List ": JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "Username ": "User",
    });

    serviceLayer.orders.set("Order", 1);
    let result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "User"
    );
    expect(result).toBe("The order already exists");
    serviceLayer.orders = new Map();
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "User"
    );
    expect(result).toBe("The supplier does not exist");
    serviceLayer.suppliers.set("Supplier", 1);
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "User"
    );
    expect(result).toBe("Product does not exist");
    serviceLayer.products.set("Product", 1);
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "User"
    );
    expect(result).toBe(
      "The user performing the operation does not exist in the system"
    );
  });

  it("UnitTest addCafeteriaOrder - Cinema System", async () => {
    let cinemaSystem = new CinemaSystem();
    await asyncTestCinemaFunctions(cinemaSystem, () =>
      cinemaSystem.addCafeteriaOrder(1, "", 1, [{ id: 1, quantity: 3 }], 1)
    );
  });

  it("UnitTest addCafeteriaOrder - Inventory Management", async () => {
    let inventoryManagement = new InventoryManagement();
    let todayDate = new Date();
    inventoryManagement.orders.set(1, null);
    let result = await inventoryManagement.addCafeteriaOrder(1);
    expect(result).toBe("This order already exists");
    inventoryManagement.orders = new Map();
    result = await inventoryManagement.addCafeteriaOrder(1, "test", 1);
    expect(result).toBe("The supplier does not exist");
    inventoryManagement.suppliers.set(1, null);
    result = await inventoryManagement.addCafeteriaOrder(1, "test", 1, [
      { id: 1, quantity: -1 },
    ]);
    expect(result).toBe("Product does not exist");
    let product = new CafeteriaProduct(1);
    inventoryManagement.products.set(1, product);
    result = await inventoryManagement.addCafeteriaOrder(1, "test", 1, [
      { id: 1, quantity: -1 },
    ]);
    expect(result).toBe("Quantity inserted is invalid");
    result = await inventoryManagement.addCafeteriaOrder(1, "test", 1, [
      { id: 1, quantity: 3 },
    ]);
    expect(result).toBe("The order date is invalid");
    result = await inventoryManagement.addCafeteriaOrder(
      1,
      todayDate.toISOString(),
      1,
      [{ id: 1, quantity: 3 }],
      1
    );
    expect(result).toBe("The order added successfully");
    let actualOrder = inventoryManagement.orders.get(1);
    let expectedOrder = new Order(1, 1, todayDate, 1);
    let expectedProduct = new CafeteriaProduct(1);
    let expectedCafeteriaProductOrder = new CafeteriaProductOrder(
      expectedProduct,
      expectedOrder,
      3
    );
    expectedProduct.productOrders.set(1, expectedCafeteriaProductOrder);
    expectedOrder.productOrders.set(1, expectedCafeteriaProductOrder);
    expect(expectedOrder.equals(actualOrder)).toBe(true);
  });

  it("Integration addCafeteriaOrder", async () => {
    let serviceLayer = new ServiceLayer();
    serviceLayer.initSeviceLayer();
    let todayDate = new Date();
    let userId = serviceLayer.userCounter;
    let supplierId = serviceLayer.supplierCounter;
    let productId = serviceLayer.productsCounter;
    let orderId = serviceLayer.ordersCounter;
    serviceLayer.users.set("User", userId);
    serviceLayer.suppliers.set("Supplier", supplierId);
    serviceLayer.products.set("Product", productId);
    await asyncTestCinemaFunctions(
      serviceLayer.cinemaSystem,
      () =>
        serviceLayer.addCafeteriaOrder(
          "Order",
          "date",
          "Supplier",
          JSON.parse('[{"name":"Product","quantity":"-1"}]'),
          "User"
        ),
      userId
    );
    let user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(userId, user);

    serviceLayer.cinemaSystem.inventoryManagement.orders.set(orderId, null);
    let result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"-1"}]'),
      "User"
    );
    expect(result).toBe("Cannot add order - creator employee id is not exist");
    serviceLayer.cinemaSystem.employeeManagement.employeeDictionary.set(
      userId,
      null
    );
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"-1"}]'),
      "User"
    );
    expect(result).toBe("This order already exists");

    serviceLayer.cinemaSystem.inventoryManagement.orders = new Map();
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"-1"}]'),
      "User"
    );
    expect(result).toBe("The supplier does not exist");
    serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(
      supplierId,
      null
    );
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"-1"}]'),
      "User"
    );
    expect(result).toBe("Product does not exist");
    let product = new CafeteriaProduct(productId);
    serviceLayer.cinemaSystem.inventoryManagement.products.set(
      productId,
      product
    );
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"-1"}]'),
      "User"
    );
    expect(result).toBe("Quantity inserted is invalid");

    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      "date",
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "User"
    );
    expect(result).toBe("The order date is invalid");
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      todayDate.toISOString(),
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "User"
    );
    expect(result).toBe("The order added successfully");
    let actualOrder = serviceLayer.cinemaSystem.inventoryManagement.orders.get(
      orderId
    );
    let expectedOrder = new Order(orderId, supplierId, todayDate, userId);
    let expectedProduct = new CafeteriaProduct(productId);
    let expectedCafeteriaProductOrder = new CafeteriaProductOrder(
      expectedProduct,
      expectedOrder,
      3
    );
    expectedProduct.productOrders.set(orderId, expectedCafeteriaProductOrder);
    expectedOrder.productOrders.set(productId, expectedCafeteriaProductOrder);
    expect(expectedOrder.equals(actualOrder)).toBe(true);
    result = await serviceLayer.addCafeteriaOrder(
      "Order",
      todayDate.toISOString(),
      "Supplier",
      JSON.parse('[{"name":"Product","quantity":"3"}]'),
      "User"
    );
    expect(result).toBe("The order already exists");
  });
});
