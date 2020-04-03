const DB = require("../../../server/src/main/DBManager");

describe("Register", () => {
    let user;
    let correctUserName;
    let correctPassword;
    const User = require("../../../server/src/main/User");
    const CinemaSystem = require("../../../server/src/main/CinemaSystem");
    const ServiceLayer = require("../../../server/src/main/ServiceLayer");
    let servicelayer;
    let cinemaSystem;

    beforeEach(() => {
        DB.testModeOn();
        correctUserName = "yuval";
        correctPassword = "123456";
        correctPermission = 'EMPLOYEE';
        user = new User(1, correctUserName, correctPassword, correctPermission);
        cinemaSystem = new CinemaSystem();
        servicelayer = new ServiceLayer();
    });
    it('UnitTest-register Test on class CinemaSystem', () => {
        expect(cinemaSystem.register(user.id, correctUserName, correctPassword)).toBe('The following data provided is invalid: Permission ');
        expect(cinemaSystem.register(user.id, correctUserName, correctPassword, 1)).toBe('The following data provided is invalid: Permission ');
        expect(cinemaSystem.register(user.id, correctUserName, correctPassword, "USER")).toBe('The following data provided is invalid: Permission ');

        expect(cinemaSystem.register(user.id, correctUserName, correctPassword, 'EMPLOYEE')).toBe('The user registered successfully.');
        expect(cinemaSystem.register(user.id, correctUserName, correctPassword, 'EMPLOYEE')).toBe('The id is already exists');

    })

    it('UnitTest-register Test on class ServiceLayer', () => {
        spyOn(cinemaSystem, 'register').and.returnValue('dummy');
        servicelayer.cinemaSystem = cinemaSystem;
        expect(servicelayer.userCounter).toBe(3);
        expect(servicelayer.register(correctUserName, correctPassword)).toBe('dummy');

    });

    it('Integration-register Test on class ServiceLayer', () => {
        expect(servicelayer.userCounter).toBe(3);
        expect(servicelayer.register(correctUserName, correctPassword)).toBe('The user registered successfully.');
        expect(servicelayer.userCounter).toBe(4);
        expect(servicelayer.register(correctUserName, correctPassword)).toBe('The user already Exist');
    });

})