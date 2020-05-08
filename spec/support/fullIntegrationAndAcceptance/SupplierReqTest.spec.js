const DB = require("../../../server/src/main/DataLayer/DBManager");
const { testSupplier } = require("../DBtests/OrdersTests.spec");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");

describe("Supplier Operations Tests", function() {
  let service = new ServiceLayer();
  let dbName = "suppliertest";

  beforeEach(async function() {
    await service.initSeviceLayer(dbName);
  });

  afterEach(async function() {
    //create connection & drop db
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("addNewSupplier req 1.1.7, 2.1.7", async function() {
    let supplier = "supplierTest";
    let contactDetails = "0508888888";
    let user = "admin";
    service.login(user, user);
    let result = await service.addNewSupplier(supplier, contactDetails, user);
    expect(result).toBe("The supplier added successfully");

    await testSupplier(service.suppliers.get(supplier), {
      name: supplier,
      contactDetails: contactDetails,
      isSupplierRemoved: null,
    });

    result = await service.addNewSupplier(supplier, contactDetails, user);
    expect(result).toBe("The supplier already exists");
  });

  it("editSupplier req 1.1.8, 2.1.8", async function() {
    let supplier = "supplierTest";
    let contactDetails = "0508888888";
    let user = "admin";
    service.login(user, user);
    let result = await service.editSupplier(supplier, contactDetails, user);
    expect(result).toBe("The supplier does not exist");
    await service.addNewSupplier(supplier, contactDetails, user);

    result = await service.editSupplier(supplier, contactDetails + "2", user);
    expect(result).toBe("The supplier edited successfully");

    await testSupplier(service.suppliers.get(supplier), {
      name: supplier,
      contactDetails: contactDetails + "2",
      isSupplierRemoved: null,
    });
  });

  it("removeSupplier req 1.1.9, 2.1.9", async function(done) {
    setTimeout(done, 4999);
    let supplier = "supplierTest";
    let contactDetails = "0508888888";
    let user = "admin";
    service.login(user, user);
    let result = await service.removeSupplier(supplier, user);
    expect(result).toBe("The supplier does not exist");
    await service.addNewSupplier(supplier, contactDetails, user);

    let supplierId = service.suppliers.get(supplier);
    result = await service.removeSupplier(supplier, user);
    expect(result).toBe("The supplier removed successfully");
    setTimeout(async () => {
      await testSupplier(supplierId, {
        name: supplier,
        contactDetails: contactDetails,
        isSupplierRemoved: new Date(),
      });
    }, 2000);

    result = await service.removeSupplier(supplier, user);
    expect(result).toBe("The supplier does not exist");
  });
});
