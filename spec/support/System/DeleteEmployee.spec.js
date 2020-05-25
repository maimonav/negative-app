const DB = require("../../../server/src/main/DataLayer/DBManager");

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
    DB._testModeOn();
    adminID = 1;
    adminUserName = "adminUserName";
    adminPassword = "adminPassword";
    permissions = "DEPUTY_MANAGER";
    fname = "admin";
    lname = "admin";
    contactDetails = "tel.-123456789";
    employeeManagemnt = new EmployeeManagement();
    admin = new Employee(
      adminID,
      adminUserName,
      adminPassword,
      permissions,
      fname,
      lname,
      contactDetails
    );

    userID = 2;
    userUserName = "userUserName";
    userPassword = "userPassword";
    userpermissions = "EMPLOYEE";
    userfname = "user";
    userlname = "user";
    contactDetails = "tel.-123456789";
    user = new Employee(
      userID,
      userUserName,
      userPassword,
      userpermissions,
      userfname,
      userlname,
      contactDetails
    );

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

  it("UnitTest-DeleteEmployee Test on class EmployeeManager", async () => {
    expect(await employeeManagemnt.deleteEmployee(-1)).toEqual(
      "The employee does not exist in the system."
    );
    expect(await employeeManagemnt.deleteEmployee(userID)).toEqual(
      "Successfully deleted employee data deletion"
    );
  });
  it("UnitTest-DeleteEmployee Test on class CinemaSystem", async () => {
    spyOn(employeeManagemnt, "deleteEmployee").and.returnValue("dummy");
    cinemaSystem.employeeManagement = employeeManagemnt;
    admin.LoggedIn = true;
    expect(await cinemaSystem.deleteEmployee(adminID, adminID)).toEqual(
      "A user cannot erase himself"
    );
    user.LoggedIn = true;
    expect(await cinemaSystem.deleteEmployee(adminID, userID)).toEqual(
      cinemaSystem.inappropriatePermissionsMsg
    );
    user.LoggedIn = false;
    expect(await cinemaSystem.deleteEmployee(-1, adminID)).toEqual(
      "The id is not exists"
    );
    expect(await cinemaSystem.deleteEmployee(userID, adminID)).toEqual("dummy");
  });

  it("UnitTest-DeleteEmployee Test on class ServiceLayer", async () => {
    spyOn(cinemaSystem, "deleteEmployee").and.returnValue("dummy");
    servicelayer.cinemaSystem = cinemaSystem;
    admin.LoggedIn = true;
    expect(await servicelayer.deleteEmployee("dummy", adminUserName)).toEqual(
      "The employee does not exist"
    );
    expect(await servicelayer.deleteEmployee(userUserName, "dummy")).toEqual(
      "The user performing the operation does not exist in the system"
    );
    expect(
      await servicelayer.deleteEmployee(userUserName, adminUserName)
    ).toEqual("dummy");
  });

  it("integration-DeleteEmployee Test on class CinemaSystem", async () => {
    admin.LoggedIn = true;
    expect(await cinemaSystem.deleteEmployee(adminID, adminID)).toEqual(
      "A user cannot erase himself"
    );
    user.LoggedIn = true;
    expect(await cinemaSystem.deleteEmployee(adminID, userID)).toEqual(
      cinemaSystem.inappropriatePermissionsMsg
    );
    user.LoggedIn = false;
    expect(await cinemaSystem.deleteEmployee(-1, adminID)).toEqual(
      "The id is not exists"
    );
    expect(await cinemaSystem.deleteEmployee(userID, adminID)).toEqual(
      "Successfully deleted employee data deletion"
    );
  });

  it("integration-DeleteEmployee Test on class ServiceLayer", async () => {
    admin.LoggedIn = true;
    expect(await servicelayer.deleteEmployee("dummy", adminUserName)).toEqual(
      "The employee does not exist"
    );
    expect(await servicelayer.deleteEmployee(userUserName, "dummy")).toEqual(
      "The user performing the operation does not exist in the system"
    );
    expect(
      await servicelayer.deleteEmployee(userUserName, adminUserName)
    ).toEqual("Successfully deleted employee data deletion");
  });
});
