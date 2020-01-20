describe("LoginTest", () => {
    let user;
    let correctUserName;
    let correctPassword;
    const User = require("../../../server/src/main/User");
    const CinemaSystem = require("../../../server/src/main/CinemaSystem");
    const ServiceLayer = require("../../../server/src/main/ServiceLayer");
    let servicelayer;

    let cinemaSystem;

    beforeEach(() => {
        correctUserName = "yuval";
        correctPassword = "123456";
        user = new User(1, correctUserName, correctPassword);
        cinemaSystem = new CinemaSystem();
        cinemaSystem.users.set(1, user);
        servicelayer = new ServiceLayer();
        servicelayer.users.set(correctUserName, user.id);
    });
    it('UnitTest-login Test on class User', () => {
        const wrongUserName = "yubal";
        const wrongPassword = "wrongPassword";
        expect(user.login(wrongUserName, correctPassword)).toBe('Incorrect user name or password');
        expect(user.login(correctUserName, wrongPassword)).toBe('Incorrect user name or password');
        expect(user.login(correctUserName, correctPassword)).toBe('User Logged in succesfully.');
        expect(user.login(correctUserName, correctPassword)).toBe('The user already connected');
    });

    it('UnitTest-login Test on class CinimaSystem', () => {
        spyOn(user, 'login').and.returnValue('User Logged in succesfully.');

        const wrongid = 'a';
        expect(cinemaSystem.login(correctUserName, correctPassword, wrongid)).toBe("The user isn't exists");
        expect(cinemaSystem.login(correctUserName, correctPassword, user.id)).toBe('User Logged in succesfully.');

    });

    it('UnitTest-login Test on class ServiceLayer', () => {
        spyOn(cinemaSystem, 'login').and.returnValue('User Logged in succesfully.');
        servicelayer.cinemaSystem = cinemaSystem;
        const wrongUserName = "yubal";
        expect(servicelayer.login(wrongUserName, correctPassword)).toBe("Incorrect user name.");
        expect(servicelayer.login(correctUserName, correctPassword, user.id)).toBe('User Logged in succesfully.');

    });

    it('integration-login Test on class User', () => {
        const wrongUserName = "yubal";
        const wrongPassword = "wrongPassword";
        expect(user.login(wrongUserName, correctPassword)).toBe('Incorrect user name or password');
        expect(user.login(correctUserName, wrongPassword)).toBe('Incorrect user name or password');
        expect(user.login(correctUserName, correctPassword)).toBe('User Logged in succesfully.');
        expect(user.login(correctUserName, correctPassword)).toBe('The user already connected');
    });

    it('integration-login Test on class CinimaSystem', () => {
        const wrongid = 'a';
        expect(cinemaSystem.login(correctUserName, correctPassword, wrongid)).toBe("The user isn't exists");
        expect(cinemaSystem.login(correctUserName, correctPassword, user.id)).toBe('User Logged in succesfully.');

    });

    it('integration-login Test on class ServiceLayer', () => {
        servicelayer.cinemaSystem = cinemaSystem;
        const wrongUserName = "yubal";
        expect(servicelayer.login(wrongUserName, correctPassword)).toBe("Incorrect user name.");
        expect(servicelayer.login(correctUserName, correctPassword, user.id)).toBe('User Logged in succesfully.');

    });
})