Cypress.Commands.add("startSystem", () => {
  cy.visit("http://localhost:3000/");
});

Cypress.Commands.add("logout", () => {
  cy.get("[data-hook=logoutTab]").click();
  cy.get("[data-hook=logoutButton]").click();
});
