const { wait } = require("@testing-library/react");

context("Actions", () => {
  beforeEach(() => {
    cy.startSystem();
  });

  afterEach(() => {
    cy.wait(2000);
    cy.logout();
  });

  it("login to system successfully", () => {
    cy.get("[data-hook=username]")
      .click()
      .type("admin");

    cy.get("[data-hook=password]")
      .click()
      .type("admin");

    cy.get("[data-hook=loginButton]").click();
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
});
