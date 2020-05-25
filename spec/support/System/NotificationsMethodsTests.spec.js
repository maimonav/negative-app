const DB = require("../../../server/src/main/DataLayer/DBManager");
const NotificationController = require("../../../server/src/main/NotificationController");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");
const CafeteriaProduct = require("../../../server/src/main/CafeteriaProduct");

describe("Notifications Methods Tests", () => {
  let inventoryManagement = new InventoryManagement();

  beforeAll(() => {
    DB._testModeOn();
  });

  it("Unit Test - checkAndNotifyLowAndHighQuantity - Inventory Management", async () => {
    spyOn(NotificationController, "notifyLowQuantity").and.stub();
    spyOn(NotificationController, "notifyHighQuantity").and.stub();

    let product = new CafeteriaProduct(0, "productTest", 0, 10, 6, 8, 2);
    inventoryManagement.products.set(0, product);
    inventoryManagement.checkAndNotifyLowAndHighQuantity([{ id: 0 }]);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(0);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(0);

    product.quantity = 10;
    inventoryManagement.products.set(0, product);
    inventoryManagement.checkAndNotifyLowAndHighQuantity([{ id: 0 }]);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(1);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(0);

    let anotherProduct = new CafeteriaProduct(
      1,
      "anotherProductTest",
      0,
      10,
      1,
      8,
      2
    );
    inventoryManagement.products.set(1, anotherProduct);
    inventoryManagement.checkAndNotifyLowAndHighQuantity([{ id: 1 }]);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(1);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(1);
  });

  it("Integration Test - checkAndNotifyLowAndHighQuantity - addCafeteriaProduct - Inventory Management", async () => {
    spyOn(NotificationController, "notifyLowQuantity").and.stub();
    spyOn(NotificationController, "notifyHighQuantity").and.stub();

    inventoryManagement.categories.set(0, null);
    await inventoryManagement.addCafeteriaProduct(
      0,
      "productTest",
      0,
      10,
      6,
      8,
      2
    );
    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(0);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(0);

    await inventoryManagement.addCafeteriaProduct(
      1,
      "productTest",
      0,
      10,
      10,
      8,
      2
    );

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(1);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(0);

    await inventoryManagement.addCafeteriaProduct(
      2,
      "productTest",
      0,
      10,
      1,
      8,
      2
    );

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(1);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(1);
  });

  it("Integration Test - checkAndNotifyLowAndHighQuantity - editCafeteriaProduct - Inventory Management", async () => {
    spyOn(NotificationController, "notifyLowQuantity").and.stub();
    spyOn(NotificationController, "notifyHighQuantity").and.stub();

    inventoryManagement.categories.set(0, null);
    let product = new CafeteriaProduct(0, "productTest", 0, 10, 6, 8, 2);
    inventoryManagement.products.set(0, product);
    await inventoryManagement.editCafeteriaProduct(0, 0, 10, 5);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(0);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(0);

    await inventoryManagement.editCafeteriaProduct(0, 0, 10, 10);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(1);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(0);

    await inventoryManagement.editCafeteriaProduct(0, 0, 10, 1);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(1);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(1);
  });

  it("Integration Test - checkAndNotifyLowAndHighQuantity - confirmOrder - Inventory Management", async () => {
    spyOn(NotificationController, "notifyLowQuantity").and.stub();
    spyOn(NotificationController, "notifyHighQuantity").and.stub();
    let todayDate = new Date();
    inventoryManagement.categories.set(0, null);
    inventoryManagement.suppliers.set(0, null);
    let product = new CafeteriaProduct(0, "productTest", 0, 10, 0, 8, 2);
    inventoryManagement.products.set(0, product);

    await inventoryManagement.addCafeteriaOrder(0, todayDate.toISOString(), 0, [
      { id: 0, quantity: 1 },
    ]);
    await inventoryManagement.confirmOrder(0, [{ id: 0, actualQuantity: 1 }]);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(0);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(1);

    await inventoryManagement.addCafeteriaOrder(0, todayDate.toISOString(), 0, [
      { id: 0, quantity: 3 },
    ]);
    await inventoryManagement.confirmOrder(0, [{ id: 0, actualQuantity: 3 }]);
    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(0);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(1);

    await inventoryManagement.addCafeteriaOrder(0, todayDate.toISOString(), 0, [
      { id: 0, quantity: 9 },
    ]);
    await inventoryManagement.confirmOrder(0, [{ id: 0, actualQuantity: 9 }]);

    expect(NotificationController.notifyHighQuantity.calls.count()).toEqual(1);
    expect(NotificationController.notifyLowQuantity.calls.count()).toEqual(1);
  });
});
