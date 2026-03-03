const getResponse = await fetch("http://localhost:5202/products");
const productsJson = await getResponse.json();
const products_list = document.querySelector("ul[name=products_list]");
products_list.innerHTML = ""; // clear old items

for (let i = 0; i < productsJson.length; i++) {
  const product = productsJson[i];
  const { name, price, inventory, rating } = product;

  const card = document.createElement("li");
  card.classList.add("product-card");

  card.innerHTML = `
    <h3>${name}</h3>
    <p>Price: $${price}</p>
    <p>Inventory: ${inventory}</p>
    <p>Rating: ${rating}</p>
    <button class="purchase-btn" data-id="${product.id}"><a href="purchase.html">Purchase</a></button>
  `;

  products_list.appendChild(card);
}

// Get logged in user info from LocalStorage
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// If no user is logged in, redirect to login page
if (!loggedInUser) {
  alert("No user is logged in");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
} else {
  // Display username on home page
  document.getElementById("username").textContent = loggedInUser.username;
}

// Add event listener to logout button
document.getElementById("logoutButton").addEventListener("click", function () {
  // Remove logged in user info from LocalStorage
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully, thank you!");

  // Redirect to login page after 1 second
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("purchase-btn")) {
      const id = e.target.dataset.id;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(id);
      localStorage.setItem("cart", JSON.stringify(cart));

      alert("Added to cart!");
    }
  });
});
