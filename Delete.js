const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "Login.html";
}

document.getElementById("username").textContent = loggedInUser.userName;

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// Load product details
async function loadProduct() {
  const res = await fetch("http://localhost:5202/products");
  const products = await res.json();
  const product = products.find((p) => p.id == id);

  if (!product) {
    alert("Product not found");
    window.location.href = "Index.html";
    return;
  }

  if (product.createdBy !== loggedInUser.id) {
    alert("You are not allowed to delete this product.");
    window.location.href = "Index.html";
    return;
  }

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("productInventory").textContent = product.inventory;
  document.getElementById("productRating").textContent = product.rating;
}

loadProduct();

// Handle delete
document.getElementById("deleteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch(`http://localhost:5202/products/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    alert("Product deleted successfully.");
    window.location.href = "Index.html";
  } else {
    alert("Failed to delete product.");
  }
});
