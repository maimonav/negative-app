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

const user = "admin";
const supplier = "supplier";
const contactDetails = "test@gmail.com";
context("Type all fields", () => {
  before(() => {
    cy.startSystem();
    cy.login(user, user);
  });
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
  });

  it("show supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{esc}");
  });

  it("edit supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{esc}");
  });

  it("remove supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier)
      .type("{esc}");
  });

  afterEach(() => {
    cy.matchSnapshot();
  });
});

context("Click all buttons", () => {
  it("add new supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(addActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("edit supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove supplier", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
    cy.chooseAction(removeActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  afterEach(() => {
    cy.matchSnapshot();
  });

  after(() => {
    cy.logout();
  });
});
