const { faker } = require("@faker-js/faker");

describe("login", () => {
  it("shows a proper login form when not logged in", () => {
    cy.visit("http://localhost:5173/Login.html");

    const userName = faker.string.alpha({ min: 8, max: 40 });
    const passWord = faker.string.alpha({ min: 8, max: 40 });

    cy.get("form").should("be.visible");
    cy.get('input[name="userName"]')
      .should("exist")
      .and("be.visible")
      .and("have.attr", "required");
    cy.get('label[for="userName"]')
      .should("exist")
      .and("contain.text", "Username");
    cy.get('input[name="passWord"]')
      .should("exist")
      .and("be.visible")
      .and("have.attr", "required");
    cy.get('label[for="passWord"]')
      .should("exist")
      .and("contain.text", "Password");
    cy.get('form button[type="submit"]')
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Log in");
  });
});
