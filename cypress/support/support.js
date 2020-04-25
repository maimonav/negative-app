//Describe here the desired behaviour for every test

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
