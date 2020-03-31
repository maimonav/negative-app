import {
  userNameHook,
  contactDetailsHook,
  actionButtonHook,
  addActionHook,
  suppliersTabHook
} from "../../src/consts/data-hooks";

const user = "admin";
context("Manage Suppliers", () => {
  beforeEach(() => {
    cy.startSystem();
    cy.login(user, user);
  });

  it("add new Supplier", () => {
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type("test");

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type("test@gmail.com");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  afterEach(() => {
    cy.logout();
  });
});
