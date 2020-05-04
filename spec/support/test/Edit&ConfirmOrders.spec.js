const DB = require("../../../server/src/main/DataLayer/DBManager");
const Employee = require("../../../server/src/main/Employee");
const CinemaSystem = require("../../../server/src/main/CinemaSystem");
const ServiceLayer = require("../../../server/src/main/ServiceLayer");
const Order = require("../../../server/src/main/Order");
const CafeteriaProductOrder = require("../../../server/src/main/CafeteriaProductOrder");
const CafeteriaProduct = require("../../../server/src/main/CafeteriaProduct");
const Movie = require("../../../server/src/main/Movie");
const MovieOrder = require("../../../server/src/main/MovieOrder");
const Category = require("../../../server/src/main/Category");
const InventoryManagement = require("../../../server/src/main/InventoryManagement");


let category;
let product;
let orderForCafeteriaProduct;
let orderProduct;
let movie;
let orderFormovie;
let ordermovie;
let inventoryManagement;
let cinemaSystem;
let employee;
let manager;
let serviceLayer;

describe("edit&confirmCafeteriaOrder", () => {
    beforeEach(() => {
        DB._testModeOn();
        category = new Category(-1, 'category');
        product = new CafeteriaProduct(0, 'product', -1, 7, 5);
        orderForCafeteriaProduct = new Order(-1, -1, new Date(1992, 9, 6), 0, "admin," + new Date(1992, 9, 6));
        orderProduct = new CafeteriaProductOrder(product, orderForCafeteriaProduct, 10);
        orderForCafeteriaProduct.productOrders.set(product.id, orderProduct);
        movie = new Movie(-1, 'movie', -1);
        orderFormovie = new Order(-2, -1, new Date(1992, 9, 6), 0, "admin , " + new Date(1992, 9, 6));
        ordermovie = new MovieOrder(movie, orderFormovie);
        orderFormovie.productOrders.set(movie.id, ordermovie);

        inventoryManagement = new InventoryManagement();
        inventoryManagement.products.set(product.id, product);
        inventoryManagement.products.set(movie.id, movie);
        inventoryManagement.orders.set(orderForCafeteriaProduct.id, orderForCafeteriaProduct);
        inventoryManagement.orders.set(orderFormovie.id, orderFormovie);

        cinemaSystem = new CinemaSystem();
        cinemaSystem.inventoryManagement = inventoryManagement;

        employee = new Employee(-1, 'employee', 'employee', 'EMPLOYEE', 'employee', 'employee', 'employee', true);
        employee.Loggedin = true;
        manager = new Employee(-2, 'manager', 'manager', 'MANAGER', 'manager', 'manager', 'manager', true);
        manager.Loggedin = true;
        cinemaSystem.users.set(employee.id, employee);
        cinemaSystem.users.set(manager.id, manager);

        serviceLayer = new ServiceLayer();
        serviceLayer.cinemaSystem = cinemaSystem;
        serviceLayer.users.set(employee.userName, employee.id);
        serviceLayer.users.set(manager.userName, manager.id);
        serviceLayer.products.set(product.name, product.id);
        serviceLayer.products.set(movie.name, movie.id);
        serviceLayer.orders.set(orderForCafeteriaProduct.name, orderForCafeteriaProduct.id);
        serviceLayer.orders.set(orderFormovie.name, orderFormovie.id);
    });

    it("UnitTest-editOrder in Order class", async() => {
        let productList = [{ id: product.id, quantity: 7 }];
        expect(await orderForCafeteriaProduct.editOrder(new Date(1992, 6, 9), -3, productList)).toBe("The order edited successfully completed");
        expect(orderForCafeteriaProduct.date).toEqual(new Date(1992, 6, 9));
        expect(orderForCafeteriaProduct.supplierId).toBe(-3);
        expect(orderForCafeteriaProduct.productOrders.get(product.id).expectedQuantity).toBe(7);
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await orderFormovie.editOrder(null, null, movieList)).toBe("The order edited successfully completed");
        expect(orderFormovie.productOrders.get(movie.id).expectedQuantity).toBe(7);
        expect(movie.movieKey).toBe(-3);
        expect(movie.examinationRoom).toBe(-4);
    });

    it("UnitTest-confirmOrder in Order class", async() => {
        //confirm for product
        let productList = [];
        expect(await orderForCafeteriaProduct.confirmOrder(productList)).toBe('No status was received for all order products');
        productList = [{ id: product.id, quantity: 7 }];
        expect(await orderForCafeteriaProduct.confirmOrder(productList)).toBe('Order confirmation success');
        expect(orderProduct.actualQuantity).toBe(7);
        expect(product.quantity).toBe(12);
        productList = [{ id: movie.id, key: 7, examinationRoom: -4 }];
        expect(await orderFormovie.confirmOrder(productList)).toBe('Order confirmation success');
        expect(orderFormovie.productOrders.get(movie.id).actualQuantity).toBe(1);
        expect(movie.movieKey).toBe(7);
        expect(movie.examinationRoom).toBe(-4);
    });

    it("UnitTest-editOrder in InventoryManagement class", async() => {
        spyOn(orderForCafeteriaProduct, "editOrder").and.returnValue("dummy");
        spyOn(orderFormovie, "editOrder").and.returnValue("dummy");

        let productList = [{ id: product.id, quantity: 7 }];
        let fakeOrderID = -1390;
        expect(await inventoryManagement.editOrder(fakeOrderID, new Date(1992, 6, 9), -3, productList)).toBe("Order " + fakeOrderID + " does not exsits.");
        expect(await inventoryManagement.editOrder(orderForCafeteriaProduct.id, new Date(1992, 6, 9), -3, productList)).toBe("dummy");
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await inventoryManagement.editOrder(orderFormovie.id, null, null, movieList)).toBe("dummy");
    });

    it("UnitTest-confirmOrder in InventoryManagement class", async() => {
        spyOn(orderForCafeteriaProduct, "confirmOrder").and.returnValue("dummy");
        spyOn(orderFormovie, "confirmOrder").and.returnValue("dummy");
        let productList = [{ id: product.id, quantity: 7 }];
        let fakeOrderID = -1390;
        expect(await inventoryManagement.confirmOrder(fakeOrderID, new Date(1992, 6, 9), -3, productList)).toBe("Order " + fakeOrderID + " does not exsits.");
        expect(await inventoryManagement.confirmOrder(orderForCafeteriaProduct.id, new Date(1992, 6, 9), -3, productList)).toBe("dummy");
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await inventoryManagement.confirmOrder(orderFormovie.id, null, null, movieList)).toBe("dummy");
    });

    it("UnitTest-editOrder in cinemaSystem class", async() => {
        spyOn(inventoryManagement, "editOrder").and.returnValue("dummy");

        let productList = [{ id: product.id, quantity: 7 }];
        expect(await cinemaSystem.editOrder(orderForCafeteriaProduct.id, new Date(1992, 6, 9), -3, productList, employee.id)).toBe(cinemaSystem.inappropriatePermissionsMsg);
        expect(await cinemaSystem.editOrder(orderForCafeteriaProduct.id, new Date(1992, 6, 9), -3, productList, manager.id)).toBe("dummy");
    });

    it("UnitTest-confirmOrder in cinemaSystem class", async() => {
        spyOn(inventoryManagement, "confirmOrder").and.returnValue("dummy");
        let productList = [{ id: product.id, quantity: 7 }];
        expect(await cinemaSystem.confirmOrder(orderForCafeteriaProduct.id, productList, employee.id)).toBe(cinemaSystem.inappropriatePermissionsMsg);
        expect(await cinemaSystem.confirmOrder(orderForCafeteriaProduct.id, productList, manager.id)).toBe("dummy");
    });

    it("UnitTest-editOrder in ServiceLayer class", async() => {
        spyOn(cinemaSystem, "editOrder").and.returnValue("dummy");

        let productList = [{ name: product.name, quantity: 7 }];
        let dummyNumber = -1390;
        expect(await serviceLayer.editOrder(dummyNumber, new Date(1992, 6, 9), -3, productList, manager.userName)).toBe(" The order " + dummyNumber + " doesn't exists");
        productList = [{ name: dummyNumber, quantity: 7 }];
        expect(await serviceLayer.editOrder(orderForCafeteriaProduct.name, new Date(1992, 6, 9), -3, productList, manager.userName)).toBe("The product " + dummyNumber + " doesn't exists");
        productList = [{ name: product.name, quantity: 7 }];
        expect(await serviceLayer.editOrder(orderForCafeteriaProduct.name, new Date(1992, 6, 9), -3, productList, dummyNumber)).toBe("The user performing the operation does not exist in the system");
        expect(await serviceLayer.editOrder(orderForCafeteriaProduct.name, new Date(1992, 6, 9), -3, productList, manager.userName)).toBe("dummy");
    });

    it("UnitTest-confirmOrder in ServiceLayer class", async() => {
        spyOn(cinemaSystem, "confirmOrder").and.returnValue("dummy");
        let productList = [{ name: product.name, quantity: 7 }];
        let dummyNumber = -1390;
        expect(await serviceLayer.confirmOrder(dummyNumber, productList, manager.userName)).toBe(" The order " + dummyNumber + " doesn't exists");
        productList = [{ name: dummyNumber, quantity: 7 }];
        expect(await serviceLayer.confirmOrder(orderForCafeteriaProduct.name, productList, manager.userName)).toBe("The product " + dummyNumber + " doesn't exists");
        productList = [{ name: product.name, quantity: 7 }];
        expect(await serviceLayer.confirmOrder(orderForCafeteriaProduct.name, productList, dummyNumber)).toBe("The user performing the operation does not exist in the system");
        expect(await serviceLayer.confirmOrder(orderForCafeteriaProduct.name, productList, manager.userName)).toBe("dummy");
    });

    // =================================INTEGRATION==========================================================================================

    it("Integration-editOrder in InventoryManagement class", async() => {
        let productList = [{ id: product.id, quantity: 7 }];
        let fakeOrderID = -1390;
        expect(await inventoryManagement.editOrder(fakeOrderID, new Date(1992, 6, 9), -3, productList)).toBe("Order " + fakeOrderID + " does not exsits.");
        expect(await inventoryManagement.editOrder(orderForCafeteriaProduct.id, new Date(1992, 6, 9), -3, productList)).toBe("The order edited successfully completed");
        expect(orderForCafeteriaProduct.date).toEqual(new Date(1992, 6, 9));
        expect(orderForCafeteriaProduct.supplierId).toBe(-3);
        expect(orderForCafeteriaProduct.productOrders.get(product.id).expectedQuantity).toBe(7);
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await inventoryManagement.editOrder(orderFormovie.id, null, null, movieList)).toBe("The order edited successfully completed");
        expect(orderFormovie.productOrders.get(movie.id).expectedQuantity).toBe(7);
        expect(movie.movieKey).toBe(-3);
        expect(movie.examinationRoom).toBe(-4);

    });

    it("Integration-confirmOrder in InventoryManagement class", async() => {
        let productList = [{ id: product.id, quantity: 7 }];
        let fakeOrderID = -1390;
        expect(await inventoryManagement.confirmOrder(fakeOrderID, productList)).toBe("Order " + fakeOrderID + " does not exsits.");
        expect(await inventoryManagement.confirmOrder(orderForCafeteriaProduct.id, productList)).toBe("Order confirmation success");
        expect(orderProduct.actualQuantity).toBe(7);
        expect(product.quantity).toBe(12);
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await inventoryManagement.confirmOrder(orderFormovie.id, movieList)).toBe("Order confirmation success");
        expect(orderFormovie.productOrders.get(movie.id).actualQuantity).toBe(1);
        expect(movie.movieKey).toBe(-3);
        expect(movie.examinationRoom).toBe(-4);
    });

    it("Integration-editOrder in cinemaSystem class", async() => {

        let productList = [{ id: product.id, quantity: 7 }];
        expect(await cinemaSystem.editOrder(orderForCafeteriaProduct.id, new Date(1992, 6, 9), -3, productList, employee.id)).toBe(cinemaSystem.inappropriatePermissionsMsg);
        let fakeOrderID = -1390;
        expect(await cinemaSystem.editOrder(fakeOrderID, new Date(1992, 6, 9), -3, productList, manager.id)).toBe("Order " + fakeOrderID + " does not exsits.");
        expect(await cinemaSystem.editOrder(orderForCafeteriaProduct.id, new Date(1992, 6, 9), -3, productList, manager.id)).toBe("The order edited successfully completed");
        expect(orderForCafeteriaProduct.date).toEqual(new Date(1992, 6, 9));
        expect(orderForCafeteriaProduct.supplierId).toBe(-3);
        expect(orderForCafeteriaProduct.productOrders.get(product.id).expectedQuantity).toBe(7);
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await cinemaSystem.editOrder(orderFormovie.id, null, null, movieList, manager.id)).toBe("The order edited successfully completed");
        expect(orderFormovie.productOrders.get(movie.id).expectedQuantity).toBe(7);
        expect(movie.movieKey).toBe(-3);
        expect(movie.examinationRoom).toBe(-4);
    });

    it("Integration-confirmOrder in cinemaSystem class", async() => {
        let productList = [{ id: product.id, quantity: 7 }];
        expect(await cinemaSystem.confirmOrder(orderForCafeteriaProduct.id, productList, employee.id)).toBe(cinemaSystem.inappropriatePermissionsMsg);
        let fakeOrderID = -1390;
        expect(await cinemaSystem.confirmOrder(fakeOrderID, productList, manager.id)).toBe("Order " + fakeOrderID + " does not exsits.");
        expect(await cinemaSystem.confirmOrder(orderForCafeteriaProduct.id, productList, manager.id)).toBe("Order confirmation success");
        expect(orderProduct.actualQuantity).toBe(7);
        expect(product.quantity).toBe(12);
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await cinemaSystem.confirmOrder(orderFormovie.id, movieList, manager.id)).toBe("Order confirmation success");
        expect(orderFormovie.productOrders.get(movie.id).actualQuantity).toBe(1);
        expect(movie.movieKey).toBe(-3);
        expect(movie.examinationRoom).toBe(-4);
    });

    it("Integration-editOrder in ServiceLayer class", async() => {
        let productList = [{ name: product.name, quantity: 7 }];
        let dummyNumber = -1390;
        expect(await serviceLayer.editOrder(dummyNumber, (new Date(1992, 6, 9)).toString(), -3, productList, manager.userName)).toBe(" The order " + dummyNumber + " doesn't exists");
        productList = [{ name: dummyNumber, quantity: 7 }];
        expect(await serviceLayer.editOrder(orderForCafeteriaProduct.name, (new Date(1992, 6, 9)).toString(), -3, productList, manager.userName)).toBe("The product " + dummyNumber + " doesn't exists");
        productList = [{ name: product.name, quantity: 7 }];
        expect(await serviceLayer.editOrder(orderForCafeteriaProduct.name, (new Date(1992, 6, 9)).toString(), -3, productList, dummyNumber)).toBe("The user performing the operation does not exist in the system");
        expect(await cinemaSystem.editOrder(orderForCafeteriaProduct.id, (new Date(1992, 6, 9)).toString(), -3, productList, employee.id)).toBe(cinemaSystem.inappropriatePermissionsMsg);
        let fakeOrderID = -1390;
        expect(await serviceLayer.editOrder(orderForCafeteriaProduct.name, (new Date(1992, 6, 9)).toString(), -3, productList, manager.userName)).toBe("The order edited successfully completed");
        expect(orderForCafeteriaProduct.date).toEqual(new Date(1992, 6, 9));
        expect(orderForCafeteriaProduct.productOrders.get(product.id).expectedQuantity).toBe(7);
        let movieList = [{ id: movie.id, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await serviceLayer.editOrder(orderFormovie.name, null, null, movieList, manager.userName)).toBe("The order edited successfully completed");
        expect(orderFormovie.productOrders.get(movie.id).expectedQuantity).toBe(7);
        expect(movie.movieKey).toBe(-3);
        expect(movie.examinationRoom).toBe(-4);
    });

    it("Integration-confirmOrder in ServiceLayer class", async() => {
        let productList = [{ name: product.name, quantity: 7 }];
        let dummyNumber = -1390;
        expect(await serviceLayer.confirmOrder(dummyNumber, productList, manager.userName)).toBe(" The order " + dummyNumber + " doesn't exists");
        productList = [{ name: dummyNumber, quantity: 7 }];
        expect(await serviceLayer.confirmOrder(orderForCafeteriaProduct.name, productList, manager.userName)).toBe("The product " + dummyNumber + " doesn't exists");
        productList = [{ name: product.name, quantity: 7 }];
        expect(await serviceLayer.confirmOrder(orderForCafeteriaProduct.name, productList, dummyNumber)).toBe("The user performing the operation does not exist in the system");
        expect(await serviceLayer.confirmOrder(orderForCafeteriaProduct.name, productList, employee.userName)).toBe(cinemaSystem.inappropriatePermissionsMsg);
        expect(await serviceLayer.confirmOrder(orderForCafeteriaProduct.name, productList, manager.userName)).toBe("Order confirmation success");
        expect(orderProduct.actualQuantity).toBe(7);
        expect(product.quantity).toBe(12);
        let movieList = [{ name: movie.name, quantity: 7, key: -3, examinationRoom: -4 }];
        expect(await serviceLayer.confirmOrder(orderFormovie.name, movieList, manager.userName)).toBe("Order confirmation success");
        expect(orderFormovie.productOrders.get(movie.id).actualQuantity).toBe(1);
        expect(movie.movieKey).toBe(-3);
        expect(movie.examinationRoom).toBe(-4);
    });
});