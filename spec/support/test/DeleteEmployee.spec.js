describe("DeleteEmployeeTest", () => {
    let user;
    let correctUserName;
    let correctPassword;
    const Employee = require("../../../server/src/main/Employee");
    const CinemaSystem = require("../../../server/src/main/CinemaSystem");
    const ServiceLayer = require("../../../server/src/main/ServiceLayer");
    let EmployeeManagement = require("../../../server/src/main/EmployeeManagement");
    let servicelayer;
    let employeeManagemnt;
    let cinemaSystem;

    beforeEach(() => {
        adminID = 1;
        adminUserName = "adminUserName";
        adminPassword = "adminPassword";
        permissions = [1, 2, 3];
        fname = 'admin';
        lname = 'admin';
        contactDetails = 'tel.-123456789';
        employeeManagemnt = new EmployeeManagement();
        admin = new Employee(adminID, adminUserName, adminPassword, permissions, fname, lname, contactDetails);

        employeeManagemnt.employeeDictionary.set(adminID, admin);
        cinemaSystem = new CinemaSystem();
        cinemaSystem.users.set(adminID, admin);
        servicelayer = new ServiceLayer();
        servicelayer.users.set(adminUserName, adminID);
        cinemaSystem.employeeManagement = employeeManagemnt;
        servicelayer.cinemaSystem = cinemaSystem;
    });

    it('UnitTest-DeleteEmployee Test on class EmployeeManager', () => {
        expect(employeeManagemnt.deleteEmployee(-1, permissions, fname, lname, contactDetails)).toEqual("The employee does not exist in the system.");
        expect(employeeManagemnt.deleteEmployee(adminID, permissions, fname, lname, contactDetails)).toEqual("Successfully deleted employee data deletion");

    });
    it('UnitTest-DeleteEmployee Test on class CinemaSystem', () => {
        spyOn(employeeManagemnt, 'deleteEmployee').and.returnValue('dummy');
        cinemaSystem.employeeManagement = employeeManagemnt;
        expect(cinemaSystem.deleteEmployee(-1, permissions, fname, lname, contactDetails)).toEqual("The id is not exists");
        expect(cinemaSystem.deleteEmployee(adminID, permissions, fname, lname, contactDetails)).toEqual("dummy");

    });

    it('UnitTest-DeleteEmployee Test on class ServiceLayer', () => {
        spyOn(cinemaSystem, 'deleteEmployee').and.returnValue('dummy');
        servicelayer.cinemaSystem = cinemaSystem;
        expect(servicelayer.deleteEmployee(-1, permissions, fname, lname, contactDetails)).toEqual("The employee does not exist");
        expect(servicelayer.deleteEmployee(adminUserName, permissions, fname, lname, contactDetails)).toEqual("dummy");

    });

    it('integration-DeleteEmployee Test on class CinemaSystem', () => {
        expect(cinemaSystem.deleteEmployee(-1, permissions, fname, lname, contactDetails)).toEqual("The id is not exists");
        expect(cinemaSystem.deleteEmployee(adminID, permissions, fname, lname, contactDetails)).toEqual("Successfully deleted employee data deletion");

    });

    it('integration-DeleteEmployee Test on class ServiceLayer', () => {
        expect(servicelayer.deleteEmployee(-1, permissions, fname, lname, contactDetails)).toEqual("The employee does not exist");
        expect(servicelayer.deleteEmployee(adminUserName, permissions, fname, lname, contactDetails)).toEqual("Successfully deleted employee data deletion");

    });

});