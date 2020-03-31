const DB = require("../../../server/src/main/DBManager");
const Supplier = require("../../../server/src/main/Supplier");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");
const { validate , testCinemaFunctions } = require("./MovieOperationsTests.spec")




describe("Supplier Operations Tests", () => {

    beforeAll(() => {
        DB.testModeOn();
    });


    it('UnitTest addSupplier ,editSupplier, removeSupplier - Service Layer', () => {
        let serviceLayer = new ServiceLayer();
        //Input validation
        validate(serviceLayer, serviceLayer.addNewSupplier, { 'Supplier Name ': 'Supplier', 'Contact Details ': '0500000000', 'Username ': 'User' })
        validate(serviceLayer, serviceLayer.editSupplier, { 'Supplier Name ': 'Supplier', 'Contact Details ': '0500000000', 'Username ': 'User' })
        validate(serviceLayer, serviceLayer.removeSupplier, { 'Supplier Name ': 'Supplier', 'Username ': 'User' })


        testServiceFunctions(serviceLayer, (name) => serviceLayer.addNewSupplier(name, '0500000000', 'User'),true);
        serviceLayer = new ServiceLayer();
        testServiceFunctions(serviceLayer, (name) => serviceLayer.editSupplier(name, '0500000000', 'User'));
        serviceLayer = new ServiceLayer();
        testServiceFunctions(serviceLayer, (name) => serviceLayer.removeSupplier(name, 'User'));


    });


    it('UnitTest addSupplier, editSupplier, removeSupplier - Cinema System', () => {
        let cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.addNewSupplier(1, "", 1, 1));
        cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.editSupplier(1, 1, "", 1, 1));
        cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.removeSupplier(1, 1));

    });

    it('UnitTest addSupplier - Inventory Management', () => {
        let inventoryManagement = new InventoryManagement();
        inventoryManagement.suppliers.set(1, null);
        let result = inventoryManagement.addNewSupplier(1, "Supplier", "050");
        expect(result).toBe("This supplier already exists");
        inventoryManagement.suppliers = new Map();
        result = inventoryManagement.addNewSupplier(1, "Supplier", "050");
        expect(result).toBe("The supplier added successfully");
        let supplierExpected = new Supplier(1, "Supplier", "050");
        let supplierActual = inventoryManagement.suppliers.get(1);
        expect(supplierActual.equals(supplierExpected)).toBe(true);

    });

    it('UnitTest editSupplier, removeSupplier - Inventory Management', () => {
        let inventoryManagement = new InventoryManagement();
        let result = inventoryManagement.editSupplier(1);
        expect(result).toBe("The supplier does not exist");


        inventoryManagement = new InventoryManagement();
        result = inventoryManagement.removeSupplier(1);
        expect(result).toBe("The supplier does not exist");

    });

    it('UnitTest editSupplier, removeSupplier - Supplier', () => {
        //edit
        let actualSupplier = new Supplier(1, "Supplier", "050");
        let expectedSupplier = new Supplier(1, "Sup", "052");
        expect(actualSupplier.editSupplier("Sup", "052")).toBe("The supplier edited successfully");
        expect(expectedSupplier.equals(actualSupplier)).toBe(true);


        //remove
        expect(expectedSupplier.removeSupplier()).toBe("The supplier removed successfully");
        expect(expectedSupplier.isSupplierRemoved != null).toBe(true);
        expect(expectedSupplier.removeSupplier()).toBe("The supplier already removed");

    });


    it('Integration addSupplier', () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.addNewSupplier("Supplier", "050","User"));
        let user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(1, null);
        let result = serviceLayer.addNewSupplier("Supplier", "050","User");
        expect(result).toBe("This supplier already exists");
        serviceLayer.cinemaSystem.inventoryManagement.suppliers = new Map();
        let supplierExpected = new Supplier(1, "anotherSupplier", "050");
        result = serviceLayer.addNewSupplier("anotherSupplier", "050","User");
        expect(result).toBe("The supplier added successfully");
        let supplierActual = serviceLayer.cinemaSystem.inventoryManagement.suppliers.get(1);
        expect(supplierActual.equals(supplierExpected)).toBe(true);
        result = serviceLayer.addNewSupplier("anotherSupplier", "050","User");
        expect(result).toBe("The supplier already exists");
    });

    it('Integration editSupplier', () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.suppliers.set("Supplier", 1);
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.editSupplier("Supplier", "050", "User"));
        user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        result = serviceLayer.editSupplier("Supplier", "050", "User");
        expect(result).toBe("The supplier does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(1, new Supplier(1, "Supplier", "050"));
        let supplierExpected = new Supplier(1, "Supplier", "052");
        result = serviceLayer.editSupplier("Supplier", "052", "User");
        expect(result).toBe("The supplier edited successfully");
        let supplierActual = serviceLayer.cinemaSystem.inventoryManagement.suppliers.get(1);
        expect(supplierActual.equals(supplierExpected)).toBe(true);

    });


    it('Integration removeSupplier', () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.suppliers.set("Supplier", 1);
        serviceLayer.users.set("User", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.removeSupplier("Supplier", "User"));
        user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        result = serviceLayer.removeSupplier("Supplier", "User");
        expect(result).toBe("The supplier does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(1, new Supplier(1, "Supplier", "050"));
        result = serviceLayer.removeSupplier("Supplier", "User");
        expect(result).toBe("The supplier removed successfully");
        let supplierActual = serviceLayer.cinemaSystem.inventoryManagement.suppliers.get(1);
        expect(supplierActual.isSupplierRemoved != null).toBe(true);
        result = serviceLayer.removeSupplier("Supplier", "User");
        expect(result).toBe("The supplier does not exist");

    });






});



function testServiceFunctions(serviceLayer, method, isAdd) {
    if (isAdd)
        serviceLayer.suppliers.set("Supplier", 1);
    let result = method("Supplier");
    if (isAdd)
        expect(result).toBe("The supplier already exists");
    else{
        expect(result).toBe("The supplier does not exist");
        serviceLayer.suppliers.set("Supplier", 1);
    }
    if(isAdd)
        result = method("anotherSupplier");
    else
        result = method("Supplier");
    expect(result).toBe("The user performing the operation does not exist in the system");
}


