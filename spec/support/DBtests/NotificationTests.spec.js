const { addUser } = require("./UserEmployeeTests.spec");
const DB = require("../../../server/src/main/DataLayer/DBManager");

async function testNotification(notification) {
  await DB.singleGetById("notification", {
    recipientUserId: notification.recipientUserId,
  }).then((result) => {
    expect(result.content).toEqual(notification.content);
    expect(result.seen).toBe(notification.seen);
  });
}
exports.testNotification = testNotification;

async function addNotificationBeforeUser(isTest) {
  console.log("START ADD NOTIFICATION BEFORE USER\n");
  let timeFired = new Date();
  let content = {
    type: "INFO",
    subtype: "LOW QUANTITY",
    content: [
      {
        name: "productName",
        quantity: "5",
        minQuantity: "10",
      },
    ],
  };
  await DB.singleAdd("notification", {
    recipientUserId: 0,
    timeFired: timeFired,
    content: content,
  });

  if (isTest)
    await DB.singleGetById("notification", {
      recipientUserId: 0,
      timeFired: timeFired,
    }).then((result) => {
      if (result != null) fail("addNotificationBeforeUser failed");
    });
}

async function addNotificationAfterUser(isTest) {
  console.log("START ADD NOTIFICATION AFTER USER\n");
  let timeFired = new Date();
  let content = {
    type: "INFO",
    subtype: "LOW QUANTITY",
    content: [
      {
        name: "productName",
        quantity: "5",
        minQuantity: "10",
      },
    ],
  };
  await DB.singleAdd("notification", {
    recipientUserId: 0,
    timeFired: timeFired,
    content: content,
  });
  if (isTest)
    testNotification({
      recipientUserId: 0,
      timeFired: timeFired,
      content: content,
      seen: false,
    });
}

exports.addNotificationAfterUser = addNotificationAfterUser;

async function updateNotification(isTest) {
  console.log("START UPDATE NOTIFICATION\n");
  let timeFired = new Date();
  let content = {
    type: "INFO",
    subtype: "LOW QUANTITY",
    content: [
      {
        name: "productName",
        quantity: "5",
        minQuantity: "10",
      },
    ],
  };
  await DB.singleUpdate(
    "notification",
    {
      recipientUserId: 0,
      timeFired: timeFired,
    },
    { seen: true }
  );
  if (isTest)
    testNotification({
      timeFired: timeFired,
      recipientUserId: 0,
      content: content,
      seen: true,
    });
}

describe("DB Tests - notification", function() {
  beforeEach(async function() {
    //create connection & mydb
    await DB.connectAndCreate("mydbTest");
    await DB.initDB("mydbTest");
  });

  afterEach(async function() {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
    console.log("Database deleted");
  });

  it("init", async function() {
    //Testing connection
    await DB.sequelize
      .authenticate()
      .catch((err) => fail("Unable to connect to the database:", err));
  });

  it("add notification", async function(done) {
    setTimeout(done, 400);
    await addNotificationBeforeUser(true);
    await addUser();
    setTimeout(async () => {
      await addNotificationAfterUser(true);
    }, 100);
  });

  it("update notification", async function(done) {
    setTimeout(done, 400);
    await addUser();
    await addNotificationAfterUser();
    setTimeout(async () => {
      await updateNotification(true);
    }, 100);
  });
});
