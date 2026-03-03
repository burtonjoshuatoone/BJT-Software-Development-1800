const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "Login.html";
}
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const body = {
    Name: formData.get("name"),
    Price: formData.get("price"),
    Inventory: formData.get("inventory"),
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
