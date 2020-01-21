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

        userID = 2;
        userUserName = "userUserName";
        userPassword = "userPassword";
        userpermissions = [1];
        userfname = 'user';
        userlname = 'user';
        contactDetails = 'tel.-123456789';
        user = new Employee(userID, userUserName, userPassword, userpermissions, userfname, userlname, contactDetails);


        employeeManagemnt.employeeDictionary.set(adminID, admin);
        cinemaSystem = new CinemaSystem();
        cinemaSystem.users.set(adminID, admin);
        cinemaSystem.users.set(userID, user);

        servicelayer = new ServiceLayer();
        servicelayer.users.set(adminUserName, adminID);
        servicelayer.users.set(userUserName, userID);

        cinemaSystem.employeeManagement = employeeManagemnt;
        servicelayer.cinemaSystem = cinemaSystem;


        employeeManagemnt.employeeDictionary.set(adminID, admin);
        employeeManagemnt.employeeDictionary.set(userID, user);


    });

    it('UnitTest-DeleteEmployee Test on class EmployeeManager', () => {
        expect(employeeManagemnt.deleteEmployee(-1)).toEqual("The employee does not exist in the system.");
        expect(employeeManagemnt.deleteEmployee(userID)).toEqual("Successfully deleted employee data deletion");

    });
    it('UnitTest-DeleteEmployee Test on class CinemaSystem', () => {
        spyOn(employeeManagemnt, 'deleteEmployee').and.returnValue('dummy');
        cinemaSystem.employeeManagement = employeeManagemnt;
        admin.Loggedin = true;
        expect(cinemaSystem.deleteEmployee(adminID, adminID)).toEqual("A user cannot erase himself");
        user.Loggedin = true;
        expect(cinemaSystem.deleteEmployee(adminID, userID)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        user.Loggedin = false;
        expect(cinemaSystem.deleteEmployee(-1, adminID)).toEqual("The id is not exists");
        expect(cinemaSystem.deleteEmployee(userID, adminID)).toEqual("dummy");

    });

    it('UnitTest-DeleteEmployee Test on class ServiceLayer', () => {
        spyOn(cinemaSystem, 'deleteEmployee').and.returnValue('dummy');
        servicelayer.cinemaSystem = cinemaSystem;
        admin.Loggedin = true;
        expect(servicelayer.deleteEmployee("dummy", adminUserName)).toEqual("The employee does not exist");
        expect(servicelayer.deleteEmployee(userUserName, "dummy")).toEqual("The user performing the operation does not exist in the system");
        expect(servicelayer.deleteEmployee(userUserName, adminUserName)).toEqual("dummy");

    });

    it('integration-DeleteEmployee Test on class CinemaSystem', () => {
        admin.Loggedin = true;
        expect(cinemaSystem.deleteEmployee(adminID, adminID)).toEqual("A user cannot erase himself");
        user.Loggedin = true;
        expect(cinemaSystem.deleteEmployee(adminID, userID)).toEqual(cinemaSystem.inappropriatePermissionsMsg);
        user.Loggedin = false;
        expect(cinemaSystem.deleteEmployee(-1, adminID)).toEqual("The id is not exists");
        expect(cinemaSystem.deleteEmployee(userID, adminID)).toEqual("Successfully deleted employee data deletion");

    });

    it('integration-DeleteEmployee Test on class ServiceLayer', () => {
        admin.Loggedin = true;
        expect(servicelayer.deleteEmployee("dummy", adminUserName)).toEqual("The employee does not exist");
        expect(servicelayer.deleteEmployee(userUserName, "dummy")).toEqual("The user performing the operation does not exist in the system");
        expect(servicelayer.deleteEmployee(userUserName, adminUserName)).toEqual("Successfully deleted employee data deletion");
    });

});