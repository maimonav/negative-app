const DB = require("../../../server/src/main/DataLayer/DBManager");


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
        DB.testModeOn();
        adminID = 1;
        adminUserName = "adminUserName";
        adminPassword = "adminPassword";
        permissions = 'DEPUTY_MANAGER';
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
    it('UnitTest-EditEmployee Test on class Employee', async() => {
        await admin.editEmployee(null, null, "yuval");
        expect(admin.firstName).toEqual("yuval");
    });

    it('UnitTest-EditEmployee Test on class EmployeeManager', async() => {
        expect(await employeeManagemnt.editEmployee(-1, permissions, fname, lname, contactDetails)).toEqual("The employee does not exist in the system.");
        expect(await employeeManagemnt.editEmployee(adminID, null, null, 'dummy')).toEqual("The Employee edited successfully");
        expect(admin.firstName).toEqual('dummy');

    });

    it('UnitTest-EditEmployee Test on class CinemaSystem', async() => {
        spyOn(employeeManagemnt, 'editEmployee').and.returnValue('dummy');
        cinemaSystem.employeeManagement = employeeManagemnt;
        expect(await cinemaSystem.editEmployee(adminID, adminPassword, permissions, fname, lname, contactDetails, adminID)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        expect(await cinemaSystem.editEmployee("dummy user name", adminPassword, permissions, fname, lname, contactDetails, adminUserName)).toEqual("The id is not exists");
        expect(await cinemaSystem.editEmployee(adminID, adminPassword, permissions, fname, lname, contactDetails, adminID)).toEqual("dummy");

    });

    it('UnitTest-EditEmployee Test on class ServiceLayer', async() => {
        spyOn(cinemaSystem, 'editEmployee').and.returnValue('dummy');
        servicelayer.cinemaSystem = cinemaSystem;
        expect(await servicelayer.editEmployee(-1, adminPassword, "Director", fname, lname, contactDetails, adminUserName)).toEqual("The employee does not exist");
        expect(await servicelayer.editEmployee(adminUserName, "Director", adminPassword, fname, lname, contactDetails, adminUserName)).toEqual("dummy");

    });

    it('integration-EditEmployee Test on class CinemaSystem', async() => {
        expect(await cinemaSystem.editEmployee(adminID, adminPassword, fname, lname, contactDetails, adminID)).toEqual(cinemaSystem.userOfflineMsg);
        admin.Loggedin = true;
        expect(await cinemaSystem.editEmployee("dummy user name", adminPassword, permissions, fname, lname, contactDetails, adminUserName)).toEqual("The id is not exists");
        expect(await cinemaSystem.editEmployee(adminID, adminPassword, permissions, fname, lname, contactDetails, adminID)).toEqual("The Employee edited successfully");


    });

    it('integration-EditEmployee Test on class ServiceLayer', async() => {
        admin.Loggedin = true;
        expect(await servicelayer.editEmployee(-1, adminPassword, permissions, fname, lname, contactDetails, adminUserName)).toEqual("The employee does not exist");
        expect(await servicelayer.editEmployee(adminUserName, null, null, 'dummy', null, null, adminUserName)).toEqual("The Employee edited successfully");
        expect(servicelayer.users.has(adminUserName)).toEqual(true);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.has(servicelayer.users.get(adminUserName))).toEqual(true);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).firstName).toEqual('dummy');
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).lastName).toEqual(lname);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).contactDetails).toEqual(contactDetails);

        expect(await servicelayer.editEmployee(adminUserName, null, null, fname, null, null, adminUserName)).toEqual("The Employee edited successfully");
        expect(await servicelayer.editEmployee(adminUserName, null, null, null, null, 'dummy', adminUserName)).toEqual("The Employee edited successfully");
        expect(servicelayer.users.has(adminUserName)).toEqual(true);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.has(servicelayer.users.get(adminUserName))).toEqual(true);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).firstName).toEqual(fname);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).lastName).toEqual(lname);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).contactDetails).toEqual('dummy');
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).permissions).toEqual(permissions);

        expect(await servicelayer.editEmployee(adminUserName, null, null, null, null, contactDetails, adminUserName)).toEqual("The Employee edited successfully");
        expect(await servicelayer.editEmployee(adminUserName, null, "EMPLOYEE", null, null, contactDetails, adminUserName)).toEqual("The Employee edited successfully");
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).firstName).toEqual(fname);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).lastName).toEqual(lname);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).contactDetails).toEqual(contactDetails);
        expect(servicelayer.cinemaSystem.employeeManagement.employeeDictionary.get(servicelayer.users.get(adminUserName)).permissions).toEqual('EMPLOYEE');

    });


});