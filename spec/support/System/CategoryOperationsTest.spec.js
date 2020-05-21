describe("CategoryOperationsTest", () => {
  const Employee = require("../../../server/src/main/Employee");
  const CinemaSystem = require("../../../server/src/main/CinemaSystem");
  const ServiceLayer = require("../../../server/src/main/ServiceLayer");
  const InventoryManagement = require("../../../server/src/main/InventoryManagement");
  const CafeteriaProduct = require("../../../server/src/main/CafeteriaProduct");
  const Category = require("../../../server/src/main/Category");
  const DB = require("../../../server/src/main/DataLayer/DBManager");

  let p1;
  let inventoryManagement;
  let category;
  let cinemaSystem;
  let admin;
  let serviceLayer;

  beforeEach(() => {
    DB._testModeOn();
    parentCategory = new Category(1, "CafeteriaProductCategory");
    category = new Category(0, "Dairy", parentCategory.id);
    p1 = new CafeteriaProduct(-1, "milk", category.id, 10, 1);
    inventoryManagement = new InventoryManagement();
    inventoryManagement.categories.set(category.id, category);
    inventoryManagement.categories.set(parentCategory.id, parentCategory);
    cinemaSystem = new CinemaSystem("");
    admin = new Employee(0, "admin", "123456", "ADMIN", "admin", "admin", "");
    admin.Loggedin = true;
    cinemaSystem.inventoryManagement = inventoryManagement;
    cinemaSystem.users.set(admin.id, admin);

    serviceLayer = new ServiceLayer("");
    serviceLayer.users = new Map();
    serviceLayer.products = new Map();
    serviceLayer.categories = new Map();
    serviceLayer.productsCounter = 0;

    serviceLayer.users.set(admin.userName, admin.id);
    serviceLayer.cinemaSystem = cinemaSystem;
    serviceLayer.categories.set(category.name, category.id);
    serviceLayer.categories.set(parentCategory.name, parentCategory.id);
  });

  it("UnitTest-Categoty- removeCategory", () => {
    //Note - Deleting categoty is done only by comparing days without hours and so we will ignore the hours in this test.
    expect(category.isCategoryRemoved).toBe(null);
    category.removeCategory();
    const categoryRemovedDate = category.isCategoryRemoved;
    categoryRemovedDate.setHours(0, 0, 0, 0);
    const curDate = new Date();
    curDate.setHours(0, 0, 0, 0);
    expect(categoryRemovedDate).toEqual(curDate);
  });

  it("UnitTest-InventoryManegment- addCategory", async () => {
    inventoryManagement.categories = new Map();
    expect(
      await inventoryManagement.addCategory(
        category.id,
        category.name,
        category.id * -1
      )
    ).toEqual("The parent category  doesn't exist");
    expect(
      await inventoryManagement.addCategory(category.id, category.name)
    ).toEqual("The category was successfully added to the system");
    expect(
      await inventoryManagement.addCategory(category.id, category.name)
    ).toEqual("The Category ID already exist");
  });

  it("UnitTest-InventoryManegment- editCategory", async () => {
    category.parentId = -1;
    expect(await inventoryManagement.editCategory(category.id, -3)).toEqual(
      "The parent category  doesn't exist"
    );
    expect(
      await inventoryManagement.editCategory(category.id - 3, category.id)
    ).toEqual("The Category ID doesn't exist");
    expect(
      await inventoryManagement.editCategory(category.id, parentCategory.id)
    ).toEqual("The category was successfully updateded");
    expect(category.parentId).toEqual(parentCategory.id);
  });

  it("UnitTest-InventoryManegment- removeCategory", async () => {
    expect(await inventoryManagement.removeCategory(-3)).toEqual(
      "The Category ID doesn't exist"
    );
    expect(await inventoryManagement.removeCategory(category.id)).toEqual(
      "The category was successfully removed"
    );
  });
  it("UnitTest-CinemaSystem- addCategory", async () => {
    inventoryManagement.categories = new Map();
    spyOn(inventoryManagement, "addCategory").and.returnValue("dummy");
    expect(
      await cinemaSystem.addCategory(
        category.id,
        category.name,
        category.parentId,
        admin.id - 10
      )
    ).toEqual(cinemaSystem.userOfflineMsg);
    expect(
      await cinemaSystem.addCategory(
        category.id,
        category.name,
        category.parentId,
        admin.id
      )
    ).toEqual("dummy");
  });

  it("UnitTest-CinemaSystem- editCategory", async () => {
    inventoryManagement.categories = new Map();
    spyOn(inventoryManagement, "editCategory").and.returnValue("dummy");
    expect(
      await cinemaSystem.editCategory(
        category.id,
        category.parentId,
        admin.id - 10
      )
    ).toEqual(cinemaSystem.userOfflineMsg);
    expect(
      await cinemaSystem.editCategory(category.id, category.parentId, admin.id)
    ).toEqual("dummy");
  });

  it("UnitTest-CinemaSystem- removeCategory", async () => {
    inventoryManagement.categories = new Map();
    spyOn(inventoryManagement, "removeCategory").and.returnValue("dummy");
    expect(
      await cinemaSystem.removeCategory(category.id, admin.id - 10)
    ).toEqual(cinemaSystem.userOfflineMsg);
    expect(await cinemaSystem.removeCategory(category.id, admin.id)).toEqual(
      "dummy"
    );
  });

  it("UnitTest-ServiceLayer- addCategory", async () => {
    serviceLayer.categories = new Map();
    serviceLayer.categories.set(parentCategory.name, parentCategory.id);
    const child = new Category(2, "milk", category.id);
    spyOn(cinemaSystem, "addCategory").and.returnValue(
      "The category was successfully added to the system"
    );
    expect(
      await serviceLayer.addCategory(
        category.id,
        admin.userName - 10,
        category.name
      )
    ).toEqual("The user performing the operation does not exist in the system");
    expect(
      await serviceLayer.addCategory(child.name, admin.userName, category.name)
    ).toEqual("The parent " + category.name + " does not exist");
    let counter = serviceLayer.categoriesCounter;
    expect(
      await serviceLayer.addCategory(
        category.name,
        admin.userName,
        parentCategory.name
      )
    ).toEqual("The category was successfully added to the system");
    expect(
      counter === serviceLayer.categoriesCounter - 1 &&
        serviceLayer.categories.has(category.name)
    ).toEqual(true);
  });

  it("UnitTest-ServiceLayer- editCategory", async () => {
    serviceLayer.categories = new Map();
    const child = new Category(2, "milk", category.id);
    serviceLayer.categories.set(parentCategory.name, parentCategory.id);
    serviceLayer.categories.set(category.name, category.id);
    serviceLayer.categories.set(child.name, child.id);
    spyOn(cinemaSystem, "editCategory").and.returnValue(
      "The category was successfully updateded"
    );
    expect(
      await serviceLayer.editCategory("dummy", admin.userName, category.name)
    ).toEqual("The category doesn't exist");
    expect(
      await serviceLayer.editCategory(
        category.name,
        "dummy",
        parentCategory.name
      )
    ).toEqual("The user performing the operation does not exist in the system");
    expect(
      await serviceLayer.editCategory(child.name, admin.userName, "dummy")
    ).toEqual("The parent dummy does not exist");
    expect(
      await serviceLayer.editCategory(
        category.name,
        admin.userName,
        parentCategory.name
      )
    ).toEqual("The category was successfully updateded");
  });

  it("UnitTest-ServiceLayer- removeCategory", async () => {
    serviceLayer.categories = new Map();
    const child = new Category(2, "milk", category.id);
    serviceLayer.categories.set(parentCategory.name, parentCategory.id);
    serviceLayer.categories.set(category.name, category.id);
    serviceLayer.categories.set(child.name, child.id);
    spyOn(cinemaSystem, "removeCategory").and.returnValue(
      "The category was successfully removed"
    );
    expect(await serviceLayer.removeCategory("dummy", admin.userName)).toEqual(
      "The category doesn't exist"
    );
    expect(await serviceLayer.removeCategory(category.name, "dummy")).toEqual(
      "The user performing the operation does not exist in the system"
    );
    expect(serviceLayer.categories.has(category.name)).toEqual(true);
    expect(
      await serviceLayer.removeCategory(category.name, admin.userName)
    ).toEqual("The category was successfully removed");
    expect(serviceLayer.categories.has(category.name)).toEqual(false);
  });

  // =================================INTEGRATION==========================================================================================

  it("integration-CinemaSystem- addCategory", async () => {
    inventoryManagement.categories.delete(category.id);
    expect(
      await cinemaSystem.addCategory(
        category.id,
        category.name,
        category.parentId,
        admin.id - 10
      )
    ).toEqual(cinemaSystem.userOfflineMsg);
    expect(
      await cinemaSystem.addCategory(
        category.id,
        category.name,
        category.parentId,
        admin.id
      )
    ).toEqual("The category was successfully added to the system");
    expect(inventoryManagement.categories.has(category.id)).toEqual(true);
  });

  it("integration-CinemaSystem- editCategory", async () => {
    expect(
      await cinemaSystem.editCategory(
        category.id,
        category.parentId,
        admin.id - 10
      )
    ).toEqual(cinemaSystem.userOfflineMsg);
    expect(
      await cinemaSystem.editCategory(category.id, category.parentId, admin.id)
    ).toEqual("The category was successfully updateded");
  });

  it("integration-CinemaSystem- removeCategory", async () => {
    expect(
      await cinemaSystem.removeCategory(category.id, admin.id - 10)
    ).toEqual(cinemaSystem.userOfflineMsg);
    expect(await cinemaSystem.removeCategory(category.id, admin.id)).toEqual(
      "The category was successfully removed"
    );
    expect(inventoryManagement.categories.has(category.id)).toEqual(false);
  });

  it("integration-ServiceLayer- addCategory", async () => {
    inventoryManagement.categories.delete(category.id);
    serviceLayer.categories.set(parentCategory.name, parentCategory.id);
    serviceLayer.categories.delete(category.name);
    const child = new Category(2, "milk", category.id);
    serviceLayer.categoriesCounter = 10;
    expect(
      await serviceLayer.addCategory(
        category.id,
        admin.userName - 10,
        category.name
      )
    ).toEqual("The user performing the operation does not exist in the system");
    expect(
      await serviceLayer.addCategory(child.name, admin.userName, "dummy")
    ).toEqual("The parent dummy does not exist");
    let counter = serviceLayer.categoriesCounter;
    expect(
      await serviceLayer.addCategory(
        category.name,
        admin.userName,
        parentCategory.name
      )
    ).toEqual("The category was successfully added to the system");
    expect(
      counter === serviceLayer.categoriesCounter - 1 &&
        serviceLayer.categories.has(category.name)
    ).toEqual(true);
  });

  it("integration-ServiceLayer- editCategory", async () => {
    serviceLayer.categories = new Map();
    const child = new Category(2, "milk", category.id);
    serviceLayer.categories.set(parentCategory.name, parentCategory.id);
    serviceLayer.categories.set(category.name, category.id);
    serviceLayer.categories.set(child.name, child.id);
    expect(
      await serviceLayer.editCategory("dummy", admin.userName, category.name)
    ).toEqual("The category doesn't exist");
    expect(
      await serviceLayer.editCategory(
        category.name,
        "dummy",
        parentCategory.name
      )
    ).toEqual("The user performing the operation does not exist in the system");
    expect(
      await serviceLayer.editCategory(child.name, admin.userName, "dummy")
    ).toEqual("The parent dummy does not exist");
    expect(
      await serviceLayer.editCategory(
        category.name,
        admin.userName,
        parentCategory.name
      )
    ).toEqual("The category was successfully updateded");
  });

  it("integration-ServiceLayer- removeCategory", async () => {
    serviceLayer.categories = new Map();
    const child = new Category(2, "milk", category.id);
    serviceLayer.categories.set(parentCategory.name, parentCategory.id);
    serviceLayer.categories.set(category.name, category.id);
    serviceLayer.categories.set(child.name, child.id);
    expect(await serviceLayer.removeCategory("dummy", admin.userName)).toEqual(
      "The category doesn't exist"
    );
    expect(await serviceLayer.removeCategory(category.name, "dummy")).toEqual(
      "The user performing the operation does not exist in the system"
    );
    expect(serviceLayer.categories.has(category.name)).toEqual(true);
    expect(
      await serviceLayer.removeCategory(category.name, admin.userName)
    ).toEqual("The category was successfully removed");
    expect(serviceLayer.categories.has(category.name)).toEqual(false);
  });
});
