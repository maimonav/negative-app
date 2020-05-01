const DB = require("../../../server/src/main/DataLayer/DBManager");
const Employee = require("../../../server/src/main/Employee");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
let EmployeeManagemnt = require("../../../server/src/main/EmployeeManagement");
let Order = require("../../../server/src/main/Order");
let CafeteriaProductOrder = require("../../../server/src/main/CafeteriaProductOrder");

describe("editCafeteriaOrder", () => {
  beforeEach(() => {
    DB._testModeOn();
    order = new Order(
      -1,
      -1,
      new Date(1992, 9, 6),
      0,
      "admin , " + new Date(1992, 9, 6)
    );
  });

  it("UnitTest-addEmployee Test on class EmployeeManagemnt", async () => {});
});
