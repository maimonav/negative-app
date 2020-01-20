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
        adminID = 1;
        adminUserName = "adminUserName";
        adminPassword = "adminPassword";
        permissions = [1, 2, 3];
        fname = 'admin';
        lname = 'admin';
        contactDetails = 'tel.-123456789';

        admin = new Employee(adminID, adminUserName, adminUserName, permissions, fname, lname, contactDetails);
        cinemaSystem = new CinemaSystem();
        cinemaSystem.users.set(adminID, admin);
        servicelayer = new ServiceLayer();
        servicelayer.users.set(adminUserName, adminID);

        userID = 2;
        userUserName = "userUserName";
        userPassword = "adminPassword";
        userpermissions = "User";
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
        expect(test).toEqual(admin);
        expect(employeeManagemnt.addNewEmployee(adminID, adminUserName, adminPassword, permissions, fname, lname, contactDetails)).toBe("The employee already exist");
    });

    it('UnitTest-addEmployee Test on class CinimaSystem', () => {
        spyOn(employeeManagemnt, 'addNewEmployee').and.returnValue('dummy');
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual("The employee registered successfully.");
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual('The id is already exists');

    });

    it('UnitTest-addEmployee Test on class ServiceLayer', () => {
        spyOn(cinemaSystem, 'addNewEmployee').and.returnValue("The employee registered successfully.");
        servicelayer.cinemaSystem = cinemaSystem;
        expectedUserCounter = servicelayer.userCounter + 1;
        expect(servicelayer.addNewEmployee(userUserName, userPassword, "not good permmision", userfname, userlname, usercontactDetails)).toEqual("No permissions were received for the user");
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual("The employee registered successfully.");
        expect(servicelayer.userCounter).toEqual(expectedUserCounter);
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual("The user already exist");

    });



    it('Integration-addEmployee Test on class CinimaSystem', () => {
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual("The employee registered successfully.");
        expect(cinemaSystem.addNewEmployee(userID, userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual('The id is already exists');

    });

    it('Integration-addEmployee Test on class ServiceLayer', () => {
        servicelayer.userCounter++;
        expectedUserCounter = servicelayer.userCounter + 1;
        expect(servicelayer.addNewEmployee(userUserName, userPassword, "not good permmision", userfname, userlname, usercontactDetails)).toEqual("No permissions were received for the user");
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual("The employee registered successfully.");
        expect(servicelayer.userCounter).toEqual(expectedUserCounter);
        expect(servicelayer.addNewEmployee(userUserName, userPassword, userpermissions, userfname, userlname, usercontactDetails)).toEqual("The user already exist");

    });
});