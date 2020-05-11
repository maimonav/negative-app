import {
  userNameHook,
  passwordHook,
  actionButtonHook,
  logoutTabHook,
  permissionsHook,
  userActionsTabHook,
  employeesTabHook,
  addActionHook,
  firstNameHook,
  lastNameHook,
  contactDetailsHook,
  showActionHook,
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

Cypress.Commands.add("accessTab", (tab) => {
  cy.get(`[data-hook=${tab}]`).click();
});

Cypress.Commands.add("chooseAction", (action) => {
  cy.get(`[data-hook=${action}]`).click();
});

Cypress.Commands.add("matchSnapshot", (action) => {
  cy.document().toMatchImageSnapshot();
});

Cypress.Commands.add(
  "addEmployee",
  (permissions, employee, password, firstName, lastName, contactDetails) => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${permissionsHook}`)
      .click()
      .type(permissions)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee);

    cy.get(`[data-hook=${passwordHook}`)
      .click()
      .type(password);

    cy.get(`[data-hook=${firstNameHook}`)
      .click()
      .type(firstName);

    cy.get(`[data-hook=${lastNameHook}`)
      .click()
      .type(lastName);

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type(contactDetails);

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  }
);
