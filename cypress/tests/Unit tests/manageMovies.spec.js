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
} from "../../../src/consts/data-hooks";

const user = "admin";
const movie = "movie";
const key = "key";
const examinationRoom = "examinationRoom";

context("Type all fields", () => {
  before(() => {
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
      .type("{esc}");

    cy.get(`[data-hook=${categoryNameHook}]`)
      .click()
      .type(movie)
      .type("{esc}");

    cy.get(`[data-hook=${keyHook}]`)
      .click()
      .type(key);

    cy.get(`[data-hook=${examinationRoomHook}]`)
      .click()
      .type(examinationRoom);
  });

  it("remove movie", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(moviesTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${movieNameHook}`)
      .click()
      .type(movie)
      .type("{esc}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  afterEach(() => {
    cy.matchSnapshot();
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

  afterEach(() => {
    cy.matchSnapshot();
  });

  after(() => {
    cy.logout();
  });
});
