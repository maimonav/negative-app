const DB = require("../../../server/src/main/DBManager");
const Movie = require("../../../server/src/main/Movie");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");




function validate(serviceLayer, method, params) {
    Object.keys(params).forEach((key)=>{
        let withEmptyParam = Object.keys(params).map((k) => ( k === key ? '' : params[k] ));
        let withUndefinedParam = Object.keys(params).map((k) => ( k === key ? undefined : params[k] ));
        let expected = key + 'is not valid';
        expect(method.apply(serviceLayer, withEmptyParam)).toBe(expected)
        expect(method.apply(serviceLayer, withUndefinedParam)).toBe(expected)

    })
}
exports.validate=validate;

describe("Movie Operations Tests", () => {

    beforeAll(() => {
        DB.testModeOn();
    });


    it('UnitTest addMovie - Service Layer', () => {
        let serviceLayer = new ServiceLayer();
        //Input validation
        validate(serviceLayer,serviceLayer.addMovie,{'Movie Name ':'Movie','Category ':'fantasy','Username ':'User'})


        serviceLayer.products.set("Movie", 1);
        let result = serviceLayer.addMovie("Movie", "fantasy", "User");
        expect(result).toBe("The movie already exists");
        result = serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The user performing the operation does not exist in the system");
        serviceLayer.users.set("User", 1);
        result = serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The category does not exist");
    });
    it('UnitTest editMovie, removeMovie - Service Layer', () => {
        let serviceLayer = new ServiceLayer();

        //Input validation
        validate(serviceLayer,serviceLayer.editMovie,{'Movie Name ':'Movie','Category ':'fantasy','Key ':"key","Examination Room ":"0",'Username ':'User'})
        validate(serviceLayer,serviceLayer.removeMovie,{'Movie Name ':'Movie','Username ':'User'})


        testServiceFunctions(serviceLayer, () => serviceLayer.editMovie("Movie", "fantasy", "key", "0", "User"));
        serviceLayer.users.set("User", 1);
        result = serviceLayer.editMovie("Movie", "fantasy", "key", "0", "User");
        expect(result).toBe("The category does not exist");
        serviceLayer = new ServiceLayer();
        testServiceFunctions(serviceLayer, () => serviceLayer.removeMovie("Movie", "User"));

    });

    it('UnitTest addMovie, editMovie, removeMovie - Cinema System', () => {
        let cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.addMovie(1, "", 1, 1));
        cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.editMovie(1, 1, "", 1, 1));
        cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.removeMovie(1, 1));

    });

    it('UnitTest addMovie - Inventory Management', () => {
        let inventoryManagement = new InventoryManagement();
        inventoryManagement.products.set(1, null);
        let result = inventoryManagement.addMovie(1, "", 1, 1);
        expect(result).toBe("This movie already exists");
        inventoryManagement.products = new Map();
        result = inventoryManagement.addMovie(1, "", 1, 1);
        expect(result).toBe("Category doesn't exist");
        inventoryManagement.categories.set(1, null);
        let movieExpected = new Movie(1, "", 1);
        result = inventoryManagement.addMovie(1, "", 1);
        expect(result).toBe("The movie added successfully");
        let movieActual = inventoryManagement.products.get(1);
        expect(movieActual.equals(movieExpected)).toBe(true);

    });

    it('UnitTest editMovie, removeMovie - Inventory Management', () => {
        let inventoryManagement = new InventoryManagement();
        let result = inventoryManagement.editMovie(1);
        expect(result).toBe("The movie does not exist");
        inventoryManagement.products.set(1, null);
        result = inventoryManagement.editMovie(1);
        expect(result).toBe("Category doesn't exist");
        inventoryManagement.categories.set(1, null);



        inventoryManagement = new InventoryManagement();
        result = inventoryManagement.removeMovie(1);
        expect(result).toBe("The movie does not exist");

    });

    it('UnitTest editMovie, removeMovie - Movie', () => {
        //edit
        let expectedMovie = new Movie(1, "Movie", 1);
        expectedMovie.movieKey = "key";
        expectedMovie.examinationRoom = 1;
        let actualMovie = new Movie(1, "Movie", 1);
        expect(actualMovie.editMovie(1, "key", 1)).toBe("The movie edited successfully");
        expect(expectedMovie.equals(actualMovie)).toBe(true);


        //remove
        expect(expectedMovie.removeMovie()).toBe("The movie removed successfully");
        expect(expectedMovie.isMovieRemoved != null).toBe(true);
        expect(expectedMovie.removeMovie()).toBe("The movie already removed");

    });


    it('Integration addMovie', () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.users.set("User", 1);
        serviceLayer.categories.set("fantasy", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.addMovie("Movie", "fantasy", "User"));
        let user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1, null);
        let result = serviceLayer.addMovie("Movie", "fantasy", "User");
        expect(result).toBe("This movie already exists");
        serviceLayer.cinemaSystem.inventoryManagement.products = new Map();
        result = serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("Category doesn't exist");
        serviceLayer.cinemaSystem.inventoryManagement.categories.set(1, null);
        let movieExpected = new Movie(1, "anotherMovie", 1);
        result = serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The movie added successfully");
        let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(1);
        expect(movieActual.equals(movieExpected)).toBe(true);
        result = serviceLayer.addMovie("anotherMovie", "fantasy", "User");
        expect(result).toBe("The movie already exists");
    });

    it('Integration editMovie', () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.products.set("Movie", 1);
        serviceLayer.users.set("User", 1);
        serviceLayer.categories.set("fantasy", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User"));
        user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        result = serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User");
        expect(result).toBe("The movie does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1, new Movie(1, "Movie", 1));
        result = serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User");
        expect(result).toBe("Category doesn't exist");
        serviceLayer.cinemaSystem.inventoryManagement.categories.set(1, null);
        let movieExpected = new Movie(1, "Movie", 1);
        movieExpected.movieKey = "key";
        movieExpected.examinationRoom = 1;
        result = serviceLayer.editMovie("Movie", "fantasy", "key", "1", "User");
        expect(result).toBe("The movie edited successfully");
        let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(1);
        expect(movieActual.equals(movieExpected)).toBe(true);

    });


    it('Integration removeMovie', () => {
        let serviceLayer = new ServiceLayer();
        serviceLayer.products.set("Movie", 1);
        serviceLayer.users.set("User", 1);
        serviceLayer.categories.set("fantasy", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.removeMovie("Movie", "User"));
        user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);
        result = serviceLayer.removeMovie("Movie", "User");
        expect(result).toBe("The movie does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1, new Movie(1, "Movie", 1));
        result = serviceLayer.removeMovie("Movie", "User");
        expect(result).toBe("The movie removed successfully");
        let movieActual = serviceLayer.cinemaSystem.inventoryManagement.products.get(1);
        expect(movieActual.isMovieRemoved != null).toBe(true);
        result = serviceLayer.removeMovie("Movie", "User");
        expect(result).toBe("The movie does not exist");

    });






});



function testServiceFunctions(serviceLayer, method) {
    let result = method();
    expect(result).toBe("The movie does not exist");
    serviceLayer.products.set("Movie", 1);
    result = method();
    expect(result).toBe("The user performing the operation does not exist in the system");
}

function testCinemaFunctions(cinemaSystem, method) {
    let result = method();
    expect(result).toBe("The operation cannot be completed - the user is not connected to the system");
    let user = { isLoggedin: () => false };
    cinemaSystem.users.set(1, user);
    result = method();
    expect(result).toBe("The operation cannot be completed - the user is not connected to the system");
    user = { isLoggedin: () => true, permissionCheck: () => false };
    cinemaSystem.users.set(1, user);
    result = method();
    expect(result).toBe("User does not have proper permissions");
}
exports.testCinemaFunctions=testCinemaFunctions;
