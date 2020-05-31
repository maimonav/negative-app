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
  showActionHook,
  categoriesTabHook
} from "../../../src/consts/data-hooks";

const product = "product";
const price = "20";
const updatePrice = "40";
const quantity = "100";
const min = "20";
const max = "100";
const category = "category";

context("Manage Products", () => {
  it("add product", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}]`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product);

    cy.get(`[data-hook=${productPriceHook}]`)
      .click()
      .type(price);

    cy.get(`[data-hook=${productQuantityHook}]`)
      .click()
      .type(quantity);

    cy.get(`[data-hook=${productMaxQuantityHook}]`)
      .click()
      .type(max);

    cy.get(`[data-hook=${productMinQuantityHook}]`)
      .click()
      .type(min);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");
  });

  it("edit product", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}]`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product);

    cy.get(`[data-hook=${productPriceHook}]`)
      .click()
      .type(price);

    cy.get(`[data-hook=${productQuantityHook}]`)
      .click()
      .type(quantity);

    cy.get(`[data-hook=${productMaxQuantityHook}]`)
      .click()
      .type(max);

    cy.get(`[data-hook=${productMinQuantityHook}]`)
      .click()
      .type(min);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${categoryNameHook}]`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${productPriceHook}]`)
      .click()
      .type(updatePrice);
  });

  it("remove product", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}]`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product);

    cy.get(`[data-hook=${productPriceHook}]`)
      .click()
      .type(price);

    cy.get(`[data-hook=${productQuantityHook}]`)
      .click()
      .type(quantity);

    cy.get(`[data-hook=${productMaxQuantityHook}]`)
      .click()
      .type(max);

    cy.get(`[data-hook=${productMinQuantityHook}]`)
      .click()
      .type(min);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product)
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});
