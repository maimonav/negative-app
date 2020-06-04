import {
  inventoryActionsTabHook,
  notificationButtonHook,
  categoriesTabHook,
  categoryNameHook,
  ordersTabHook,
  orderNameHook,
  moviesOrdersHook,
  actionButtonHook,
  addActionHook,
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
  moviesTabHook,
  movieNameHook,
  confirmActionHook,
} from "../../../src/consts/data-hooks";

const order = "order";
const product = "product";
const price = "20";
//const quantity = "10";
const min = "20";
const max = "100";
const category = "category";
const supplier = "supplier";
const contactDetails = "test@gmail.com";
const movie = "movie";

function addProduct(quantity) {
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

function addMovie() {
  cy.accessTab(inventoryActionsTabHook);
  cy.accessTab(categoriesTabHook);
  cy.chooseAction(addActionHook);

  cy.get(`[data-hook=${categoryNameHook}`)
    .click()
    .type(category);

  cy.get(`[data-hook=${actionButtonHook}]`).click();

  cy.accessTab(inventoryActionsTabHook);
  cy.accessTab(moviesTabHook);
  cy.chooseAction(addActionHook);

  cy.get(`[data-hook=${movieNameHook}`)
    .click()
    .type(movie);

  cy.get(`[data-hook=${categoryNameHook}]`)
    .click()
    .type(category)
    .type("{downarrow}")
    .type("{enter}")
    .type("{esc}");

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
  cy.get(`#${moviesOrdersHook}`).click();
  cy.chooseAction(addActionHook);

  cy.get(`#moviesName`)
    .click()
    .type(movie)
    .type("{downarrow}")
    .type("{enter}")
    .type("{esc}");

  cy.get(`[data-hook=${userNameHook}`)
    .click()
    .type(supplier)
    .type("{downarrow}")
    .type("{enter}")
    .type("{esc}");

  cy.get(`[data-hook=${actionButtonHook}]`).click();
}

context("Manage Notifications", () => {
  it("Low quantity in product", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addProduct("10");

    cy.get(`[data-hook=${notificationButtonHook}]`).click();
    cy.get("#demo-popup-popover > div:nth-child(1)").click();
  });

  it("High quantity in product", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addProduct("200");

    cy.get(`[data-hook=${notificationButtonHook}]`).click();
    cy.get("#demo-popup-popover > div:nth-child(1)").click();
  });

  it("Comfirm movies", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addMovie();
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

    cy.get("#edit").click();

    cy.get(
      "#root > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > div > div:nth-child(4) > div > div > div > div.Component-horizontalScrollContainer-1238 > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > div > div > input"
    )
      .click()
      .type("1");

    cy.get(
      "#root > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > div > div:nth-child(4) > div > div > div > div.Component-horizontalScrollContainer-1238 > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > div > input"
    )
      .click()
      .type("26");

    cy.get("#check").click();

    cy.get("#editTableButton").click();
    cy.get("#confirmOrder").click();

    cy.get(`[data-hook=${notificationButtonHook}]`).click();
    cy.get("#demo-popup-popover > div:nth-child(1)").click();
  });
});
