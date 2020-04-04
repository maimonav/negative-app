const DB = require("../../../server/src/main/DBManager");
const Movie = require("../../../server/src/main/Movie");
const MovieOrder = require("../../../server/src/main/MovieOrder");
const Order = require("../../../server/src/main/Order");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");
const { validate , testCinemaFunctions } = require("./MovieOperationsTests.spec")




describe("MovieOrder Operations Tests", () => {

    beforeAll(() => {
        DB.testModeOn();
    });


    it('UnitTest addMovieOrder  - Service Layer', () => {
        let serviceLayer = new ServiceLayer();
        //Input validation
        validate(serviceLayer, serviceLayer.addMovieOrder, { 'Order ID ': 'Order', 'Date ': 'date','Supplier Name ':'Supplier','Movies List ':'["Movie"]', 'Username ': 'User' })
        
        serviceLayer.orders.set("Order", 1);
        let result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("The order already exist");
        serviceLayer.orders=new Map();
        result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("The supplier does not exist");
        serviceLayer.suppliers.set("Supplier", 1);
        result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("Movie does not exist");
        serviceLayer.products.set("Movie", 1);
        result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("The user performing the operation does not exist in the system");
    });


    it('UnitTest addMovieOrder - Cinema System', () => {
        let cinemaSystem = new CinemaSystem();
        testCinemaFunctions(cinemaSystem, () => cinemaSystem.addMovieOrder(1,'',1,[],1));
    });



    it('UnitTest addMovieOrder - Inventory Management', () => {
        let inventoryManagement = new InventoryManagement();
        let todayDate = new Date();
        inventoryManagement.orders.set(1, null);
        let result = inventoryManagement.addMovieOrder(1);
        expect(result).toBe("This order already exists");
        inventoryManagement.orders = new Map();
        result = inventoryManagement.addMovieOrder(1,'test', 1);
        expect(result).toBe("The supplier does not exist");
        inventoryManagement.suppliers.set(1, null);
        result = inventoryManagement.addMovieOrder(1,'test',1,[1]);
        expect(result).toBe("Movie does not exist");
        let movie = new Movie(1);
        inventoryManagement.products.set(1, movie);
        result = inventoryManagement.addMovieOrder(1,'test',1,[1]);
        expect(result).toBe("The order date is invalid");
        result = inventoryManagement.addMovieOrder(1,todayDate.toISOString(),1,[1],1);
        expect(result).toBe("The order added successfully");
        let actualOrder = inventoryManagement.orders.get(1);
        let expectedOrder = new Order(1,1,todayDate,1);
        let expectedMovie = new Movie(1);
        let expectedMovieOrder = new MovieOrder(expectedMovie,expectedOrder);
        expectedMovie.productOrders.set(1,expectedMovieOrder);
        expectedOrder.productOrders.set(1,expectedMovieOrder);
        expect(expectedOrder.equals(actualOrder)).toBe(true);

    });



    it('Integration addMovieOrder', () => {
        let serviceLayer = new ServiceLayer();
        let todayDate = new Date();
        serviceLayer.users.set("User", 1);
        serviceLayer.suppliers.set("Supplier", 1);
        serviceLayer.products.set("Movie", 1);
        testCinemaFunctions(serviceLayer.cinemaSystem, () => serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User'));
        let user = { isLoggedin: () => true, permissionCheck: () => true }
        serviceLayer.cinemaSystem.users.set(1, user);


        serviceLayer.cinemaSystem.inventoryManagement.orders.set(1, null);
        let result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("This order already exists");
        serviceLayer.cinemaSystem.inventoryManagement.orders = new Map();
        result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("The supplier does not exist");
        serviceLayer.cinemaSystem.inventoryManagement.suppliers.set(1, null);
        result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("Movie does not exist");
        let movie = new Movie(1);
        serviceLayer.cinemaSystem.inventoryManagement.products.set(1,movie);
        result = serviceLayer.addMovieOrder('Order','date','Supplier', '["Movie"]', 'User');
        expect(result).toBe("The order date is invalid");
        result = serviceLayer.addMovieOrder('Order',todayDate.toISOString(),'Supplier', '["Movie"]', 'User');
        expect(result).toBe("The order added successfully");
        let actualOrder = serviceLayer.cinemaSystem.inventoryManagement.orders.get(1);
        let expectedOrder = new Order(1,1,todayDate,1);
        let expectedMovie = new Movie(1);
        let expectedMovieOrder = new MovieOrder(expectedMovie,expectedOrder);
        expectedMovie.productOrders.set(1,expectedMovieOrder);
        expectedOrder.productOrders.set(1,expectedMovieOrder);
        expect(expectedOrder.equals(actualOrder)).toBe(true);

    });





});



