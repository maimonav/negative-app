const {
  addUser,
  addEmployee,
  removeEmployee,
} = require("./UserEmployeeTests.spec");
const { addNotificationAfterUser } = require("./NotificationTests.spec");

const {
  addIncomesDailyReport,
  addMoviesDailyReport,
  addGeneralPurposeDailyReport,
  addInventoryDailyReport,
  getSyncDateFormat,
} = require("./ReportsTests.spec");
const {
  addCategory,
  addMovieAfterCategory,
  addProductAfterCategory,
  removeMovie,
  removeProduct,
  removeCategoryBeforeUsed,
} = require("./ProductsTests.spec");
const {
  addSupplier,
  removeSupplier,
  addOrderAftereSupplierCreator,
} = require("./OrdersTests.spec");
const DB = require("../../../server/src/main/DataLayer/DBManager");

async function getRecord(model, where, isRecordExists, failMsg) {
  await DB.singleGetById(model, where).then((result) => {
    let cond = isRecordExists ? result == null : result != null;
    if (cond) fail(failMsg);
  });
}

describe("DB Test - destroy timer", function() {
  let sequelize;

  beforeAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000;
  });

  beforeEach(async function() {
    //create connection & mydb
    await DB.connectAndCreate("mydbTest");
    sequelize = await DB.initDB("mydbTest");
  });

  afterEach(async function() {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
    console.log("Database deleted");
  });

  it("delete incomes reports after time test", async function(done) {
    await addIncomesDailyReport();
    await deleteModel(
      "incomes_daily_report",
      "incomes_daily_reports",
      true,
      { date: getSyncDateFormat(new Date("2020-03-02 00:00:00")) },
      6000,
      done
    );
  });

  it("delete movies reports after time test", async function(done) {
    await addMoviesDailyReport();
    await deleteModel(
      "movies_daily_report",
      "movies_daily_reports",
      true,
      { date: getSyncDateFormat(new Date("2020-03-02 00:00:00")) },
      6000,
      done
    );
  });

  it("delete general purpose reports after time test", async function(done) {
    await addGeneralPurposeDailyReport();
    await deleteModel(
      "general_purpose_daily_report",
      "general_purpose_daily_reports",
      true,
      { date: getSyncDateFormat(new Date("2020-03-02 00:00:00")) },
      6000,
      done
    );
  });

  it("delete inventory reports after time test", async function(done) {
    await addInventoryDailyReport();
    await deleteModel(
      "inventory_daily_report",
      "inventory_daily_reports",
      true,
      { date: getSyncDateFormat(new Date("2020-03-02 00:00:00")) },
      6000,
      done
    );
  });

  it("delete user after time test", async function(done) {
    await DB.singleAdd("user", {
      id: 0,
      username: "admin",
      password: "admin",
      permissions: "ADMIN",
      isUserRemoved: new Date(),
    });
    await deleteModel(
      "user",
      "users",
      false,
      { id: 0 },
      6000,
      done,
      "isUserRemoved"
    );
  });

  it("delete employee after time test", async function(done) {
    await removeEmployee(1);
    await deleteModel(
      "employee",
      "employees",
      false,
      { id: 1 },
      6000,
      done,
      "isEmployeeRemoved"
    );
  });

  it("delete category after time test", async function(done) {
    await addCategory(1, "testCategory");
    await removeCategoryBeforeUsed();
    await deleteModel(
      "category",
      "categories",
      false,
      { id: 1 },
      6000,
      done,
      "isCategoryRemoved"
    );
  });

  it("delete movie after time test", async function(done) {
    await addCategory(0, "testCategory");
    await addMovieAfterCategory();
    await removeMovie();
    await deleteModel(
      "movie",
      "movies",
      false,
      { id: 0 },
      6000,
      done,
      "isMovieRemoved"
    );
  });

  it("delete product after time test", async function(done) {
    await addCategory(0, "testCategory");
    await addProductAfterCategory();
    await removeProduct();
    await deleteModel(
      "cafeteria_product",
      "cafeteria_products",
      false,
      { id: 0 },
      6000,
      done,
      "isProductRemoved"
    );
  });

  it("delete supplier after time test", async function(done) {
    let destroyObject = {
      table: "suppliers",
      afterCreate: false,
      deleteTime: "3 SECOND",
      eventTime: "1 SECOND",
      prop: "isSupplierRemoved",
    };
    await DB.singleAdd(
      "supplier",
      {
        id: 0,
        name: "Shupersal",
        contactDetails: "089266584",
      },
      true,
      destroyObject
    );
    await removeSupplier(0);
    await deleteModel(
      "supplier",
      "suppliers",
      false,
      { id: 0 },
      6000,
      done,
      "isSupplierRemoved"
    );
  });

  it("delete order after time test", async function(done) {
    await addSupplier(0);
    await addEmployee(0);
    await addOrderAftereSupplierCreator(0);
    await deleteModel("order", "orders", true, { id: 0 }, 6000, done);
  });

  it("delete movie order after time test", async function(done) {
    await addSupplier(0);
    await addEmployee(0);
    await addCategory(0, "testCategory");
    await addMovieAfterCategory();
    await addOrderAftereSupplierCreator(0);
    await DB.singleAdd("movie_order", {
      orderId: 0,
      movieId: 0,
      expectedQuantity: 1,
    });
    await deleteModel(
      "movie_order",
      "movie_orders",
      true,
      { orderId: 0, movieId: 0 },
      10000,
      done
    );
  });

  it("delete product order after time test", async function(done) {
    await addSupplier(0);
    await addEmployee(0);
    await addCategory(0, "testCategory");
    await addProductAfterCategory();
    await addOrderAftereSupplierCreator(0);
    await DB.singleAdd("cafeteria_product_order", {
      orderId: 0,
      productId: 0,
      expectedQuantity: 2,
    });
    await deleteModel(
      "cafeteria_product_order",
      "cafeteria_product_orders",
      true,
      { orderId: 0, productId: 0 },
      10000,
      done
    );
  });

  it("delete notification after time test", async function(done) {
    await addUser();
    let date = new Date();
    await addNotificationAfterUser(date);
    await deleteModel(
      "notification",
      "notifications",
      true,
      {
        recipientUserId: 0,
        timeFired: date,
      },
      6000,
      done
    );
  });
});
async function deleteModel(model, table, afterCreate, where, time, done, prop) {
  setTimeout(done, time);
  await DB.singleSetDestroyTimer(
    table,
    afterCreate,
    "3 SECOND",
    "1 SECOND",
    prop
  );
  await getRecord(model, where, true, table + " - before event failed").then(
    async () => {
      setTimeout(async function() {
        await getRecord(model, where, false, table + " - after event failed");
      }, 4000);
    }
  );
}
