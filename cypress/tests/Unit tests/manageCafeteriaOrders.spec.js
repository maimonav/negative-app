import {
  inventoryActionsTabHook,
  ordersTabHook,
  cafeteriaOrdersHook,
  orderNameHook,
  actionButtonHook,
  addActionHook,
  editActionHook,
  removeActionHook,
  showActionHook,
  confirmActionHook,
  productQuantityHook,
} from "../../../src/consts/data-hooks";

const order = "order";
const product = "product";
const quantity = "100";

context("Type all fields", () => {
  it("add cafeteria order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${cafeteriaOrdersHook}`).click();
    cy.chooseAction(addActionHook);

    cy.get(`#productsName`)
      .click()
      .type(product)
      .type("{esc}");

    cy.get(`[data-hook=${productQuantityHook}]`)
      .click()
      .type(quantity);

    cy.get(`#finishAddProducts`).click();
  });

  it("show cafeteria order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${cafeteriaOrdersHook}`).click();
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });

  it("edit cafeteria order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${cafeteriaOrdersHook}`).click();
    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });

  it("remove cafeteria order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${cafeteriaOrdersHook}`).click();
    cy.chooseAction(removeActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });

  it("confirm cafeteria order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${cafeteriaOrdersHook}`).click();
    cy.chooseAction(confirmActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });
});
