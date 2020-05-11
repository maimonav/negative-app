import {
  inventoryActionsTabHook,
  movieNameHook,
  categoriesTabHook,
  categoryNameHook,
  actionButtonHook,
  addActionHook,
  showActionHook,
  editActionHook,
  removeActionHook,
  moviesTabHook,
  keyHook,
  examinationRoomHook,
} from "../../../src/consts/data-hooks";

const movie = "movie";
const category = "categoryMovie";
const key = "key";
const examinationRoom = "examinationRoom";

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

context("Manage Movies", () => {
  it("add movie", () => {
    addMovie();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${movieNameHook}`)
      .click()
      .type(movie)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${categoryNameHook}]`);
  });

  it("edit movie", () => {
    addMovie();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${movieNameHook}`)
      .click()
      .type(movie)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${categoryNameHook}]`)
      .click()
      .type(movie)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${keyHook}]`)
      .click()
      .type(key);

    cy.get(`[data-hook=${examinationRoomHook}]`)
      .click()
      .type(examinationRoom);

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove movie", () => {
    addMovie();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${movieNameHook}`)
      .click()
      .type(movie)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});
