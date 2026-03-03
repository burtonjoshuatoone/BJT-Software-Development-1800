const { faker } = require("@faker-js/faker");

describe("negativity", () => {
  beforeEach(() => {
    window.localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ id: 1, name: "Test User" }),
    );

    cy.intercept("GET", "http://localhost:5202/products", {
      statusCode: 200,
      body: [
        { name: "Test Product", price: 10.99, inventory: 5 },
        { name: "Another Product", price: 20.99, inventory: 3 },
      ],
    }).as("getProducts");

    cy.intercept("PUT", "http://localhost:5202/products/*", {
      statusCode: 200,
    }).as("updateProduct");

    cy.visit("/purchase.html");

    cy.wait("@getProducts");
  });

  it("disables the submit button when quantity is less than or equal to 0", () => {
    cy.get("select[name='productName']").select("Test Product");
    cy.get("input[name='quantity']").clear().type("0");

    cy.get("button[type='submit']").should("be.disabled");
    cy.get("input[name='quantity']").clear().type("-3");

    cy.get("button[type='submit']").should("be.disabled");
    cy.get("input[name='quantity']").clear();
    cy.get("button[type='submit']").should("be.disabled");
  });
});
