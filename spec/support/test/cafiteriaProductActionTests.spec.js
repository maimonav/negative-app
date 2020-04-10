describe("cafitriaProductActionTest", () => {

    const Employee = require("../../../server/src/main/Employee");
    const CinemaSystem = require("../../../server/src/main/CinemaSystem");
    const ServiceLayer = require("../../../server/src/main/ServiceLayer");
    const EmployeeManagemnt = require("../../../server/src/main/EmployeeManagement");
    const InventoryManagement = require("../../../server/src/main/InventoryManagement");
    const CafeteriaProduct = require("../../../server/src/main/CafeteriaProduct");


    beforeEach(() => {
        DB.testModeOn();
        const p1 = new CafeteriaProduct(-1, "milk", -1, 10, 1);

    });

    it('UnitTest-CafeteriaProduct edit', () => {
        let test = employeeManagemnt.addNewEmployee(adminID, adminUserName, adminPassword, permissions, fname, lname, contactDetails);
        test.password = admin.password;
        expect(test.equals(admin)).toBe(true);
        expect(employeeManagemnt.addNewEmployee(adminID, adminUserName, adminPassword, permissions, fname, lname, contactDetails)).toBe("The employee already exist");
    });

});