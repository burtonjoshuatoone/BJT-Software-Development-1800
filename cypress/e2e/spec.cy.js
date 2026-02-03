const { faker } = require("@faker-js/faker");

describe("products", () => {
  it("lists products", () => {
    cy.visit("http://localhost:5173/");

    cy.get("h1").should("have.text", "Products:");

    cy.get('ul[name="products_list"]').should("be.visible");
  });

  (it("creates products"),
    () => {
      cy.visit("http://localhost:5173/");

      const price = faker.number.decimal({ min: 0, max: 1000 });
      const inventory_count = faker.number.int({ min: 0, max: 100 });

      cy.get("form").should("be.visible");
      cy.get('form input[name="price"]').should("be.visible").type(price);
      cy.get('form input[name="inventory_count"][type="number"]')
        .should("be.visible")
        .type(inventory_count);
      cy.get('form button[type="submit"]')
        .should("be.visible")
        .and("have.text", "Create Product")
        .click();

      cy.get('ul[name="products_list"] li:last')
        .should("be.visible")
        .and(
          "have.text",
          `Price: ${price}, Inventory Count: ${inventory_count}`,
        );

      cy.url("eq", "http://localhost:5173/");
    });
});
