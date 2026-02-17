const { faker } = require("@faker-js/faker");

describe("products", () => {
  it("creates products", () => {
    cy.visit("http://localhost:5173/CreateProduct.html");

    const name = faker.commerce.productName();
    const price = faker.number
      .float({ min: 0, max: 1000, precision: 0.01 })
      .toFixed(2);
    const inventory_count = faker.number.int({ min: 0, max: 100 });

    cy.get("form").should("be.visible");
    cy.get('input[name="price"]').type(price);
    cy.get('input[name="inventory_count"]').type(inventory_count);
    cy.get('form button[type="submit"]').click();

    cy.url().should("eq", "http://localhost:5173/CreateProduct.html");

    cy.visit("http://localhost:5173/Index.html");

    cy.get('ul[name="products_list"] li')
      .last()
      .should("contain.text", name)
      .and("contain.text", price)
      .and("contain.text", inventory_count);
  });
});

// const { faker } = require("@faker-js/faker");

// describe("products", () => {
//   it("creates products"),
//     () => {
//       cy.visit("http://localhost:5173");

//       const price = faker.number.float({ min: 0, max: 1000 });
//       const inventory_count = faker.number.int({ min: 0, max: 100 });

//       cy.get("form").should("be.visible");
//       cy.get('form input[name="price"]').type(price);
//       cy.get('form input[name="inventory_count"][type="number"]').type(
//         inventory_count,
//       );
//       cy.get('form button[type="submit"]')
//         .should("be.visible")
//         .and("have.text", "Create Product")
//         .click();

//       cy.get('ul[name="products_list"] li')
//         .last()
//         .should("contain.text", `Price: ${price}`)
//         .and("contain.text", `Inventory Count: ${inventory_count}`);

//       cy.url("eq", "http://localhost:5173/");
//     });
// });
