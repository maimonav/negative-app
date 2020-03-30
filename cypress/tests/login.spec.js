import {
  userNameHook,
  passwordHook,
  loginHook
} from "../../src/consts/data-hooks";
context("Login", () => {
  beforeEach(() => {
    cy.startSystem();
  });

  afterEach(() => {
    cy.wait(2000);
    cy.logout();
  });

  it("login to system successfully", () => {
    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type("admin");

    cy.get(`[data-hook=${passwordHook}]`)
      .click()
      .type("admin");

    cy.get(`[data-hook=${loginHook}]`).click();
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
});
