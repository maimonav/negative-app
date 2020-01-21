describe("EditEmployeeTest", () => {
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
        cinemaSystem.employeeManagemnt = employeeManagemnt;
        cinemaSystem.users.set(adminID, admin);
        servicelayer = new ServiceLayer();
        servicelayer.users.set(adminUserName, adminID);
        cinemaSystem.employeeManagement = employeeManagemnt;
        servicelayer.cinemaSystem = cinemaSystem;
    });
    it('UnitTest-EditEmployee Test on class Employee', () => {
        admin.editEmployee(adminUserName, permissions, "yuval", lname, contactDetails);
        expect(admin.firstName).toEqual("yuval");
    });

    it('UnitTest-EditEmployee Test on class EmployeeManager', () => {
        expect(employeeManagemnt.editEmployee(-1, permissions, fname, lname, contactDetails)).toEqual("The employee does not exist in the system.");
        expect(employeeManagemnt.editEmployee(adminID, permissions, fname, lname, contactDetails)).toEqual("Employee editing data ended successfully");

    });

    it('UnitTest-EditEmployee Test on class CinemaSystem', () => {
        spyOn(employeeManagemnt, 'editEmployee').and.returnValue('dummy');
        cinemaSystem.employeeManagement = employeeManagemnt;
        expect(cinemaSystem.editEmployee(adminID, adminPassword, permissions, fname, lname, contactDetails, adminID)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        expect(cinemaSystem.editEmployee("dummy user name", adminPassword, permissions, fname, lname, contactDetails, adminUserName)).toEqual("The id is not exists");
        expect(cinemaSystem.editEmployee(adminID, adminPassword, permissions, fname, lname, contactDetails, adminID)).toEqual("dummy");

    });

    it('UnitTest-EditEmployee Test on class ServiceLayer', () => {
        spyOn(cinemaSystem, 'editEmployee').and.returnValue('dummy');
        servicelayer.cinemaSystem = cinemaSystem;
        expect(servicelayer.editEmployee(-1, adminPassword, "Director", fname, lname, contactDetails, adminUserName)).toEqual("The employee does not exist");
        expect(servicelayer.editEmployee(adminUserName, "Director", adminPassword, fname, lname, contactDetails, adminUserName)).toEqual("dummy");

    });

    it('integration-EditEmployee Test on class CinemaSystem', () => {
        expect(cinemaSystem.editEmployee(adminID, adminPassword, fname, lname, contactDetails, adminID)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        expect(cinemaSystem.editEmployee("dummy user name", adminPassword, permissions, fname, lname, contactDetails, adminUserName)).toEqual("The id is not exists");
        expect(cinemaSystem.editEmployee(adminID, adminPassword, permissions, fname, lname, contactDetails, adminID)).toEqual("Employee editing data ended successfully");


    });

    it('integration-EditEmployee Test on class ServiceLayer', () => {
        admin.Loggedin = true;
        expect(servicelayer.editEmployee(-1, adminPassword, permissions, fname, lname, contactDetails, adminUserName)).toEqual("The employee does not exist");
        expect(servicelayer.editEmployee(adminUserName, adminPassword, permissions, fname, lname, contactDetails, adminUserName)).toEqual("Employee editing data ended successfully");

    });


});