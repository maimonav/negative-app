const DB = require("../../../server/src/main/DataLayer/DBManager");
const Movie = require("../../../server/src/main/Movie");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");



async function validate(serviceLayer, method, params) {
    Object.keys(params).forEach(async (key) => {
        let withEmptyParam = Object.keys(params).map((k) => (k === key ? '' : params[k]));
        let withUndefinedParam = Object.keys(params).map((k) => (k === key ? undefined : params[k]));
        let expected = key + 'is not valid';
        let result = await method.apply(serviceLayer, withEmptyParam);
        expect(result).toBe(expected)
        result = await method.apply(serviceLayer, withUndefinedParam);
        expect(result).toBe(expected)

    })
}
exports.validate = validate;

describe("Movie Operations Tests", () => {

    beforeAll(() => {
        DB.testModeOn();
    });


    it('UnitTest addMovie - Service Layer', async () => {
        let serviceLayer = new ServiceLayer();
        //Input validation
        validate(serviceLayer, serviceLayer.addMovie, { 'Movie Name ': 'Movie', 'Category ': 'fantasy', 'Username ': 'User' })


        serviceLayer.products.set("Movie", 1);
        let result = await serviceLayer.addMovie("Movie", "fantasy", "User");
        expect(result).toBe("The movie already exists");
        result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The user performing the operation does not exist in the system");
        serviceLayer.users.set("User", 1);
        result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The category does not exist");
    });


    it('UnitTest editMovie, removeMovie - Service Layer', async () => {
        let serviceLayer = new ServiceLayer();

        //Input validation
        validate(serviceLayer, serviceLayer.editMovie, { 'Movie Name ': 'Movie', 'Category ': 'fantasy', 'Key ': "key", "Examination Room ": "0", 'Username ': 'User' })
        validate(serviceLayer, serviceLayer.removeMovie, { 'Movie Name ': 'Movie', 'Username ': 'User' })


        await testServiceFunctions(serviceLayer, async () => serviceLayer.editMovie("Movie", "fantasy", "key", "0", "User"));
        serviceLayer.users.set("User", 1);
        result = await serviceLayer.editMovie("Movie", "fantasy", "key", "0", "User");
        expect(result).toBe("The category does not exist");
        serviceLayer = new ServiceLayer();
        await testServiceFunctions(serviceLayer, async () => serviceLayer.removeMovie("Movie", "User"));

    });

    it('UnitTest addMovie, editMovie, removeMovie - Cinema System', async () => {
        let cinemaSystem = new CinemaSystem();
        await testCinemaFunctions(cinemaSystem, async () => cinemaSystem.addMovie(1, "", 1, 1));
        cinemaSystem = new CinemaSystem();
        await testCinemaFunctions(cinemaSystem, async () => cinemaSystem.editMovie(1, 1, "", 1, 1));
        cinemaSystem = new CinemaSystem();
        await testCinemaFunctions(cinemaSystem, async () => cinemaSystem.removeMovie(1, 1));

    });

    it('UnitTest addMovie - Inventory Management', async () => {
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

    it('UnitTest editMovie, removeMovie - Inventory Management', async () => {
        let inventoryManagement = new InventoryManagement();
        let result = await inventoryManagement.editMovie(1);
        expect(result).toBe("The movie does not exist");
        inventoryManagement.products.set(1, null);
        result = await inventoryManagement.editMovie(1);
        expect(result).toBe("Category doesn't exist");
        inventoryManagement.categories.set(1, null);



        inventoryManagement = new InventoryManagement();
        result = await inventoryManagement.removeMovie(1);
        expect(result).toBe("The movie does not exist");

    });

    it('UnitTest editMovie, removeMovie - Movie', async () => {
        //edit
        let expectedMovie = new Movie(1, "Movie", 1);
        expectedMovie.movieKey = "key";
        expectedMovie.examinationRoom = 1;
        let actualMovie = new Movie(1, "Movie", 1);
        expect(await actualMovie.editMovie(1, "key", 1)).toBe("The movie edited successfully");
        expect(expectedMovie.equals(actualMovie)).toBe(true);


        //remove
        expect(await expectedMovie.removeMovie()).toBe("The movie removed successfully");
        expect(expectedMovie.isMovieRemoved != null).toBe(true);
        expect(await expectedMovie.removeMovie()).toBe("The movie already removed");

    });


    it('Integration addMovie', async () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.users.set("User", 1);
        serviceLayer.categories.set("fantasy", 1);
        await testCinemaFunctions(serviceLayer.cinemaSystem, async () => serviceLayer.addMovie("Movie", "fantasy", "User"));
        let user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1, null);
        let result = await serviceLayer.addMovie("Movie", "fantasy", "User");
        expect(result).toBe("This movie already exists");
        serviceLayer.cinemaSystem.inventoryManagement.products = new Map();
        result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("Category doesn't exist");
        serviceLayer.cinemaSystem.inventoryManagement.categories.set(1, null);
        let movieExpected = new Movie(1, "anotherMovie", 1);
        result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The movie added successfully");
        let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(1);
        expect(movieActual.equals(movieExpected)).toBe(true);
        result = await serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The movie already exists");
    });

    it('Integration editMovie', async () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.products.set("Movie", 1);
        serviceLayer.users.set("User", 1);
        serviceLayer.categories.set("fantasy", 1);
        await testCinemaFunctions(serviceLayer.cinemaSystem, async () => serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User"));
        user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        result = await serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User");
        expect(result).toBe("The movie does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1, new Movie(1, "Movie", 1));
        result = await serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User");
        expect(result).toBe("Category doesn't exist");
        serviceLayer.cinemaSystem.inventoryManagement.categories.set(1, null);
        let movieExpected = new Movie(1, "Movie", 1);
        movieExpected.movieKey = "key";
        movieExpected.examinationRoom = 1;
        result = await serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User");
        expect(result).toBe("The movie edited successfully");
        let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(1);
        expect(movieActual.equals(movieExpected)).toBe(true);

    });


    it('Integration removeMovie', async () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.products.set("Movie", 1);
        serviceLayer.users.set("User", 1);
        serviceLayer.categories.set("fantasy", 1);
        await testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.removeMovie("Movie", "User"));
        user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        result = await serviceLayer.removeMovie("Movie", "User");
        expect(result).toBe("The movie does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1, new Movie(1, "Movie", 1));
        result = await serviceLayer.removeMovie("Movie", "User");
        expect(result).toBe("The movie removed successfully");
        let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(1);
        expect(movieActual.isMovieRemoved != null).toBe(true);
        result = await serviceLayer.removeMovie("Movie", "User");
        expect(result).toBe("The movie does not exist");

    });






});



async function testServiceFunctions(serviceLayer, method) {
    let result = await method();
    expect(result).toBe("The movie does not exist");
    serviceLayer.products.set("Movie", 1);
    result = await method();
    expect(result).toBe("The user performing the operation does not exist in the system");
}

async function testCinemaFunctions(cinemaSystem, method) {
    let result = await method();
    expect(result).toBe("The operation cannot be completed - the user is not connected to the system");
    let user = { isLoggedin: () => false };
    cinemaSystem.users.set(1, user);
    result = await method();
    expect(result).toBe("The operation cannot be completed - the user is not connected to the system");
    user = { isLoggedin: () => true, permissionCheck: () => false };
    cinemaSystem.users.set(1, user);
    result = await method();
    expect(result).toBe("User does not have proper permissions");
}
exports.testCinemaFunctions = testCinemaFunctions;
