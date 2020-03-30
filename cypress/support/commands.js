import { logoutHook, logoutTabHook } from "../../src/consts/data-hooks";

Cypress.Commands.add("startSystem", () => {
  cy.visit("http://localhost:3000/");
});

Cypress.Commands.add("logout", () => {
  cy.get(`[data-hook=${logoutTabHook}]`).click();
  cy.get(`[data-hook=${logoutHook}]`).click();
});
