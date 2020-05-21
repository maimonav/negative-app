import {
  userActionsTabHook,
  inventoryActionsTabHook,
  reportsActionsTabHook,
  employeesTabHook,
  suppliersTabHook,
  inventoryTabHook,
  ordersTabHook,
  moviesTabHook,
  categoriesTabHook,
  logoutTabHook,
  manageReportsTabHook
} from "../../../src/consts/data-hooks";

context("Click all tabs", () => {
  it("Logout", () => {
    cy.accessTab(logoutTabHook);
  });

  it("Manage Suppliers", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(suppliersTabHook);
  });

  it("Manage Employees", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
  });

  it("Manage Inventory", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
  });

  it("Manage Orders", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
  });

  it("Manage Movies", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
  });

  it("Manage Categories", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
  });

  it("Manage reports", () => {
    cy.accessTab(reportsActionsTabHook);
    cy.accessTab(manageReportsTabHook);
  });
});
