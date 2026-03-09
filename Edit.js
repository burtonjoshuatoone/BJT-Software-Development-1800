const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "Login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// Load product data
async function loadProduct() {
  const res = await fetch(`http://localhost:5202/products`);
  const products = await res.json();
  const product = products.find((p) => p.id == id);

  if (!product) {
    alert("Product not found");
    return;
  }

  if (product.createdBy !== loggedInUser.id) {
    alert("You are not allowed to edit this product.");
    window.location.href = "Index.html";
    return;
  }

  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("inventory").value = product.inventory;
  document.getElementById("rating").value = product.rating;
}

loadProduct();

// Save changes
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedProduct = {
    id: Number(id),
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    inventory: Number(document.getElementById("inventory").value),
    rating: Number(document.getElementById("rating").value),
    createdBy: loggedInUser.id,
  };

  const res = await fetch(`http://localhost:5202/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedProduct),
  });

  if (res.ok) {
    alert(`Product ${id} updated successfully!`);
    window.location.href = "Index.html";
  } else {
    alert("Failed to update product");
  }
});
