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
  categoriesTabHook,
  categoryNameHook,
  moviesTabHook,
  movieNameHook,
  userActionsTabHook,
  suppliersTabHook,
  contactDetailsHook,
  orderDateHook,
} from "../../../src/consts/data-hooks";
import moment from "moment";

const order = "order";
const orderId = `user, ${moment(new Date()).format("DD/MM/YYYY")}`;
const movie = "movie";
const category = "categoryMovie";
const supplier = "supplier";
const contactDetails = "test@gmail.com";

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

context("Manage Movie Orders", () => {
  it("add movies order", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addMovie();
    addSupplier();
    addOrder();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${orderNameHook}`)
      .click()
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");
  });

  it("edit movies order", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addMovie();
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

  it("remove movies order", () => {
    cy.addEmployee("MANAGER", "user", "123", "user", "user", "tmp");
    cy.logout();
    cy.login("user", "123");
    addMovie();
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

  it("confirm movies order", () => {
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
  });
});
