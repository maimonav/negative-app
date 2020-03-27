const { createConnection, connectAndCreate, dropAndClose } = require("./connectAndCreate");
const DB = require("../../../server/src/main/DBManager");


async function addMovieBeforeCategory() {
  console.log("START ADD MOVIE BEFORE\n");
  try {
    await DB.add('movie', {
      id: 0,
      name: "Spiderman",
      categoryId: 0,
      movieKey: "X123C",
      examinationRoom: 5
    });
    await DB.getById('movie', { id: 0 }).then((result) => {
      if (result != null)
        fail("addMovieBeforeCategory failed");
    });
  }
  catch (error) { }
}

async function addCategory(id, name, isTest) {
  console.log("START ADD CATEGORY\n");
  await DB.add('category', {
    id: id,
    name: name
  });
  if (isTest) {
    await DB.getById('category', { id: id }).then((result) => {
      expect(result.id).toBe(id);
      expect(result.parentId).toBe(-1);
      expect(result.name).toBe(name);
      expect(result.isCategoryRemoved).toBe(null);
    });
  }
}
exports.addCategory = addCategory;
async function addMovieAfterCategory(isTest) {
  console.log("START ADD MOVIE AFTER\n");

  await DB.add('movie', {
    id: 0,
    name: "Spiderman",
    categoryId: 0,
    movieKey: "X123C",
    examinationRoom: 5
  });

  if (isTest) {
    await DB.getById('movie', { id: 0 }).then((result) => {
      expect(result.id).toBe(0);
      expect(result.name).toBe("Spiderman");
      expect(result.categoryId).toBe(0);
      expect(result.movieKey).toBe("X123C");
      expect(result.examinationRoom).toBe(5);
    });
  }

}
exports.addMovieAfterCategory = addMovieAfterCategory;
async function addProductBeforeCategory() {
  console.log("START ADD PRODUCT BEFORE\n");
  try {

    await DB.add('cafeteria_product', {
      id: 0,
      name: "Coke",
      categoryId: 0,
      price: 5.90,
      quantity: 20,
      maxQuantity: 45,
      minQuantity: 10
    });
    await DB.getById('cafeteria_product', { id: 0 }).then((result) => {
      if (result != null)
        fail("addProductBeforeCategory failed");
    });
  }
  catch (error) { }
}

async function addProductAfterCategory(isTest) {
  console.log("START ADD PRODUCT AFTER\n");

  await DB.add('cafeteria_product', {
    id: 0,
    name: "Coke",
    categoryId: 0,
    price: 5.90,
    quantity: 20,
    maxQuantity: 45,
    minQuantity: 10
  });
  if (isTest) {
    await DB.getById('cafeteria_product', { id: 0 }).then((result) => {
      expect(result.id).toBe(0);
      expect(result.name).toBe("Coke");
      expect(result.categoryId).toBe(0);
      expect(result.price).toBe(5.90);
      expect(result.quantity).toBe(20);
      expect(result.maxQuantity).toBe(45);
      expect(result.minQuantity).toBe(10);
      expect(result.isProductRemoved).toBe(null);

    });

    await DB.getById('category', { id: 0 }).then((result) => {
      expect(result.isCategoryUsed).toBe(true);
    });
  }
}
exports.addProductAfterCategory = addProductAfterCategory;
async function updateMovie() {
  console.log("START UPDATE MOVIE\n");
  await addCategory(1, "superhero", false);
  await DB.update('movie', { id: 0 }, { name: "The Spiderman", categoryId: 1, movieKey: "X124C", examinationRoom: 4 });
  await DB.getById('movie', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("The Spiderman");
    expect(result.categoryId).toBe(1);
    expect(result.movieKey).toBe("X124C");
    expect(result.examinationRoom).toBe(4);
  });

}

async function removeMovie(isTest) {
  console.log("START REMOVE MOVIE\n");
  await DB.update('movie', { id: 0 }, { isMovieRemoved: new Date() });
  if (isTest)
    await DB.getById('movie', { id: 0 }).then((result) => {
      expect(result.isMovieRemoved != null).toBe(true);
    });

}
exports.removeMovie = removeMovie;


async function updateProduct() {
  console.log("START UPDATE PRODUCT\n");
  await addCategory(1, "snacks", false);
  await DB.update('cafeteria_product', { id: 0 }, { name: "KitKat", categoryId: 1, price: 4.90, quantity: 16, maxQuantity: 50, minQuantity: 0 });
  await DB.getById('cafeteria_product', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("KitKat");
    expect(result.categoryId).toBe(1);
    expect(result.price).toBe(4.90);
    expect(result.quantity).toBe(16);
    expect(result.maxQuantity).toBe(50);
    expect(result.minQuantity).toBe(0);
  });

}

async function removeProduct(isTest) {
  console.log("START REMOVE PRODUCT\n");
  await DB.update('cafeteria_product', { id: 0 }, { isProductRemoved: new Date() });
  if (isTest)
    await DB.getById('cafeteria_product', { id: 0 }).then((result) => {
      expect(result.isProductRemoved != null).toBe(true);
    });

}
exports.removeProduct = removeProduct;
async function removeCategoryBeforeUsed(isTest) {
  console.log("START REMOVE CATEGORY BEFORE\n");
  await DB.update('category', { id: 1 }, { isCategoryRemoved: new Date() });
  if (isTest)
    await DB.getById('category', { id: 1 }).then((result) => {
      expect(result.isCategoryRemoved != null).toBe(true);
    });
}
exports.removeCategoryBeforeUsed = removeCategoryBeforeUsed;
async function removeCategoryAfterUsed() {
  console.log("START REMOVE CATEGORY AFTER\n");
  await DB.update('category', { id: 0 }, { isCategoryRemoved: new Date() });
  await DB.getById('category', { id: 0 }).then((result) => {
    expect(result.isCategoryRemoved).toBe(null);
  });

}

async function updateCategory() {
  console.log("START UPDATE CATEGORY\n");
  await DB.update('category', { id: 0 }, { name: "Snacks" });
  await DB.getById('category', { id: 0 }).then((result) => {
    expect(result.id).toBe(0);
    expect(result.name).toBe("Snacks");
  });

}

describe("DB Test - movies, products, category", function () {

  let sequelize;
  beforeEach(async function () {
    //create connection & mydb
    var con = createConnection();
    await connectAndCreate(con);
    sequelize = await DB.initDB('mydbTest');
  });

  afterEach(async function () {
    //create connection & drop mydb
    con = createConnection();
    await dropAndClose(con);
  });


  it("init", async function () {
    //Testing connection
    await sequelize.authenticate().catch(err => fail('Unable to connect to the database:', err));
  });


  it("add movie & add category", async function () {
    await addMovieBeforeCategory();
    await addCategory(0, "fantasy", true);
    await addMovieAfterCategory(true);

  });

  it("update movie", async function () {
    await addCategory(0, "fantasy", false);
    await addMovieAfterCategory(false);
    await updateMovie();
  });

  it("remove movie", async function () {
    await addCategory(0, "fantasy", false);
    await addMovieAfterCategory(false);
    await removeMovie(true);
  });

  it("remove category before and after being used", async function () {
    await addCategory(1, "fantasy", false);
    await removeCategoryBeforeUsed(true);
    await addCategory(0, "superhero", false);
    await addMovieAfterCategory(false);
    await removeCategoryAfterUsed();

  });

  it("add cafeteria product", async function () {
    await addProductBeforeCategory();
    await addCategory(0, "drinks", false);
    await addProductAfterCategory();

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