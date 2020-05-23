const simpleLogger = require("simple-node-logger");
var fs = require("fs");

var LogController = (function() {
  let Logger = class {
    static testMode = false;
    constructor(name) {
      this.name = name;
      this.year = new Date().getFullYear();
      this.filename = name + "_" + this.year + ".log";
      this.filenameBackup = name + "_" + this.year + ".log";
      this.logger = simpleLogger.createSimpleLogger({
        logFilePath: this.filename,
        timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
      });
    }
    writeToLog(type, className, functionName, msg) {
      if (this.year !== new Date().getFullYear()) {
        this.year = new Date().getFullYear();
        this.filename = this.name + "_" + this.year + ".log";
        this.logger = simpleLogger.createSimpleLogger({
          logFilePath: this.filename,
          timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
        });
      }
      let loggerbackup = this.logger;
      if (this.testMode) {
        this.logger = simpleLogger.createSimpleLogger({
          logFilePath: "test_" + this.year + ".log",
          timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
        });
      }

      this.logger.log(type, className + " - " + functionName + " - " + msg);
      if (this.testMode) {
        this.logger = loggerbackup;
      }
    }
    readLog(year) {
      let fileNameBackup = this.filename;
      if (this.testMode) {
        this.filename = "test_" + this.year + ".log";
      }
      let output;
      if (typeof year === "undefined") {
        output = this._readFile(this.filename);
      } else {
        output = this._readFile(this.name + "_" + year + ".log");
      }
      this.filename = fileNameBackup;
      return output;
    }
    _readFile(fileName) {
      try {
        let output = fs.readFileSync(fileName, "utf8");
        return output;
      } catch {
        return "Read log fail.";
      }
    }
    removeFileForTest() {
      let fileNameBackup = this.filename;
      if (this.testMode) {
        this.filename = "test_" + this.year + ".log";
      }
      fs.unlinkSync(this.filename);
      this.filename = fileNameBackup;
    }
    testModeOn() {
      this.testMode = true;
    }
    testModeOff() {
      this.testMode = false;
    }
  };
  var instance_system;
  var instance_db;
  var instance_test;
  return {
    getInstance: function(name) {
      switch (name) {
        case "system": {
          if (typeof instance_system === "undefined") {
            instance_system = new Logger(name);
            instance_system.constructor = null;
          }
          return instance_system;
        }
        case "db": {
          if (typeof instance_db === "undefined") {
            instance_db = new Logger(name);
            instance_db.constructor = null;
          }
          return instance_db;
        }
        case "test": {
          if (typeof instance_test === "undefined") {
            instance_test = new Logger(name);
            instance_test.constructor = null;
          }
          return instance_test;
        }
      }
    },
  };
})();

exports.LogController = LogController;
