const { faker } = require("@faker-js/faker");

describe("Purchase Page", () => {
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

  it("shows a purchase form with required fields", () => {
    cy.get("#purchases form").should("exist");

    cy.get("select[name='productName']")
      .should("be.visible")
      .find("option")
      .should("have.length", 2);

    cy.contains("label", "Quantity").should("be.visible");

    cy.get("input[name='quantity']")
      .should("be.visible")
      .and("have.attr", "type", "number");

    cy.get("input[name='address']")
      .should("be.visible")
      .and("have.attr", "type", "text");

    cy.get("button[type='submit']")
      .should("be.visible")
      .and("contain.text", "Purchase");
  });

  it("disables submit button when quantity exceeds inventory", () => {
    cy.get("select[name='productName']").select("Test Product");

    cy.get("input[name='quantity']").type("10"); // > inventory 5

    cy.get("button[type='submit']").should("be.disabled");
  });

  it("shows success message and updates inventory after purchase", () => {
    cy.get("select[name='productName']").select("Test Product");

    cy.get("input[name='quantity']").clear().type("2");
    cy.get("input[name='address']").type("123 Main St");

    cy.get("button[type='submit']").click();

    cy.contains("Successfully purchased 2 of Test Product!").should(
      "be.visible",
    );

    cy.wait("@updateProduct");

    cy.intercept("GET", "http://localhost:5202/products", {
      statusCode: 200,
      body: [
        { name: "Test Product", price: 10.99, inventory: 3 },
        { name: "Another Product", price: 20.99, inventory: 3 },
      ],
    }).as("getProductsAfterPurchase");

    cy.reload();
    cy.wait("@getProductsAfterPurchase");

    cy.get("select[name='productName']")
      .find("option")
      .contains("Test Product: 3 left in stock")
      .should("exist");
  });
});
