const DB = require("../../../server/src/main/DataLayer/DBManager");



describe("addEmployeeTest", () => {
    let user;
    let correctUserName;
    let correctPassword;
    const Employee = require("../../../server/src/main/Employee");
    const CinemaSystem = require("../../../server/src/main/CinemaSystem");
    const ServiceLayer = require("../../../server/src/main/ServiceLayer");
    let EmployeeManagemnt = require("../../../server/src/main/EmployeeManagement");
    let servicelayer;
    let employeeManagemnt;
    let cinemaSystem;

    beforeEach(() => {
        DB.testModeOn();

        adminID = 1;
        adminUserName = "adminUserName";
        adminPassword = "adminPassword";
        permissions = 'ADMIN';
        fname = 'admin';
        lname = 'admin';
        contactDetails = 'tel.-123456789';

        admin = new Employee(adminID, adminUserName, adminUserName, permissions, fname, lname, contactDetails);
        cinemaSystem = new CinemaSystem();
        cinemaSystem.users.set(adminID, admin);
        servicelayer = new ServiceLayer();
        servicelayer.users.set(adminUserName, adminID);
        servicelayer.userCounter = 2;


        userID = 2;
        userUserName = "userUserName";
        userPassword = "adminPassword";
        userpermissions = "EMPLOYEE";
        adminpermissions = "ADMIN";
        userfname = 'admin';
        userlname = 'admin';
        usercontactDetails = 'tel.-123456789';

        employeeManagemnt = new EmployeeManagemnt();

        cinemaSystem.employeeManagement = employeeManagemnt;
        servicelayer.cinemaSystem = cinemaSystem



    });

    it('UnitTest-addEmployee Test on class EmployeeManagemnt', () => {
        let test = employeeManagemnt.addNewEmployee(adminID, adminUserName, adminPassword, permissions, fname, lname, contactDetails);
        test.password = admin.password;
        expect(test.equals(admin)).toBe(true);
        expect(employeeManagemnt.addNewEmployee(adminID, adminUserName, adminPassword, permissions, fname, lname, contactDetails)).toBe("The employee already exist");
    });

    it('UnitTest-addEmployee Test on class CinimaSystem', () => {
        spyOn(employeeManagemnt, 'addNewEmployee').and.returnValue('dummy');
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails, contactDetails, adminID)).toEqual(cinemaSystem.userOfflineMsg);

        admin.Loggedin = true;
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, adminpermissions, userfname, userlname, contactDetails, adminID)).toEqual("The employee registered successfully.");
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, adminpermissions, userfname, userlname, contactDetails, adminID)).toEqual('The id is already exists');

    });

    it('UnitTest-addEmployee Test on class ServiceLayer', () => {
        spyOn(cinemaSystem, 'addNewEmployee').and.returnValue("The employee registered successfully.");
        servicelayer.cinemaSystem = cinemaSystem;
        expectedUserCounter = servicelayer.userCounter + 1;
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userfname, userlname, userpermissions, usercontactDetails, "dummy")).toEqual("The user performing the operation does not exist in the system");
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userfname, userlname, userpermissions, usercontactDetails, adminUserName)).toEqual("The employee registered successfully.");
        expect(servicelayer.userCounter).toEqual(expectedUserCounter);
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userfname, userlname, userpermissions, usercontactDetails, adminUserName)).toEqual("The user already exist");

    });



    it('Integration-addEmployee Test on class CinimaSystem', () => {
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails, contactDetails, adminID)).toEqual(cinemaSystem.userOfflineMsg);

        admin.Loggedin = true;
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, contactDetails, adminID)).toEqual("The employee registered successfully.");
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, contactDetails, adminID)).toEqual('The id is already exists');

    });

    it('Integration-addEmployee Test on class ServiceLayer', () => {
        admin.Loggedin = true;
        expectedUserCounter = servicelayer.userCounter + 1;
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userfname, userlname, "not good permmision", usercontactDetails, adminUserName)).toEqual('The following data provided is invalid: Permission ');
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userfname, userlname, userpermissions, usercontactDetails, "dummy")).toEqual("The user performing the operation does not exist in the system");
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userfname, userlname, userpermissions, usercontactDetails, adminUserName)).toEqual("The employee registered successfully.");
        expect(servicelayer.userCounter).toEqual(expectedUserCounter);
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userfname, userlname, userpermissions, usercontactDetails, adminUserName)).toEqual("The user already exist");

    });
});