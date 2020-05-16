const { addUser } = require("./UserEmployeeTests.spec");
const DB = require("../../../server/src/main/DataLayer/DBManager");

async function addNotificationBeforeUser(isTest) {
  console.log("START ADD NOTIFICATION BEFORE USER\n");
  let date = new Date();
  await DB.singleAdd("notification", {
    recipientUserId: 0,
    timeFired: date,
    content: JSON.stringify({
      type: "NOTIFICATION",
      subtype: "LOW QUANTITY",
      content: {
        name: "productName",
        quantity: "5",
        minQuantity: "10",
      },
    }),
  });

  if (isTest)
    await DB.singleGetById("notification", {
      recipientUserId: 0,
      timeFired: date,
    }).then((result) => {
      if (result != null) fail("addNotificationBeforeUser failed");
    });
}

async function addNotificationAfterUser(date, isTest) {
  console.log("START ADD NOTIFICATION AFTER USER\n");
  let content = JSON.stringify({
    type: "NOTIFICATION",
    subtype: "LOW QUANTITY",
    content: {
      name: "productName",
      quantity: "5",
      minQuantity: "10",
    },
  });
  await DB.singleAdd("notification", {
    recipientUserId: 0,
    timeFired: date,
    type: "INFO",
    subtype: "HIGH QUANTITY",
    content: content,
  });
  if (isTest)
    await DB.singleGetById("notification", {
      recipientUserId: 0,
      timeFired: date,
    }).then((result) => {
      expect(result.content).toBe(content);
      expect(result.seen).toBe(false);
    });
}

exports.addNotificationAfterUser = addNotificationAfterUser;

async function updateNotification(isTest) {
  console.log("START UPDATE NOTIFICATION\n");
  let date = new Date();
  await DB.singleUpdate(
    "notification",
    {
      recipientUserId: 0,
      timeFired: date,
    },
    { seen: true }
  );
  if (isTest)
    await DB.singleGetById("notification", {
      recipientUserId: 0,
      timeFired: date,
    }).then((result) => {
      expect(result.seen).toBe(true);
    });
}

describe("DB Tests - notification", function() {
  let sequelize;

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

  it("init", async function() {
    //Testing connection
    await sequelize
      .authenticate()
      .catch((err) => fail("Unable to connect to the database:", err));
  });

  it("add notification", async function() {
    await addNotificationBeforeUser(true);
    await addUser();
    await addNotificationAfterUser(new Date(), true);
  });

  it("update notification", async function() {
    await addUser();
    await addNotificationAfterUser(new Date());
    await updateNotification(true);
  });
});
