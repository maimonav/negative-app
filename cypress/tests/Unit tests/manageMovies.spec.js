import {
  inventoryActionsTabHook,
  movieNameHook,
  categoryNameHook,
  actionButtonHook,
  addActionHook,
  editActionHook,
  removeActionHook,
  moviesTabHook,
  keyHook,
  examinationRoomHook,
} from "../../../src/consts/data-hooks";

const movie = "movie";
const key = "key";
const examinationRoom = "examinationRoom";

context("Type all fields", () => {
  it("add movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${movieNameHook}`).click().type(movie).type("{esc}");

    cy.get(`[data-hook=${categoryNameHook}]`).click().type(movie).type("{esc}");
  });

  it("edit movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${movieNameHook}`).click().type(movie).type("{esc}");

    cy.get(`[data-hook=${categoryNameHook}]`).click().type(movie).type("{esc}");

    cy.get(`[data-hook=${keyHook}]`).click().type(key);

    cy.get(`[data-hook=${examinationRoomHook}]`).click().type(examinationRoom);
  });

  it("remove movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${movieNameHook}`).click().type(movie).type("{esc}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});

context("Click all buttons", () => {
  it("edit movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(removeActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});
