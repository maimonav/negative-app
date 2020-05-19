import {
  categoriesTabHook,
  inventoryActionsTabHook,
  categoryParentNameHook,
  categoryNameHook,
  actionButtonHook,
  addActionHook,
  editActionHook,
  removeActionHook,
  moviesTabHook,
  showActionHook,
} from "../../../src/consts/data-hooks";

const category = "category";

context("Type all fields", () => {
  it("add category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category);

    cy.get(`[data-hook=${categoryParentNameHook}]`)
      .click()
      .type(category)
      .type("{esc}");
  });

  it("show category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{esc}");
  });

  it("edit category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{esc}");

    cy.get(`[data-hook=${categoryParentNameHook}]`)
      .click()
      .type(category)
      .type("{esc}");
  });

  it("remove category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{esc}");
  });
});

context("Click all buttons", () => {
  it("add new category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(addActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
  it("edit category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(editActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(removeActionHook);
    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });
});
