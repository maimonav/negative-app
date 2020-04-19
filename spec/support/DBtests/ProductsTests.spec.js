const DB = require("../../../server/src/main/DataLayer/DBManager");

async function addMovieBeforeCategory() {
  console.log("START ADD MOVIE BEFORE\n");
  await DB.singleAdd("movie", {
    id: 0,
    name: "Spiderman",
    categoryId: 0,
  });
  await DB.singleGetById("movie", { id: 0 }).then((result) => {
    if (typeof result == "string")
      expect(result.includes("Database Error: Cannot complete action."));
    else if (result != null) fail("addMovieBeforeCategory failed");
  });
}

async function addCategory(id, name, isTest, parentId) {
  console.log("START ADD CATEGORY\n");
  await DB.singleAdd("category", {
    id: id,
    name: name,
    parentId: parentId ? parentId : -1,
  });
  if (isTest) {
    await DB.singleGetById("category", { id: id }).then((result) => {
      expect(result.id).toBe(id);
      expect(result.parentId).toBe(parentId ? parentId : -1);
      expect(result.name).toBe(name);
      expect(result.isCategoryRemoved).toBe(null);
    });
  }
}
exports.addCategory = addCategory;

async function testMovie(id, expected) {
  await DB.singleGetById("movie", { id: id }).then((result) => {
    expect(result.name).toBe(expected.name);
    expect(result.categoryId).toBe(expected.categoryId);
    expect(result.movieKey).toBe(expected.movieKey);
    expect(result.examinationRoom).toBe(expected.examinationRoom);
    if (expected.isMovieRemoved == null)
      expect(result.isMovieRemoved).toBe(expected.isMovieRemoved);
    else
      expect(result.isMovieRemoved.toISOString().substring(0, 10)).toBe(
        expected.isMovieRemoved.toISOString().substring(0, 10)
      );
  });
}
exports.testMovie = testMovie;

async function addMovieAfterCategory(id, name, isTest) {
  console.log("START ADD MOVIE AFTER\n");

  await DB.singleAdd("movie", {
    id: id ? id : 0,
    name: name ? name : "Spiderman",
    categoryId: 0,
  });

  if (isTest) {
    await testMovie(0, {
      id: id ? id : 0,
      name: name ? name : "Spiderman",
      categoryId: 0,
      movieKey: null,
      examinationRoom: null,
      isMovieRemoved: null,
    });
  }
}
exports.addMovieAfterCategory = addMovieAfterCategory;
async function addProductBeforeCategory() {
  console.log("START ADD PRODUCT BEFORE\n");
  await DB.singleAdd("cafeteria_product", {
    id: 0,
    name: "Coke",
    categoryId: 0,
    price: 5.9,
    quantity: 20,
    maxQuantity: 45,
    minQuantity: 10,
  });
  await DB.singleGetById("cafeteria_product", { id: 0 }).then((result) => {
    if (typeof result == "string")
      expect(result.includes("Database Error: Cannot complete action."));
    else if (result != null) fail("addProductBeforeCategory failed");
  });
}

async function testProduct(id, expected) {
  await DB.singleGetById("cafeteria_product", { id: id }).then((result) => {
    expect(result.name).toBe(expected.name);
    expect(result.categoryId).toBe(expected.categoryId);
    expect(result.price).toBe(expected.price);
    expect(result.quantity).toBe(expected.quantity);
    expect(result.maxQuantity).toBe(expected.maxQuantity);
    expect(result.minQuantity).toBe(expected.minQuantity);
    if (expected.isProductRemoved == null)
      expect(result.isProductRemoved).toBe(expected.isProductRemoved);
    else
      expect(result.isProductRemoved.toISOString().substring(0, 10)).toBe(
        expected.isProductRemoved.toISOString().substring(0, 10)
      );
  });
}

async function addProductAfterCategory(
  isTest,
  id,
  name,
  price,
  quantity,
  min,
  max
) {
  console.log("START ADD PRODUCT AFTER\n");

  let product = {
    id: id ? id : 0,
    name: name ? name : "Coke",
    categoryId: 0,
    price: price ? price : 5.9,
    quantity: quantity ? quantity : 20,
    maxQuantity: max ? max : 45,
    minQuantity: min ? min : 10,
    isProductRemoved: null,
  };

  await DB.singleAdd("cafeteria_product", product);
  if (isTest) {
    await testProduct(id ? id : 0, product);
  }
}
exports.addProductAfterCategory = addProductAfterCategory;
async function updateMovie() {
  console.log("START UPDATE MOVIE\n");
  await addCategory(1, "superhero", false);
  await DB.singleUpdate(
    "movie",
    { id: 0 },
    {
      name: "The Spiderman",
      categoryId: 1,
      movieKey: "X124C",
      examinationRoom: 4,
    }
  );
  await DB.singleGetById("movie", { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("The Spiderman");
    expect(result.categoryId).toBe(1);
    expect(result.movieKey).toBe("X124C");
    expect(result.examinationRoom).toBe(4);
  });
}

