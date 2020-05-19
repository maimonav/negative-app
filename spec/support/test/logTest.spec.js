const DB = require("../../../server/src/main/DataLayer/DBManager");
const LogControllerFile = require("../../../server/src/main/LogController");
const LogController = LogControllerFile.LogController;

// let logger;

describe("Log_Test", () => {
  beforeEach(() => {
    DB._testModeOn();
    LogController.instance_test = undefined;
  });
  it("UnitTest-write and read from log test", () => {
    let logger = LogController.getInstance("test");
    logger.writeToLog("info", "test", "test", "test");
    expect(logger.readLog().includes("INFO  test - test - test ")).toBe(true);
    logger.removeFileForTest();
  });
});
