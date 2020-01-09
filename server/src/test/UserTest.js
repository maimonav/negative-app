const User=require("../main/User.js");

var junit = require("junit");
var it = junit();
var { eq } = it;
 
it.describe("level 01", it => {
    u1=new User.User(0, "yuval", "123456", [1,2,3]);
    u2=new User.User(0, "yuval", "123456", [1,2,3]);
    u3=new User.User(0, "aviv", "123456", [1,2,3]);
     it("good case", () => eq(true, u1.equals(u2)));
     it("bad case", () => eq(true, u1.equals(u3)));
}),
it.describe("login test", it => {
    u1=new User.User(0, "yuval", "123456", [1,2,3]);
    it("bad case- wrong username", () => eq("Incorrect user name or password", u1.login("yuvbl", "123456")));
    it("bad case- wrong password", () => eq("Incorrect user name or password", u1.login("yuval", "123466")));
    it("good case", () => eq("Login", u1.login("yuval", "123456")));
    it("bad case- already connected", () => eq("The user already connected", u1.login("yuval", "123456")));

});
 
it.run();