const simpleLogger = require("simple-node-logger");
var fs = require("fs");

var LogController = (function() {
  let Logger = class {
    constructor(name) {
      this.name = name;
      this.year = new Date().getFullYear();
      this.filename = name + "_" + this.year + ".log";
      this.logger = simpleLogger.createSimpleLogger({
        logFilePath: this.filename,
        timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
      });
    }
    writeToLog(type, className, functionName, msg) {
      if (this.year !== new Date().getFullYear) {
        this.year = new Date().getFullYear();
        this.filename = this.name + "_" + this.year + ".log";
        this.logger = simpleLogger.createSimpleLogger({
          logFilePath: this.filename,
          timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
        });
      }
      this.logger.log(type, className + " - " + functionName + " - " + msg);
    }
    readLog(year) {
      if (typeof year === "undefined") return this._readFile(this.filename);
      else {
        return this._readFile(this.name + "_" + year + ".log");
      }
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
      fs.unlinkSync(this.filename);
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
