import {
  inventoryActionsTabHook,
  inventoryTabHook,
  productNameHook,
  categoryNameHook,
  productPriceHook,
  productQuantityHook,
  productMaxQuantityHook,
  productMinQuantityHook,
  actionButtonHook,
  addActionHook,
  editActionHook,
  removeActionHook,
} from "../../../src/consts/data-hooks";

const product = "product";
const price = "20";
const quantity = "100";
const min = "20";
const max = "100";
const category = "category";

context("Type all fields", () => {
  it("add product", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}]`).click().type(category).type("{esc}");

    cy.get(`[data-hook=${productNameHook}`).click().type(product).type("{esc}");

    cy.get(`[data-hook=${productPriceHook}]`).click().type(price).type("{esc}");
  
    cy.get(`[data-hook=${productQuantityHook}]`).click().type(quantity).type("{esc}");
    
    cy.get(`[data-hook=${productMaxQuantityHook}]`).click().type(max).type("{esc}");
    
    cy.get(`[data-hook=${productMinQuantityHook}]`).click().type(min).type("{esc}");
  });

  it("edit product", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(editActionHook);


    cy.get(`[data-hook=${productNameHook}`).click().type(product).type("{esc}");
    
    cy.get(`[data-hook=${categoryNameHook}]`).click().type(category).type("{esc}");

    cy.get(`[data-hook=${productPriceHook}]`).click().type(price).type("{esc}");
  
    cy.get(`[data-hook=${productQuantityHook}]`).click().type(quantity).type("{esc}");
    
    cy.get(`[data-hook=${productMaxQuantityHook}]`).click().type(max).type("{esc}");
    
    cy.get(`[data-hook=${productMinQuantityHook}]`).click().type(min).type("{esc}");
  });

  it("remove product", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${productNameHook}`).click().type(product).type("{esc}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});

context("Click all buttons", () => {
  it("edit movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(removeActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});
