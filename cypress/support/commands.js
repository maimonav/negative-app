import {
  userNameHook,
  passwordHook,
  actionButtonHook,
  userActionsTabHook,
  logoutTabHook
} from "../../src/consts/data-hooks";

Cypress.Commands.add("startSystem", () => {
  cy.visit("http://localhost:3000/");
});

Cypress.Commands.add("login", (username, password) => {
  cy.get(`[data-hook=${userNameHook}`)
    .click()
    .type(username);

  cy.get(`[data-hook=${passwordHook}]`)
    .click()
    .type(password);

  cy.get(`[data-hook=${actionButtonHook}]`).click();
});

Cypress.Commands.add("logout", () => {
  cy.get(`[data-hook=${logoutTabHook}]`).click();
  cy.get(`[data-hook=${actionButtonHook}]`).click();
});

Cypress.Commands.add("accessTab", tab => {
  cy.get(`[data-hook=${userActionsTabHook}]`).click();
  cy.get(`[data-hook=${tab}]`).click();
});

Cypress.Commands.add("chooseAction", action => {
  cy.get(`[data-hook=${action}]`).click();
});
