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
  } from "../../../src/consts/data-hooks";

  const category = "category";
  
  context("Type all fields", () => {
    it("add category", () => {
      cy.accessTab(inventoryActionsTabHook);
      cy.accessTab(categoriesTabHook);
      cy.chooseAction(addActionHook);
  
      cy.get(`[data-hook=${categoryNameHook}`).click().type(category).type("{esc}");
  
      cy.get(`[data-hook=${categoryParentNameHook}]`).click().type(category).type("{esc}");
    });
  
    it("edit category", () => {
      cy.accessTab(inventoryActionsTabHook);
      cy.accessTab(categoriesTabHook);
      cy.chooseAction(editActionHook);
  
      cy.get(`[data-hook=${categoryNameHook}`).click().type(category).type("{esc}");
  
      cy.get(`[data-hook=${categoryParentNameHook}]`).click().type(category).type("{esc}");
    });
  
    it("remove category", () => {
      cy.accessTab(inventoryActionsTabHook);
      cy.accessTab(categoriesTabHook);
      cy.chooseAction(removeActionHook);
  
      cy.get(`[data-hook=${categoryNameHook}`).click().type(category).type("{esc}");
  
      cy.get(`[data-hook=${actionButtonHook}]`).click();
    });
  });
  
  context("Click all buttons", () => {
    it("edit movie", () => {
      cy.accessTab(inventoryActionsTabHook);
      cy.accessTab(categoriesTabHook);
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
  