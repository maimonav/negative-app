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
const updatedQuantity = "50";
const min = "20";
const max = "100";
const category = "category";
const shiftManager = "shiftManager";

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

  it.only("edit product by shift manager", () => {
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

    cy.addEmployee(
      "Shift Manager",
      shiftManager,
      shiftManager,
      shiftManager,
      shiftManager,
      shiftManager
    );
    cy.logout();
    cy.login(shiftManager, shiftManager);

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${productQuantityHook}]`)
      .click()
      .type(updatedQuantity);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product)
      .type("{downarrow}")
      .type("{enter}");
  });

  it.only("remove product", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(inventoryTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${productNameHook}`)
      .click()
      .type(product)
      .type("{downarrow}");
  });
});
