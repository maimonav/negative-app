describe("cafitriaProductActionTest", () => {

    const Employee = require("../../../server/src/main/Employee");
    const CinemaSystem = require("../../../server/src/main/CinemaSystem");
    const ServiceLayer = require("../../../server/src/main/ServiceLayer");
    const EmployeeManagemnt = require("../../../server/src/main/EmployeeManagement");
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
        DB.testModeOn();
        category = new Category(0, "Dairy", -1);
        p1 = new CafeteriaProduct(-1, "milk", category.id, 10, 1, null);
        inventoryManagement = new InventoryManagement();
        inventoryManagement.categories.set(category.id, category);
        cinemaSystem = new CinemaSystem('mydb');
        admin = new Employee(0, 'admin', '123456', 'ADMIN', 'admin', 'admin', '');
        cinemaSystem.inventoryManagement = inventoryManagement;
        cinemaSystem.users.set(admin.id, admin);

        serviceLayer = new ServiceLayer("mydb");
        serviceLayer.users = new Map();
        serviceLayer.products = new Map();
        serviceLayer.categories = new Map();
        serviceLayer.productsCounter = 0;

        serviceLayer.users.set(admin.userName, admin.id);
        serviceLayer.cinemaSystem = cinemaSystem;
        serviceLayer.categories.set(category.name, category.id);
    });
    it('UnitTest-CafeteriaProduct edit', () => {
        p1.categoryId = -1;
        expect(p1.name).toBe("milk");
        expect(p1.categoryId).toBe(-1);
        expect(p1.price).toBe(10);
        expect(p1.quantity).toBe(1);
        expect(p1.maxQuantity).toBe(9999999);
        expect(p1.minQuantity).toBe(0);
        p1.editProduct(-3, 20, 2, -1, 10) //Test that all the field update except the max because the quntity is under 0.
        expect(p1.categoryId).toBe(-3);
        expect(p1.price).toBe(20);
        expect(p1.quantity).toBe(2);
        expect(p1.maxQuantity).toBe(9999999);
        expect(p1.minQuantity).toBe(10);
        p1.editProduct(null, null, null, 20) //no update needed
        expect(p1.categoryId).toBe(-3);
        expect(p1.price).toBe(20);
        expect(p1.quantity).toBe(2);
        expect(p1.maxQuantity).toBe(20);
        expect(p1.minQuantity).toBe(10);
        p1.editProduct(null, null, null, 1, 22) //no update needed
        expect(p1.categoryId).toBe(-3);
        expect(p1.price).toBe(20);
        expect(p1.quantity).toBe(2);
        expect(p1.maxQuantity).toBe(20);
        expect(p1.minQuantity).toBe(10);

    });

    it('UnitTest-CafeteriaProduct remove', () => {
        //Note - Deleting products is done only by comparing days without hours and so we will ignore the hours in this test.
        expect(p1.isProductRemoved).toBe(null);
        p1.removeProduct();
        const p1RemovedDate = p1.isProductRemoved;
        p1RemovedDate.setHours(0, 0, 0, 0);
        const curDate = new Date();
        curDate.setHours(0, 0, 0, 0);
        expect(p1RemovedDate).toEqual(curDate);
    });

    it('UnitTest-InventoryManagement addCafeteriaProduct', async() => {
        expect(await inventoryManagement.addCafeteriaProduct(p1.id, p1.name, -1, p1.price, p1.quantity)).toEqual("Category doesn't exist");
        expect(await inventoryManagement.addCafeteriaProduct(p1.id, p1.name, p1.categoryId, -1, p1.quantity)).toEqual("Product price must be greater than 0");
        expect(await inventoryManagement.addCafeteriaProduct(p1.id, p1.name, p1.categoryId, p1.price, -1)).toEqual("Product quantity must be greater or equal to 0");
        expect(await inventoryManagement.addCafeteriaProduct(p1.id, p1.name, p1.categoryId, p1.price, p1.quantity, 1, 2)).toEqual("Maximum product quantity must be greater than minimum product quantity");
        expect(await inventoryManagement.addCafeteriaProduct(p1.id, p1.name, p1.categoryId, p1.price, p1.quantity)).toEqual("The product was successfully added to the system");
        expect(await inventoryManagement.addCafeteriaProduct(p1.id, p1.name, p1.categoryId, p1.price, p1.quantity)).toEqual("This product already exists");
    });

    it('UnitTest-InventoryManagement editCafeteriaProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        spyOn(p1, 'editProduct').and.returnValue('dummy');
        expect(await inventoryManagement.editCafeteriaProduct(p1.id - 1, p1.name, p1.categoryId, p1.price, p1.quantity)).toEqual("This product not exists");
        expect(await inventoryManagement.editCafeteriaProduct(p1.id, p1.name, p1.categoryId, p1.price, p1.quantity)).toEqual("dummy");
    });

    it('UnitTest-InventoryManagement removeCafeteriaProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        spyOn(p1, 'removeProduct').and.returnValue('dummy');
        expect(await inventoryManagement.removeCafeteriaProduct(p1.id - 1)).toEqual("This product not exists");
        expect(await inventoryManagement.removeCafeteriaProduct(p1.id)).toEqual("dummy"); //in the integration need to add more line like this
    });

    it('UnitTest-cinemaSystem- addCafeteriaProduct', async() => {
        spyOn(inventoryManagement, 'addCafeteriaProduct').and.returnValue('dummy');
        expect(await cinemaSystem.addCafeteriaProduct(p1.id, p1.name, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        admin.permissions = 'EMPLOYEE';
        expect(await cinemaSystem.addCafeteriaProduct(p1.id, p1.name, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        admin.permissions = 'ADMIN';
        expect(await cinemaSystem.addCafeteriaProduct(p1.id, p1.name, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual('dummy');

    });

    it('UnitTest-cinemaSystem- editCafeteriaProduct', async() => {
        spyOn(inventoryManagement, 'editCafeteriaProduct').and.returnValue('dummy');
        expect(await cinemaSystem.editCafeteriaProduct(p1.id, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        admin.permissions = 'EMPLOYEE';
        expect(await cinemaSystem.editCafeteriaProduct(p1.id, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        admin.permissions = 'ADMIN';
        expect(await cinemaSystem.editCafeteriaProduct(p1.id, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual('dummy');

    });

    it('UnitTest-cinemaSystem- removeCafeteriaProduct', async() => {
        spyOn(inventoryManagement, 'removeCafeteriaProduct').and.returnValue('dummy');
        expect(await cinemaSystem.removeCafeteriaProduct(p1.id, admin.id)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        admin.permissions = 'EMPLOYEE';
        expect(await cinemaSystem.removeCafeteriaProduct(p1.id, admin.id)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        admin.permissions = 'ADMIN';
        expect(await cinemaSystem.removeCafeteriaProduct(p1.id, admin.id)).toEqual('dummy');

    });

    it('UnitTest-ServiceLayer- addNewProduct', async() => {
        spyOn(cinemaSystem, 'addCafeteriaProduct').and.returnValue('dummy');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName + 'aaa')).toEqual('The user performing the operation does not exist in the system');
        expect(await serviceLayer.addNewProduct('', p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual('Product name is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, '', p1.quantity, 0, 100, category.name, admin.userName)).toEqual('Product price is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, '', 0, 100, category.name, admin.userName)).toEqual('Product quantity is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, '', admin.userName)).toEqual('Product category is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name + 'aaa', admin.userName)).toEqual('Product category does not exist');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual('dummy');
    });

    it('UnitTest-ServiceLayer- editProduct', async() => {
        spyOn(cinemaSystem, 'editCafeteriaProduct').and.returnValue('dummy');
        serviceLayer.products.set(p1.name, p1.id);
        expect(await serviceLayer.editProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName + 'aaa')).toEqual('The user performing the operation does not exist in the system');
        expect(await serviceLayer.editProduct('dummy', p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual('The product doesn\'t exist');
        expect(await serviceLayer.editProduct(p1.name, p1.price, p1.quantity, 0, 100, 'dummy', admin.userName)).toEqual('Product category does not exist');
        expect(await serviceLayer.editProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual('dummy');
    });

    it('UnitTest-ServiceLayer- removeProduct', async() => {
        spyOn(cinemaSystem, 'removeCafeteriaProduct').and.returnValue('dummy');
        serviceLayer.products.set(p1.name, p1.id);
        expect(await serviceLayer.removeProduct(p1.name, admin.userName + 'aaa')).toEqual('The user performing the operation does not exist in the system');
        expect(await serviceLayer.removeProduct('dummy', admin.userName)).toEqual('The product does not exist');
        expect(await serviceLayer.removeProduct(p1.name, admin.userName)).toEqual('dummy');
    });



    // ==================INTEGRATION ====================================================================================


    it('Integration-InventoryManagement editCafeteriaProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        expect(await inventoryManagement.editCafeteriaProduct(p1.id - 1, p1.name, p1.categoryId, p1.price, p1.quantity)).toEqual("This product not exists");
        expect(await inventoryManagement.editCafeteriaProduct(p1.id, p1.name, p1.categoryId, p1.price, p1.quantity)).toEqual("Product details update successfully completed");
    });

    it('Integration-InventoryManagement removeCafeteriaProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        expect(await inventoryManagement.removeCafeteriaProduct(p1.id - 1)).toEqual("This product not exists");
        expect(await inventoryManagement.removeCafeteriaProduct(p1.id)).toEqual("The product removed successfully"); //in the integration need to add more line like this
        expect(await inventoryManagement.removeCafeteriaProduct(p1.id)).toEqual("The product already removed");

    });

    it('Integration-cinemaSystem- addCafeteriaProduct', async() => {
        expect(await cinemaSystem.addCafeteriaProduct(p1.id, p1.name, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        admin.permissions = 'EMPLOYEE';
        expect(await cinemaSystem.addCafeteriaProduct(p1.id, p1.name, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        admin.permissions = 'ADMIN';
        expect(await cinemaSystem.addCafeteriaProduct(p1.id, p1.name, category.id, p1.price, p1.quantity, 1, 0, admin.id)).toEqual('The product was successfully added to the system');

    });

    it('Integration-cinemaSystem- editCafeteriaProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        expect(await cinemaSystem.editCafeteriaProduct(p1.id, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        admin.permissions = 'EMPLOYEE';
        expect(await cinemaSystem.editCafeteriaProduct(p1.id, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        admin.permissions = 'ADMIN';
        expect(await cinemaSystem.editCafeteriaProduct(p1.id, -1, p1.price, p1.quantity, 0, 0, admin.id)).toEqual("Product details update successfully completed");

    });

    it('Integration-cinemaSystem- removeCafeteriaProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        expect(await cinemaSystem.removeCafeteriaProduct(p1.id, admin.id)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        admin.permissions = 'EMPLOYEE';
        expect(await cinemaSystem.removeCafeteriaProduct(p1.id, admin.id)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        admin.permissions = 'ADMIN';
        expect(await cinemaSystem.removeCafeteriaProduct(p1.id, admin.id)).toEqual('The product removed successfully');

    });

    it('Integration-ServiceLayer- addNewProduct', async() => {
        admin.Loggedin = true;
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName + 'aaa')).toEqual('The user performing the operation does not exist in the system');
        expect(await serviceLayer.addNewProduct('', p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual('Product name is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, '', p1.quantity, 0, 100, category.name, admin.userName)).toEqual('Product price is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, '', 0, 100, category.name, admin.userName)).toEqual('Product quantity is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, '', admin.userName)).toEqual('Product category is not valid');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name + 'aaa', admin.userName)).toEqual('Product category does not exist');
        expect(await serviceLayer.addNewProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual('The product was successfully added to the system');
    });

    it('Integration-ServiceLayer- editProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        serviceLayer.products.set(p1.name, p1.id);
        admin.Loggedin = true;
        expect(await serviceLayer.editProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName + 'aaa')).toEqual('The user performing the operation does not exist in the system');
        expect(await serviceLayer.editProduct('dummy', p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual('The product doesn\'t exist');
        expect(await serviceLayer.editProduct(p1.name, p1.price, p1.quantity, 0, 100, 'dummy', admin.userName)).toEqual('Product category does not exist');
        expect(await serviceLayer.editProduct(p1.name, p1.price, p1.quantity, 0, 100, category.name, admin.userName)).toEqual("Product details update successfully completed");
    });

    it('Integration-ServiceLayer- removeProduct', async() => {
        inventoryManagement.products.set(p1.id, p1);
        serviceLayer.products.set(p1.name, p1.id);
        admin.Loggedin = true;
        serviceLayer.products.set(p1.name, p1.id);
        expect(await serviceLayer.removeProduct(p1.name, admin.userName + 'aaa')).toEqual('The user performing the operation does not exist in the system');
        expect(await serviceLayer.removeProduct('dummy', admin.userName)).toEqual('The product does not exist');
        expect(await serviceLayer.removeProduct(p1.name, admin.userName)).toEqual('The product removed successfully');
    });
});