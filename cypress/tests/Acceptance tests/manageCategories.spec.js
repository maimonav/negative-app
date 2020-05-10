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
const editCategoryName = "category2";

context("Type all fields", () => {
  it("add category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${categoryParentNameHook}]`);
  });

  it("edit category - change category parent", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(editCategoryName);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{esc}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.get(`[data-hook=${categoryParentNameHook}`)
      .click()
      .type(editCategoryName);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${categoryParentNameHook}]`);
  });

  it("remove category", () => {
    cy.accessTab(inventoryActionsTabHook);
    cy.accessTab(categoriesTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{esc}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${categoryNameHook}`)
      .click()
      .type(category)
      .type("{downarrow}")
      .type("{enter}");
  });
});
