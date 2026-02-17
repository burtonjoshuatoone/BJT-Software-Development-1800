const { faker } = require("@faker-js/faker");

describe("accounts", () => {
  it("creates accounts", () => {
    cy.visit("http://localhost:5173/CreateAccount.html");

    const userName = faker.string.alpha({ min: 8, max: 40 });
    const passWord = faker.string.alpha({ min: 8, max: 40 });

    cy.get("form").should("be.visible");
    cy.get('input[name="userName"]').type(userName);
    cy.get('input[name="passWord"]').type(passWord);
    cy.get('form button[type="submit"]').click();

    cy.get("#errorMessage")
      .should("be.visible")
      .and("contain", "Username already exists");

    cy.url().should("eq", "http://localhost:5173/Index.html");
  });
});
