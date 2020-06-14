const DB = require("../../../server/src/main/DataLayer/DBManager");
const { testNotification } = require("../DBtests/NotificationTests.spec");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");

describe("Notification Operations Tests", function() {
  let service = new ServiceLayer();
  let dbName = "notificationtest";

  beforeEach(async function() {
    await service.initServiceLayer(dbName);
  });

  afterEach(async function() {
    //create connection & drop db
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("Low quantity notify", async function(done) {
    setTimeout(done, 1000);
    let category = "categoryTest";
    let product = "productTest";
    let user = "admin";
    service.login(user, user);
    await service.addNewEmployee(
      "username",
      "password",
      "name",
      "last",
      "MANAGER",
      "contact",
      user
    );
    await service.addCategory(category, user, "");
    await service.addNewProduct(product, "10", "2", "2", "10", category, user);
    let content = {
      type: "INFO",
      subtype: "LOW QUANTITY",
      content: [
        {
          name: product,
          quantity: 2,
          minQuantity: 2,
        },
      ],
    };
    let userId = service.users.get("username");
    setTimeout(async () => {
      await testNotification({
        recipientUserId: userId,
        content: content,
        seen: false,
      });
      service.login("username", "password");
      await testNotification({
        recipientUserId: userId,
        content: content,
        seen: false,
      });
    }, 500);
  });

  it("High quantity notify", async function(done) {
    setTimeout(done, 1000);
    let category = "categoryTest";
    let product = "productTest";
    let user = "admin";
    service.login(user, user);
    await service.addNewEmployee(
      "username",
      "password",
      "name",
      "last",
      "MANAGER",
      "contact",
      user
    );
    await service.addCategory(category, user, "");
    await service.addNewProduct(product, "10", "10", "2", "10", category, user);
    let content = {
      type: "INFO",
      subtype: "HIGH QUANTITY",
      content: [
        {
          name: product,
          quantity: 10,
          maxQuantity: 10,
        },
      ],
    };
    let userId = service.users.get("username");
    setTimeout(async () => {
      await testNotification({
        recipientUserId: userId,
        content: content,
        seen: false,
      });
      service.login("username", "password");
      await testNotification({
        recipientUserId: userId,
        content: content,
        seen: false,
      });
    }, 500);
  });

  it("Movie examination", async function(done) {
    setTimeout(done, 2000);
    let movie = "movieTest";
    let order = "orderTest";
    let supplier = "supplierTest";
    let date = new Date();
    let user = "admin";
    service.login(user, user);
    await service.addNewSupplier(supplier, "contact", user);
    await service.addCategory("categoryTest", user, "");
    await service.addMovie(movie, "categoryTest", user);
    await service.addNewEmployee(
      "username",
      "password",
      "name",
      "last",
      "MANAGER",
      "contact",
      user
    );
    service.login("username", "password");
    await service.addMovieOrder(
      order,
      date,
      supplier,
      JSON.parse('["' + movie + '"]'),
      "username"
    );
    service.logout("username");
    await service.addNewEmployee(
      "employee",
      "password",
      "name",
      "last",
      "DEPUTY MANAGER",
      "contact",
      user
    );
    service.login("employee", "password");
    setTimeout(async () => {
      await service.confirmOrder(
        order,
        [
          {
            name: movie,
            key: "123",
            examinationRoom: "1",
            actualQuantity: 1,
          },
        ],
        "employee"
      );

      let content = {
        type: "INFO",
        subtype: "MOVIE EXAMINATION",
        content: [movie],
      };
      let userId = service.users.get("username");
      setTimeout(async () => {
        await testNotification({
          recipientUserId: userId,
          content: content,
          seen: false,
        });
        service.login("username", "password");
        setTimeout(async () => {
          await testNotification({
            recipientUserId: userId,
            content: content,
            seen: false,
          });
        }, 500);
      }, 500);
    }, 500);
  });
});
