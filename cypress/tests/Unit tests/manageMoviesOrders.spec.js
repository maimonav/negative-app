import {
  inventoryActionsTabHook,
  ordersTabHook,
  moviesOrdersHook,
  orderNameHook,
  userNameHook,
  actionButtonHook,
  addActionHook,
  editActionHook,
  removeActionHook,
  showActionHook,
  confirmActionHook,
} from "../../../src/consts/data-hooks";

const order = "order";
const movie = "movie";
const supplier = "supplier";

context("Type all fields", () => {
  it("add movies order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${moviesOrdersHook}`).click();
    cy.chooseAction(addActionHook);

    cy.get(`#moviesName`)
      .click()
      .type(movie)
      .type("{esc}");

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(supplier);
  });

  it("show movies order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${moviesOrdersHook}`).click();
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });

  it("edit movies order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${moviesOrdersHook}`).click();
    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });

  it("remove movies order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${moviesOrdersHook}`).click();
    cy.chooseAction(removeActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });

  it("confirm movies order", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(ordersTabHook);
    cy.get(`#${moviesOrdersHook}`).click();
    cy.chooseAction(confirmActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type(order)
      .type("{esc}");
  });
});

// context("Click all buttons", () => {
//   it("add new cafeteria order", () => {
//     cy.accessTab(inventoryActionsTabHook);
//     cy.accessTab(ordersTabHook);
//     cy.get(`#${cafeteriaOrdersHook}`).click();
//     cy.chooseAction(addActionHook);
//   });

//   it("edit cafeteria order", () => {
//     cy.accessTab(inventoryActionsTabHook);
//     cy.accessTab(ordersTabHook);
//     cy.get(`#${cafeteriaOrdersHook}`).click();
//     cy.chooseAction(editActionHook);
//   });

//   it("remove cafeteria order", () => {
//     cy.accessTab(inventoryActionsTabHook);
//     cy.accessTab(ordersTabHook);
//     cy.get(`#${cafeteriaOrdersHook}`).click();
//     cy.chooseAction(removeActionHook);
//   });
// });
