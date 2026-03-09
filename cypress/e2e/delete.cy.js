const { faker } = require("@faker-js/faker");

describe("Delete Product Flow", () => {
  const testUser = {
    id: 1,
    userName: "burton",
    passWord: "1234",
  };

  const product = {
    name: "Test Product",
    price: 10,
    inventory: 5,
    rating: 3,
    createdBy: 1,
  };

  beforeEach(() => {
    cy.visit("http://localhost:5173/Index.html", {
      onBeforeLoad(win) {
        win.localStorage.setItem("loggedInUser", JSON.stringify(testUser));
      },
    });
  });

  it("shows delete button only for products created by logged-in user", () => {
    cy.request("POST", "http://localhost:5202/products", product).then(
      (response) => {
        const id = response.body.id;

        cy.visit("http://localhost:5173/Index.html", {
          onBeforeLoad(win) {
            win.localStorage.setItem("loggedInUser", JSON.stringify(testUser));
          },
        });

        cy.get(`a[href="Delete.html?id=${id}"]`).should("exist");
      },
    );
  });

  it("allows logged-in user to delete their own product", () => {
    cy.request("POST", "http://localhost:5202/products", product).then(
      (response) => {
        const id = response.body.id;

        cy.intercept("DELETE", `http://localhost:5202/products/${id}`).as(
          "deleteProduct",
        );

        cy.visit(`http://localhost:5173/Delete.html?id=${id}`, {
          onBeforeLoad(win) {
            win.localStorage.setItem("loggedInUser", JSON.stringify(testUser));
          },
        });

        cy.get("#deleteForm").submit();

        cy.wait("@deleteProduct").its("response.statusCode").should("eq", 200);

        cy.url().should("include", "Index.html");
      },
    );
  });

  it("shows success message after deletion", () => {
    cy.request("POST", "http://localhost:5202/products", product).then(
      (response) => {
        const id = response.body.id;

        cy.visit(`http://localhost:5173/Delete.html?id=${id}`, {
          onBeforeLoad(win) {
            win.localStorage.setItem("loggedInUser", JSON.stringify(testUser));
          },
        });

        cy.get("#deleteForm").submit();

        cy.on("window:alert", (txt) => {
          expect(txt).to.contain("Product deleted successfully");
        });
      },
    );
  });
});
