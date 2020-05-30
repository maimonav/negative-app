const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const DB = require("../../../server/src/main/DataLayer/DBManager");
const { createReport } = require("./ReportsReqTest.spec");
const fs = require("fs");

const types = [
  "incomes_daily_report",
  "inventory_daily_report",
  "general_purpose_daily_report",
  "movies_daily_report"
];

const relativeFilePath = fileName => `./server/src/main/reports/${fileName}`;

const fileNames = [
  relativeFilePath("Incomes Report"),
  relativeFilePath("Inventory Report"),
  relativeFilePath("General Report"),
  relativeFilePath("Movies Report")
];

describe("Json to excel", function() {
  let service = new ServiceLayer();
  let dbName = "fileTest";

  beforeEach(async function() {
    await service.initServiceLayer(dbName);
  });

  afterEach(async function() {
    //create connection & drop db
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("test", async () => {
    await createReport(service, new Date());
    service.login("admin", "admin");
    for (let i in types) {
      let result = await service.getReportFile(
        types[i],
        new Date(),
        new Date(),
        "admin"
      );
      let fileName = fileNames[i];
      expect(result[0], "The report download would start in a few seconds"); // TODO
      expect(result[1], ""); // TODO

      try {
        let res = !fs.existsSync(fileName);
        if (!res) {
          fail("File does not exist");
        } else fs.unlinkSync(fileName + ".xlsx");
      } catch (err) {
        fail("Error : test File" + err);
      }
    }
  }, 8000);
});
