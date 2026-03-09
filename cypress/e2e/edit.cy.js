const { faker } = require("@faker-js/faker");

describe("Edit Product Page", () => {
  beforeEach(() => {
    // Simulate logged-in user
    window.localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        id: 1,
        userName: "Burton",
        passWord: "LavenderGuster31",
      }),
    );

    // Mock backend products list
    cy.intercept("GET", "http://localhost:5202/products", {
      statusCode: 200,
      body: [
        {
          id: 10,
          name: "Old Product",
          price: 20,
          inventory: 5,
          rating: 3,
          createdBy: 1, // belongs to logged-in user
        },
        {
          id: 11,
          name: "Other User Product",
          price: 50,
          inventory: 10,
          rating: 4,
          createdBy: 2, // NOT owned by logged-in user
        },
      ],
    }).as("getProducts");
  });

  it("allows editing only if the product belongs to the logged-in user", () => {
    cy.visit("/Edit.html?id=10"); // product created by user
    cy.wait("@getProducts");

    // Form fields should be visible
    cy.get("#name").should("be.visible").and("have.value", "Old Product");
    cy.get("#price").should("be.visible").and("have.value", "20");
    cy.get("#inventory").should("be.visible").and("have.value", "5");
    cy.get("#rating").should("be.visible").and("have.value", "3");

    // Update fields
    cy.get("#name").clear().type("Updated Product");
    cy.get("#price").clear().type("99");
    cy.get("#inventory").clear().type("7");
    cy.get("#rating").clear().type("5");

    // Mock PUT request
    cy.intercept("PUT", "http://localhost:5202/products/10", {
      statusCode: 200,
      body: {
        id: 10,
        name: "Updated Product",
        price: 99,
        inventory: 7,
        rating: 5,
        createdBy: 1,
      },
    }).as("updateProduct");

    // Submit form
    cy.get("button[type='submit']").click();
    cy.wait("@updateProduct");

    // Expect success message
    cy.on("window:alert", (msg) => {
      expect(msg).to.contain(`Product 10 updated successfully!`);
    });

    // After redirect, mock updated product list
    cy.intercept("GET", "http://localhost:5202/products", {
      statusCode: 200,
      body: [
        {
          id: 10,
          name: "Updated Product",
          price: 99,
          inventory: 7,
          rating: 5,
          createdBy: 1,
        },
      ],
    }).as("updatedList");

    cy.url().should("include", "Index.html");
    cy.wait("@updatedList");

    // Verify updated product appears in list
    cy.contains("Updated Product").should("exist");
    cy.contains("$99").should("exist");
    cy.contains("Inventory: 7").should("exist");
  });

  it("blocks editing if product does not belong to logged-in user", () => {
    cy.visit("/Edit.html?id=11"); // product created by someone else
    cy.wait("@getProducts");

    cy.on("window:alert", (msg) => {
      expect(msg).to.contain("not allowed");
    });

    cy.url().should("include", "Index.html");
  });
});
