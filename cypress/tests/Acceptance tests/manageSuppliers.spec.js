import {
  userActionsTabHook,
  userNameHook,
  contactDetailsHook,
  actionButtonHook,
  showActionHook,
  addActionHook,
  editActionHook,
  removeActionHook,
  suppliersTabHook
} from "../../../src/consts/data-hooks";

const supplier = "supplier";
const contactDetails = "test@gmail.com";
context("Manage Suppliers", () => {
  it("add new supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier);

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type(contactDetails);

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("show supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  it("edit supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type(contactDetails);

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});
