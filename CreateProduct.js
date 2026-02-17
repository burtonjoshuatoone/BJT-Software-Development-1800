if (localStorage.getItem("loggedIn") !== "true") {
  window.location.replace("Login.html");
}
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const body = {
    Price: formData.get("price"),
    Inventory_Count: formData.get("inventory_count"),
    Rating: formData.get("rating"),
  };
  const result = await fetch("http://localhost:5202/products", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const resultBody = await result.text();
  window.location.replace("http://localhost:5173/Index.html");
});
