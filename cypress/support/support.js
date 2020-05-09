//Describe here the desired behaviour for every test
import { handleLogout } from "../../src/Handlers/Handlers";
before(() => {
  cy.startSystem();
});

beforeEach(() => {
  cy.login("admin", "admin");
});

afterEach(() => {
  cy.matchSnapshot();
  cy.logout();
});

after(() => {
  handleLogout();
});
