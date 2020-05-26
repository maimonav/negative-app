const DB = require("../../../server/src/main/DataLayer/DBManager");
const Movie = require("../../../server/src/main/Movie");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");

async function validate(serviceLayer, method, params) {
  Object.keys(params).forEach(async (key) => {
    let withEmptyParam = Object.keys(params).map((k) =>
      k === key ? "" : params[k]
    );
    let withUndefinedParam = Object.keys(params).map((k) =>
      k === key ? undefined : params[k]
    );
    let expected = key + "is not valid";
    let result = await method.apply(serviceLayer, withEmptyParam);
    expect(result).toBe(expected);
    result = await method.apply(serviceLayer, withUndefinedParam);
    expect(result).toBe(expected);
  });
}
exports.validate = validate;

async function validateEdit(serviceLayer, method, params) {
  Object.keys(params).forEach(async (key) => {
    let withEmptyParam = Object.keys(params).map((k) =>
      k === key ? "" : params[k]
    );
    let expected = key + "is not valid";
    let result = await method.apply(serviceLayer, withEmptyParam);
    expect(result).toBe(expected);
  });
}
exports.validateEdit = validateEdit;

describe("Movie Operations Tests", () => {
  beforeAll(() => {
    DB._testModeOn();
  });

  it("UnitTest addMovie - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();
    //Input validation
    validate(serviceLayer, serviceLayer.addMovie, {
      "Movie Name ": "Movie",
      "Category ": "fantasy",
      "Username ": "User",
    });

    serviceLayer.products.set("Movie", 1);
    let result = await serviceLayer.addMovie("Movie", "fantasy", "User");
    expect(result).toBe("The movie already exists");
    result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
    expect(result).toBe(
      "The user performing the operation does not exist in the system"
    );
    serviceLayer.users.set("User", 1);
    result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
    expect(result).toBe("The category does not exist");
  });

  it("UnitTest editMovie, removeMovie - Service Layer", async () => {
    let serviceLayer = new ServiceLayer();

    //Input validation
    validateEdit(serviceLayer, serviceLayer.editMovie, {
      "Movie Name ": "Movie",
      "Category ": "fantasy",
      "Key ": "key",
      "Examination Room ": "0",
      "Username ": "User",
    });
    validate(serviceLayer, serviceLayer.removeMovie, {
      "Movie Name ": "Movie",
      "Username ": "User",
    });

    await testServiceFunctions(serviceLayer, async () =>
      serviceLayer.editMovie("Movie", "fantasy", "key", "0", "User")
    );
    serviceLayer.users.set("User", 1);
    result = await serviceLayer.editMovie(
      "Movie",
      "fantasy",
      "key",
      "0",
      "User"
    );
    expect(result).toBe("The category does not exist");
    serviceLayer = new ServiceLayer();
    await testServiceFunctions(serviceLayer, async () =>
      serviceLayer.removeMovie("Movie", "User")
    );
  });

  it("UnitTest addMovie, editMovie, removeMovie - Cinema System", async () => {
    let cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, async () =>
      cinemaSystem.addMovie(1, "", 1, 1)
    );
    cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, async () =>
      cinemaSystem.editMovie(1, 1, "", 1, 1)
    );
    cinemaSystem = new CinemaSystem();
    await testCinemaFunctions(cinemaSystem, async () =>
      cinemaSystem.removeMovie(1, 1)
    );
  });

  it("UnitTest addMovie - Inventory Management", async () => {
    let inventoryManagement = new InventoryManagement();
    inventoryManagement.products.set(1, null);
    let result = await inventoryManagement.addMovie(1, "", 1, 1);
    expect(result).toBe("This movie already exists");
    inventoryManagement.products = new Map();
    result = await inventoryManagement.addMovie(1, "", 1, 1);
    expect(result).toBe("Category doesn't exist");
    inventoryManagement.categories.set(1, null);
    let movieExpected = new Movie(1, "", 1);
    result = await inventoryManagement.addMovie(1, "", 1);
    expect(result).toBe("The movie added successfully");
    let movieActual = inventoryManagement.products.get(1);
    expect(movieActual.equals(movieExpected)).toBe(true);
  });

  it("UnitTest editMovie, removeMovie - Inventory Management", async () => {
    let inventoryManagement = new InventoryManagement();
    let result = await inventoryManagement.editMovie(1);
    expect(result).toBe("The movie does not exist");
    let actualMovie = new Movie(1, "Movie", 1);
    inventoryManagement.products.set(1, actualMovie);
    result = await inventoryManagement.editMovie(1, 0);
    expect(result).toBe("Category doesn't exist");
    inventoryManagement.categories.set(1, null);
    result = await inventoryManagement.editMovie(1, 1, "key", -1);
    expect(result).toBe("The examination room is invalid");
    result = await inventoryManagement.editMovie(1, 1, "key", 1);
    expect(result).toBe("The movie edited successfully");
    let expectedMovie = new Movie(1, "Movie", 1);
    expectedMovie.movieKey = "key";
    expectedMovie.examinationRoom = 1;
    expect(actualMovie.equals(expectedMovie)).toBe(true);

    result = await inventoryManagement.removeMovie(1);
    expect(result).toBe("The movie removed successfully");
    expect(inventoryManagement.products.has(1)).toBe(false);
    result = await inventoryManagement.removeMovie(1);
    expect(result).toBe("The movie does not exist");
  });

  it("Integration addMovie", async () => {
    let serviceLayer = new ServiceLayer();
    let userId = serviceLayer.userCounter + 1;
    let categoryId = serviceLayer.categoriesCounter;
    let productId = serviceLayer.productsCounter;
    serviceLayer.users.set("User", userId);
    serviceLayer.categories.set("fantasy", categoryId);
    await testCinemaFunctions(serviceLayer.cinemaSystem, async () =>
      serviceLayer.addMovie("Movie", "fantasy", "User")
    );
    let user = { isLoggedIn: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(userId, user);
    serviceLayer.cinemaSystem.inventoryManagement.products.set(productId, null);
    let result = await serviceLayer.addMovie("Movie", "fantasy", "User");
    expect(result).toBe("This movie already exists");
    serviceLayer.cinemaSystem.inventoryManagement.products = new Map();
    result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
    expect(result).toBe("Category doesn't exist");
    serviceLayer.cinemaSystem.inventoryManagement.categories.set(
      categoryId,
      null
    );
    let movieExpected = new Movie(productId, "anotherMovie", categoryId);
    result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
    expect(result).toBe("The movie added successfully");
    let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(
      productId
    );
    expect(movieActual.equals(movieExpected)).toBe(true);
    result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
    expect(result).toBe("The movie already exists");
  });

  it("Integration editMovie", async () => {
    let serviceLayer = new ServiceLayer();
    serviceLayer.products.set("Movie", 1);
    serviceLayer.users.set("User", 1);
    serviceLayer.categories.set("fantasy", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, async () =>
      serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User")
    );
    user = { isLoggedIn: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    result = await serviceLayer.editMovie(
      "Movie",
      "fantasy",
      "key",
      "1",
      "User"
    );
    expect(result).toBe("The movie does not exist");
    serviceLayer.cinemaSystem.inventoryManagement.products.set(
      1,
      new Movie(1, "Movie", 1)
    );
    result = await serviceLayer.editMovie(
      "Movie",
      "fantasy",
      "key",
      "1",
      "User"
    );
    expect(result).toBe("Category doesn't exist");
    serviceLayer.cinemaSystem.inventoryManagement.categories.set(1, null);
    result = await serviceLayer.editMovie(
      "Movie",
      "fantasy",
      "key",
      "-1",
      "User"
    );
    expect(result).toBe("The examination room is invalid");
    let movieExpected = new Movie(1, "Movie", 1);
    movieExpected.movieKey = "key";
    movieExpected.examinationRoom = 1;
    result = await serviceLayer.editMovie(
      "Movie",
      "fantasy",
      "key",
      "1",
      "User"
    );
    expect(result).toBe("The movie edited successfully");
    let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(
      1
    );
    expect(movieActual.equals(movieExpected)).toBe(true);
  });

  it("Integration removeMovie", async () => {
    let serviceLayer = new ServiceLayer();
    serviceLayer.products.set("Movie", 1);
    serviceLayer.users.set("User", 1);
    serviceLayer.categories.set("fantasy", 1);
    await testCinemaFunctions(serviceLayer.cinemaSystem, () =>
      serviceLayer.removeMovie("Movie", "User")
    );
    user = { isLoggedIn: () => true, permissionCheck: () => true };
    serviceLayer.cinemaSystem.users.set(1, user);
    result = await serviceLayer.removeMovie("Movie", "User");
    expect(result).toBe("The movie does not exist");
    serviceLayer.cinemaSystem.inventoryManagement.products.set(
      1,
      new Movie(1, "Movie", 1)
    );
    result = await serviceLayer.removeMovie("Movie", "User");
    expect(result).toBe("The movie removed successfully");
    expect(serviceLayer.cinemaSystem.inventoryManagement.products.has(1)).toBe(
      false
    );
    result = await serviceLayer.removeMovie("Movie", "User");
    expect(result).toBe("The movie does not exist");
  });
});