async function removeMovie(isTest) {
  console.log("START REMOVE MOVIE\n");
  await DB.singleUpdate("movie", { id: 0 }, { isMovieRemoved: new Date() });
  if (isTest)
    await DB.singleGetById("movie", { id: 0 }).then((result) => {
      expect(result.isMovieRemoved != null).toBe(true);
    });
}
exports.removeMovie = removeMovie;

async function updateProduct() {
  console.log("START UPDATE PRODUCT\n");
  await addCategory(1, "snacks", false);
  await DB.singleUpdate(
    "cafeteria_product",
    { id: 0 },
    {
      name: "KitKat",
      categoryId: 1,
      price: 4.9,
      quantity: 16,
      maxQuantity: 50,
      minQuantity: 0,
    }
  );
  await DB.singleGetById("cafeteria_product", { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("KitKat");
    expect(result.categoryId).toBe(1);
    expect(result.price).toBe(4.9);
    expect(result.quantity).toBe(16);
    expect(result.maxQuantity).toBe(50);
    expect(result.minQuantity).toBe(0);
  });
}

async function removeProduct(isTest) {
  console.log("START REMOVE PRODUCT\n");
  await DB.singleUpdate(
    "cafeteria_product",
    { id: 0 },
    { isProductRemoved: new Date() }
  );
  if (isTest)
    await DB.singleGetById("cafeteria_product", { id: 0 }).then((result) => {
      expect(result.isProductRemoved != null).toBe(true);
    });
}
exports.removeProduct = removeProduct;
async function removeCategoryBeforeUsed(isTest) {
  console.log("START REMOVE CATEGORY BEFORE\n");
  await DB.singleUpdate(
    "category",
    { id: 1 },
    { isCategoryRemoved: new Date() }
  );
  if (isTest)
    await DB.singleGetById("category", { id: 1 }).then((result) => {
      expect(result.isCategoryRemoved != null).toBe(true);
    });
}
exports.removeCategoryBeforeUsed = removeCategoryBeforeUsed;

async function removeCategoryAfterUsed() {
  console.log("START REMOVE CATEGORY AFTER\n");
  await DB.singleUpdate(
    "category",
    { id: 0 },
    { isCategoryRemoved: new Date() }
  );
  await DB.singleGetById("category", { id: 0 }).then((result) => {
    expect(result.isCategoryRemoved != null).toBe(false);
  });
}

async function updateCategory() {
  console.log("START UPDATE CATEGORY\n");
  await DB.singleUpdate("category", { id: 0 }, { name: "Snacks" });
  await DB.singleGetById("category", { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("Snacks");
  });
}

describe("DB Test - movies, products, category", function () {
  let sequelize;
  beforeEach(async function () {
    //create connection & mydb
    await DB.connectAndCreate("mydbTest");
    sequelize = await DB.initDB("mydbTest");
  });

  afterEach(async function () {
    //create connection & drop mydb
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE mydbTest");
    console.log("Database deleted");
  });

  it("init", async function () {
    //Testing connection
    await sequelize
      .authenticate()
      .catch((err) => fail("Unable to connect to the database:", err));
  });

  it("add movie & add category", async function () {
    await addMovieBeforeCategory();
    await addCategory(0, "fantasy", true);
    await addMovieAfterCategory(0, "Spiderman", true);
  });

  it("update movie", async function () {
    await addCategory(0, "fantasy", false);
    await addMovieAfterCategory();
    await updateMovie();
  });

  it("remove movie", async function () {
    await addCategory(0, "fantasy", false);
    await addMovieAfterCategory();
    await removeMovie(true);
  });

  it("remove category before and after being used", async function () {
    await addCategory(1, "fantasy", false);
    await removeCategoryBeforeUsed(true);
    await addCategory(0, "superhero", false);
    await addMovieAfterCategory();
    await removeCategoryAfterUsed();
  });

  it("add cafeteria product", async function () {
    await addProductBeforeCategory();
    await addCategory(0, "drinks", false);
    await addProductAfterCategory(true);
  });

  it("update cafeteria product", async function () {
    await addCategory(0, "drinks", false);
    await addProductAfterCategory();
    await updateProduct();
  });

  it("remove cafeteria product", async function () {
    await addCategory(0, "drinks", false);
    await addProductAfterCategory();
    await removeProduct(true);
  });

  it("update category", async function () {
    await addCategory(0, "drinks", false);
    await updateCategory();
  });
});
