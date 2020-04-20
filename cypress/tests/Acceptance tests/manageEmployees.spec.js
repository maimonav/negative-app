import {
  userActionsTabHook,
  employeesTabHook,
  permissionsHook,
  userNameHook,
  passwordHook,
  firstNameHook,
  lastNameHook,
  contactDetailsHook,
  addActionHook,
  showActionHook,
  editActionHook,
  removeActionHook,
  actionButtonHook
} from "../../../src/consts/data-hooks";

const user = "admin";
const employee = "employee";
const password = "password";
const firstName = "test";
const lastName = "test";
const permissions = "ADMIN";
const contactDetails = "test@gmail.com";
context("Manage Employees", () => {
  beforeEach(() => {
    cy.startSystem();
    cy.login(user, user);
  });

  it("add new employee", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(addActionHook);

    cy.get(`[data-hook=${permissionsHook}`)
      .click()
      .type(permissions)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee);

    cy.get(`[data-hook=${passwordHook}`)
      .click()
      .type(password);

    cy.get(`[data-hook=${firstNameHook}`)
      .click()
      .type(firstName);

    cy.get(`[data-hook=${lastNameHook}`)
      .click()
      .type(lastName);

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type(contactDetails);

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("show employee", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  it("edit employee", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${permissionsHook}`)
      .click()
      .type(permissions)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${passwordHook}`)
      .click()
      .type(password);

    cy.get(`[data-hook=${firstNameHook}`)
      .click()
      .type(firstName);

    cy.get(`[data-hook=${lastNameHook}`)
      .click()
      .type(lastName);

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type(contactDetails);

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  it("remove employee", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(removeActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${actionButtonHook}]`).click();
  });

  afterEach(() => {
    cy.matchSnapshot();
    cy.logout();
  });
});
