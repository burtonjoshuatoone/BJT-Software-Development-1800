const { faker } = require("@faker-js/faker");

describe("authorization", () => {
  it("only allows users that are logged in to create products", () => {
    localStorage.setItem("loggedIn", "true");

    cy.visit("http://localhost:5173/CreateProduct.html");

    const name = "Test Product";
    const price = "19";
    const inventory_count = "11";

    cy.get('input[name="name"]').type(name);
    cy.get('input[name="price"]').type(price);
    cy.get('input[name="inventory_count"]').type(inventory_count);
    cy.get('form button[type="submit"]').click();

    cy.url().should("include", "CreateProduct.html");
  });
});
