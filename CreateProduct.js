const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  alert("No user is logged in");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
} else {
  document.getElementById("username").textContent = loggedInUser.userName;
}

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const body = {
    name: formData.get("name"),
    price: parseFloat(formData.get("price")),
    inventory: parseInt(formData.get("inventory")),
    rating: parseInt(formData.get("rating")),
    createdBy: loggedInUser.id,
  };

  const result = await fetch("http://localhost:5202/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (result.ok) {
    window.location.replace("Index.html");
  } else {
    alert("Error creating product");
  }
});
