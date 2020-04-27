const DB = require("../../../server/src/main/DataLayer/DBManager");
const { testMovie } = require("../DBtests/ProductsTests.spec");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");

describe("Movie Operations Tests", function () {
  let service = new ServiceLayer();
  let dbName = "movietest";

  beforeEach(async function () {
    await service.initSeviceLayer(dbName);
  });

  afterEach(async function () {
    //create connection & drop db
    await DB.close();
    await DB.connection.promise().query("DROP DATABASE " + dbName + ";");
    console.log("Database deleted");
  });

  it("addMovie req 2.1.2", async function () {
    let category = "categoryTest";
    let movie = "movieTest";
    let user = "admin";
    service.login(user, user);
    let result = await service.addMovie(movie, category, user);
    expect(result).toBe("The category does not exist");
    await service.addCategory(category, user);

    result = await service.addMovie(movie, category, user);
    expect(result).toBe("The movie added successfully");

    await testMovie(service.products.get(movie), {
      name: movie,
      categoryId: service.categories.get(category),
      movieKey: null,
      examinationRoom: null,
      isMovieRemoved: null,
    });

    result = await service.addMovie(movie, category, user);
    expect(result).toBe("The movie already exists");
  });

  it("editMovie req 2.1.3", async function () {
    let category = "categoryTest";
    let movie = "movieTest";
    let user = "admin";
    service.login(user, user);
    let result = await service.editMovie(movie, category, "key", "4", user);
    expect(result).toBe("The movie does not exist");
    result = await service.addCategory(category, user);

    await service.addMovie(movie, category, user);
    result = await service.addCategory(category + "2", user);
    result = await service.editMovie(movie, category + "2", "key", "4", user);
    expect(result).toBe("The movie edited successfully");

    await testMovie(service.products.get(movie), {
      name: movie,
      categoryId: service.categories.get(category + "2"),
      movieKey: "key",
      examinationRoom: 4,
      isMovieRemoved: null,
    });
  });

  it("removeMovie req 2.1.4", async function () {
    let category = "categoryTest";
    let movie = "movieTest";
    let user = "admin";
    service.login(user, user);
    let result = await service.removeMovie(movie, user);
    expect(result).toBe("The movie does not exist");
    result = await service.addCategory(category, user);
    await service.addMovie(movie, category, user);
    let movieId = service.products.get(movie);
    result = await service.removeMovie(movie, user);
    expect(result).toBe("The movie removed successfully");

    await testMovie(movieId, {
      name: movie,
      categoryId: service.categories.get(category),
      movieKey: null,
      examinationRoom: null,
      isMovieRemoved: new Date(),
    });
    result = await service.removeMovie(movie, user);
    expect(result).toBe("The movie does not exist");
  });
});
