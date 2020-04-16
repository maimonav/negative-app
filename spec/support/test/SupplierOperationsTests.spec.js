const DB = require("../../../server/src/main/DataLayer/DBManager");
const Supplier = require("../../../server/src/main/Supplier");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");
const {
  validate,
  testCinemaFunctions,
} = require("./MovieOperationsTests.spec");

describe("Supplier Operations Tests", () => {
  beforeAll(() => {
    DB.testModeOn();
  });

  it("UnitTest addSupplier ,editSupplier, removeSupplier - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();
    //Input validation
    await validate(serviceLayer, serviceLayer.addNewSupplier, {
      "Supplier Name ": "Supplier",
      "Contact Details ": "0500000000",
      "Username ": "User",
    });
    await validate(serviceLayer, serviceLayer.editSupplier, {
      "Supplier Name ": "Supplier",
      "Contact Details ": "0500000000",
      "Username ": "User",
    });
    await validate(serviceLayer, serviceLayer.removeSupplier, {
      "Supplier Name ": "Supplier",
      "Username ": "User",
    });

    await testServiceFunctions(
      serviceLayer,
      async (name) => serviceLayer.addNewSupplier(name, "0500000000", "User"),
      true
    );
    serviceLayer = new ServiceLayer();
    await testServiceFunctions(serviceLayer, async (name) =>
      serviceLayer.editSupplier(name, "0500000000", "User")
    );
    serviceLayer = new ServiceLayer();
    await testServiceFunctions(serviceLayer, async (name) =>
      serviceLayer.removeSupplier(name, "User")
    );
  });

  it("UnitTest addSupplier, editSupplier, removeSupplier - Cinema System", async () => {
    let cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, () =>
      cinemaSystem.addNewSupplier(1, "", 1, 1)
    );
    cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, () =>
      cinemaSystem.editSupplier(1, 1, "", 1, 1)
    );
    cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, () =>
      cinemaSystem.removeSupplier(1, 1)
    );
  });

  it("UnitTest addSupplier - Inventory Management", async () => {
    let inventoryManagement = new InventoryManagement();
    inventoryManagement.suppliers.set(1, null);
    let result = await inventoryManagement.addNewSupplier(1, "Supplier", "050");
    expect(result).toBe("This supplier already exists");
    inventoryManagement.suppliers = new Map();
    result = await inventoryManagement.addNewSupplier(1, "Supplier", "050");
    expect(result).toBe("The supplier added successfully");
    let supplierExpected = new Supplier(1, "Supplier", "050");
    let supplierActual = inventoryManagement.suppliers.get(1);
    expect(supplierActual.equals(supplierExpected)).toBe(true);
  });

  it("UnitTest editSupplier, removeSupplier - Inventory Management", async () => {
    let inventoryManagement = new InventoryManagement();
    let result = await inventoryManagement.editSupplier(1);
    expect(result).toBe("The supplier does not exist");
    let actualSupplier = new Supplier(1, "Supplier", "050");
    inventoryManagement.suppliers.set(1, actualSupplier);
    result = await inventoryManagement.editSupplier(1, "Sup", "052");
    expect(result).toBe("The supplier edited successfully");
    let expectedSupplier = new Supplier(1, "Sup", "052");
    expect(expectedSupplier.equals(actualSupplier)).toBe(true);

    result = await inventoryManagement.removeSupplier(1);
    expect(result).toBe("The supplier removed successfully");
    expect(inventoryManagement.suppliers.has(1)).toBe(false);
    result = await inventoryManagement.removeSupplier(1);
    expect(result).toBe("The supplier does not exist");
  });

  it("Integration addSupplier", async () => {
    let serviceLayer = new ServiceLayer();
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, async () =>
      serviceLayer.addNewSupplier("Supplier", "050", "User")
    );
    let user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(1, null);
    let result = await serviceLayer.addNewSupplier("Supplier", "050", "User");
    expect(result).toBe("This supplier already exists");
    serviceLayer.cinemaSystem.inventoryManagement.suppliers = new Map();
    let supplierExpected = new Supplier(1, "anotherSupplier", "050");
    result = await serviceLayer.addNewSupplier(
      "anotherSupplier",
      "050",
      "User"
    );
    expect(result).toBe("The supplier added successfully");
    let supplierActual = serviceLayer.cinemaSystem.inventoryManagement.suppliers.get(
      1
    );
    expect(supplierActual.equals(supplierExpected)).toBe(true);
    result = await serviceLayer.addNewSupplier(
      "anotherSupplier",
      "050",
      "User"
    );
    expect(result).toBe("The supplier already exists");
  });

  it("Integration editSupplier", async () => {
    let serviceLayer = new ServiceLayer();
    serviceLayer.suppliers.set("Supplier", 1);
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, async () =>
      serviceLayer.editSupplier("Supplier", "050", "User")
    );
    user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    result = await serviceLayer.editSupplier("Supplier", "050", "User");
    expect(result).toBe("The supplier does not exist");
    serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(
      1,
      new Supplier(1, "Supplier", "050")
    );
    let supplierExpected = new Supplier(1, "Supplier", "052");
    result = await serviceLayer.editSupplier("Supplier", "052", "User");
    expect(result).toBe("The supplier edited successfully");
    let supplierActual = serviceLayer.cinemaSystem.inventoryManagement.suppliers.get(
      1
    );
    expect(supplierActual.equals(supplierExpected)).toBe(true);
  });

  it("Integration removeSupplier", async () => {
    let serviceLayer = new ServiceLayer();
    serviceLayer.suppliers.set("Supplier", 1);
    serviceLayer.users.set("User", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, async () =>
      serviceLayer.removeSupplier("Supplier", "User")
    );
    user = { isLoggedin: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    result = await serviceLayer.removeSupplier("Supplier", "User");
    expect(result).toBe("The supplier does not exist");
    serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(
      1,
      new Supplier(1, "Supplier", "050")
    );
    result = await serviceLayer.removeSupplier("Supplier", "User");
    expect(result).toBe("The supplier removed successfully");
    expect(serviceLayer.cinemaSystem.inventoryManagement.suppliers.has(1)).toBe(
      false
    );
    result = await serviceLayer.removeSupplier("Supplier", "User");
    expect(result).toBe("The supplier does not exist");
  });
});

async function testServiceFunctions(serviceLayer, method, isAdd) {
  if (isAdd) serviceLayer.suppliers.set("Supplier", 1);
  let result = await method("Supplier");
  if (isAdd) expect(result).toBe("The supplier already exists");
  else {
    expect(result).toBe("The supplier does not exist");
    serviceLayer.suppliers.set("Supplier", 1);
  }
  if (isAdd) result = await method("anotherSupplier");
  else result = await method("Supplier");
  expect(result).toBe(
    "The user performing the operation does not exist in the system"
  );
}
