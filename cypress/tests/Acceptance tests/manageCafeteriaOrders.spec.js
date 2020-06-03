import {
  inventoryActionsTabHook,
  ordersTabHook,
  categoriesTabHook,
  categoryNameHook,
  cafeteriaOrdersHook,
  orderNameHook,
  actionButtonHook,
  addActionHook,
  editActionHook,
  removeActionHook,
  showActionHook,
  confirmActionHook,
  inventoryTabHook,
  productNameHook,
  productPriceHook,
  productQuantityHook,
  productMaxQuantityHook,
  productMinQuantityHook,
  userActionsTabHook,
  suppliersTabHook,
  userNameHook,
  contactDetailsHook,
} from "../../../src/consts/data-hooks";

const order = "order";
const product = "product";
const price = "20";
const quantity = "80";
const min = "20";
const max = "100";
const category = "category";
const supplier = "supplier";
const contactDetails = "test@gmail.com";

function addProduct() {
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
}

function addSupplier() {
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
}

function addOrder() {
  cy.accessTab(inventoryActionsTabHook);
  cy.accessTab(ordersTabHook);
  cy.get(`#${cafeteriaOrdersHook}`).click();
  cy.chooseAction(addActionHook);

  cy.get(`#productsName`)
    .click()
    .type(product)
    .type("{downarrow}")
    .type("{enter}")
    .type("{esc}");

  cy.get(`[data-hook=${productQuantityHook}]`)
    .click()
    .type(quantity);

  cy.get(`#addProduct`).click();
  cy.get(`#finishAddProducts`).click();

  cy.get(`[data-hook=${actionButtonHook}]`).click();

  // cy.get("#editTableButton").click();

  cy.get(`[data-hook=${userNameHook}`)
    .click()
    .type(supplier)
    .type("{downarrow}")
    .type("{enter}")
    .type("{esc}");

  cy.get("#addCafeteriaOrder").click();
}

context("Manage Cafeteria Orders", () => {
  it("add cafeteria order", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addProduct();
    addSupplier();
    addOrder();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");
  });

  it("edit cafeteria order", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addProduct();
    addSupplier();
    addOrder();

    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get("#chooseOrder").click();
  });

  it("remove cafeteria order", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addProduct();
    addSupplier();
    addOrder();

    cy.chooseAction(removeActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get("#removeOrder").click();
  });

  it("confirm cafeteria order", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addProduct();
    addSupplier();
    addOrder();

    cy.chooseAction(confirmActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get("#chooseOrder").click();
  });
});
