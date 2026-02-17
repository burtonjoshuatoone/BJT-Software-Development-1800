const getResponse = await fetch("http://localhost:5202/products");
const productsJson = await getResponse.json();
const products_list = document.querySelector("ul[name=products_list]");
for (let i = 0; i < productsJson.length; i++) {
  const product = productsJson[i];
  const { inventory_count, price } = product;
  const newLi = document.createElement("li");
  newLi.innerText = `Price: ${price}, Inventory Count: ${inventory_count}, Rating: ${rating}`;
  products_list.appendChild(newLi);
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
});
