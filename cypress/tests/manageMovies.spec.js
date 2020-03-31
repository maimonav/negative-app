import {
  inventoryActionsTabHook,
  movieNameHook,
  categoryNameHook,
  actionButtonHook,
  editActionHook,
  removeActionHook,
  moviesTabHook,
  keyHook,
  examinationRoomHook
} from "../../src/consts/data-hooks";

const user = "admin";
const movie = "movie";
const key = "key";
const examinationRoom = "examinationRoom";
context("Manage Movies", () => {
  beforeEach(() => {
    cy.startSystem();
    cy.login(user, user);
  });

  it("edit movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${movieNameHook}`)
      .click()
      .type(movie)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${categoryNameHook}]`)
      .click()
      .type(movie)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${keyHook}]`)
      .click()
      .type(key);

    cy.get(`[data-hook=${examinationRoomHook}]`)
      .click()
      .type(examinationRoom);

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${movieNameHook}`)
      .click()
      .type(movie)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  afterEach(() => {
    cy.logout();
  });
});