async function testServiceFunctions(serviceLayer, method) {
  let result = await method();
  expect(result).toBe("The movie does not exist");
  serviceLayer.products.set("Movie", 1);
  result = await method();
  expect(result).toBe(
    "The user performing the operation does not exist in the system"
  );
}

async function testCinemaFunctions(
  cinemaSystem,
  method,
  isEmployeeTest,
  toAdd,
  userId
) {
  let result = await method();
  expect(result).toBe(
    "The operation cannot be completed - the user is not connected to the system"
  );
  let user = { isLoggedIn: () => false };
  let id = userId ? userId : 1;
  cinemaSystem.users.set(id, user);
  result = await method();
  expect(result).toBe(
    "The operation cannot be completed - the user is not connected to the system"
  );
  user = { isLoggedIn: () => true, permissionCheck: () => false };
  cinemaSystem.users.set(id, user);
  result = await method();
  expect(result).toBe("User does not have proper permissions");
  user = { isLoggedIn: () => true, permissionCheck: () => true };
  cinemaSystem.users.set(id, user);
  if (isEmployeeTest) {
    result = await method();
    expect(result).toBe(
      "Cannot create " + toAdd + " - only employees can create " + toAdd + "s"
    );
  }
  return cinemaSystem;
}
exports.testCinemaFunctions = testCinemaFunctions;
