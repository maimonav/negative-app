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
  actionButtonHook,
} from "../../../src/consts/data-hooks";

const employee = "employee";
const password = "password";
const firstName = "test";
const lastName = "test";
const permissions = "ADMIN";
const contactDetails = "test@gmail.com";
const editedFirstName = "changed";
const editedLastName = "changed";
const editedPermissions = "MANAGER";
const editedContactDetails = "changed@gmail.com";
context("Manage Employees", () => {
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

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  it.only("edit employee - first name", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${firstNameHook}`)
      .click()
      .type(editedFirstName);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  it("edit employee - last name", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${lastNameHook}`)
      .click()
      .type(editedLastName);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  it("edit employee - permissions", () => {
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
      .type(editedPermissions)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type(contactDetails);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
  });

  it("edit employee - contact details", () => {
    cy.accessTab(userActionsTabHook);
    cy.accessTab(employeesTabHook);
    cy.chooseAction(editActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`)
      .click()
      .type(editedContactDetails);

    cy.get(`[data-hook=${actionButtonHook}]`).click();

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");

    cy.get(`[data-hook=${contactDetailsHook}]`);
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

    cy.chooseAction(showActionHook);

    cy.get(`[data-hook=${userNameHook}`)
      .click()
      .type(employee)
      .type("{downarrow}")
      .type("{enter}");
  });
});
