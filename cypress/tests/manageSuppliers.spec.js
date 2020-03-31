import {
  userNameHook,
  contactDetailsHook,
  actionButtonHook,
  showActionHook,
  addActionHook,
  editActionHook,
  removeActionHook,
  suppliersTabHook
} from "../../src/consts/data-hooks";

const user = "admin";
const supplier = "supplier";
context("Manage Suppliers", () => {
  beforeEach(() => {
    cy.startSystem();
    cy.login(user, user);
  });

  it("show supplier", () => {
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  it("add new supplier", () => {
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

  it("edit supplier", () => {
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type("test@gmail.com");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove supplier", () => {
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  afterEach(() => {
    cy.logout();
  });
});
