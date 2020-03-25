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

async function addCategory(id,name) {
  console.log("START ADD CATEGORY\n");
  await DB.add('category', {
    id: id,
    name: name
  });
  await DB.getById('category', { id: id }).then((result) => {
    expect(result.id).toBe(id);
    expect(result.parentId).toBe(-1);
    expect(result.name).toBe(name);
    expect(result.isCategoryRemoved).toBe(false);
  });
}
exports.addCategory = addCategory;
async function addMovieAfterCategory() {
  console.log("START ADD MOVIE AFTER\n");

  await DB.add('movie', {
    id: 0,
    name: "Spiderman",
    categoryId: 0,
    movieKey: "X123C",
    examinationRoom: 5
  });

}
exports.addMovieAfterCategory=addMovieAfterCategory;
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

  async function addProductAfterCategory() {
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

    await DB.getById('cafeteria_product', { id: 0 }).then((result) => {
      expect(result.id).toBe(0);
      expect(result.name).toBe("Coke");
      expect(result.categoryId).toBe(0);
      expect(result.price).toBe(5.90);
      expect(result.quantity).toBe(20);
      expect(result.maxQuantity).toBe(45);
      expect(result.minQuantity).toBe(10);
      expect(result.isProductRemoved).toBe(false);

    });
    await DB.getById('category', { id: 0 }).then((result) => {
      expect(result.isCategoryUsed).toBe(true);

    });
  }
  exports.addProductAfterCategory=addProductAfterCategory;
  async function updateMovie() {
    console.log("START UPDATE MOVIE\n");
    await addCategory(1, "superhero");
    await DB.update('movie', { id: 0 }, { name: "The Spiderman", categoryId: 1, movieKey: "X124C", examinationRoom: 4 });
    await DB.getById('movie', { id: 0 }).then((result) => {
      expect(result.id).toBe(0);
      expect(result.name).toBe("The Spiderman");
      expect(result.categoryId).toBe(1);
      expect(result.movieKey).toBe("X124C");
      expect(result.examinationRoom).toBe(4);
    });

  }

  async function removeMovie() {
    console.log("START REMOVE MOVIE\n");
    await DB.update('movie', { id: 0 }, { isMovieRemoved: true });
    await DB.getById('movie', { id: 0 }).then((result) => {
      expect(result.isMovieRemoved).toBe(true);
    });

  }


  async function updateProduct() {
    console.log("START UPDATE PRODUCT\n");
    await addCategory(1, "snacks");
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

  async function removeProduct() {
    console.log("START REMOVE PRODUCT\n");
    await DB.update('cafeteria_product', { id: 0 }, { isProductRemoved: true });
    await DB.getById('cafeteria_product', { id: 0 }).then((result) => {
      expect(result.isProductRemoved).toBe(true);
    });

  }

  async function removeCategoryBeforeUsed() {
    console.log("START REMOVE CATEGORY BEFORE\n");
    await DB.update('category', { id: 1 }, { isCategoryRemoved: true });
    await DB.getById('category', { id: 1 }).then((result) => {
      expect(result.isCategoryRemoved).toBe(true);
    });
  }

  async function removeCategoryAfterUsed() {
    console.log("START REMOVE CATEGORY AFTER\n");
    await DB.update('category', { id: 0 }, { isCategoryRemoved: true });
    await DB.getById('category', { id: 0 }).then((result) => {
      expect(result.isCategoryRemoved).toBe(false);
    });

  }

  async function updateCategory() {
    console.log("START UPDATE CATEGORY\n");
    await DB.update('category', { id: 0 }, { name: "Snacks" });
    await DB.getById('category', { id: 0 }).then((result) => {
      expect(result.id).toBe(0);
      expect(result.name).toBe( "Snacks");
    });

  }

  describe("DB Unit Testing - movies, products, category", function () {

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
      await addCategory(0, "fantasy");
      await addMovieAfterCategory();

    });

    it("update movie", async function () {
      await addCategory(0, "fantasy");
      await addMovieAfterCategory();
      await updateMovie();
    });

    it("remove movie", async function () {
      await addCategory(0, "fantasy");
      await addMovieAfterCategory();
      await removeMovie();
    });

    it("remove category before and after being used", async function () {
      await addCategory(1,"fantasy");
      await removeCategoryBeforeUsed();
      await addCategory(0,"superhero");
      await addMovieAfterCategory();
      await removeCategoryAfterUsed();

    });

    it("add cafeteria product", async function () {
      await addProductBeforeCategory();
      await addCategory(0, "drinks");
      await addProductAfterCategory();

    });

    it("update cafeteria product", async function () {
      await addCategory(0, "drinks");
      await addProductAfterCategory();
      await updateProduct();
    });

    it("remove cafeteria product", async function () {
      await addCategory(0, "drinks");
      await addProductAfterCategory();
      await removeProduct();
    });


    it("update category", async function () {
      await addCategory(0, "drinks");
      await updateCategory();

    });


  });