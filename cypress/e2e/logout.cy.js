describe("logout", () => {
  it("shows a proper logout form when already logged in", () => {
    cy.visit("http://localhost:5173/Index.html", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ username: "TestUser" }),
        );
      },
    });

    cy.get("#logoutButton")
      .should("exist")
      .and("be.visible")
      .and("contain.text", "Logout");
  });
});
