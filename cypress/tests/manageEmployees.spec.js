import {
  userActionsTabHook,
  userNameHook,
  contactDetailsHook,
  showActionHook,
  employeesTabHook
} from "../../src/consts/data-hooks";

const user = "admin";
const employee = "admin";
context("Manage Employees", () => {
  beforeEach(() => {
    cy.startSystem();
    cy.login(user, user);
  });

  it.only("show employee", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  afterEach(() => {
    cy.logout();
  });
});
