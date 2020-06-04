import {
  logFileButtonHook,
  logFileSelectButtonHook,
} from "../../../src/consts/data-hooks";

const systemLogType = "System";
const dbLogType = "db";

context("Manage Log File", () => {
  it("Present Sysyrm Log", () => {
    cy.get(`#${logFileButtonHook}`).click();

    cy.get(`#logType`)
      .click()
      .type(systemLogType)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`#${logFileSelectButtonHook}`).click();
  });

  it("Present DB Log", () => {
    cy.get(`#${logFileButtonHook}`).click();

    cy.get(`#logType`)
      .click()
      .type(dbLogType)
      .type("{downarrow}")
      .type("{enter}")
      .type("{esc}");

    cy.get(`#${logFileSelectButtonHook}`).click();
  });
});
