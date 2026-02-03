const getResponse = await fetch("http://localhost:5173/products");
const productsJson = await getResponse.json();
const products_list = document.querySelector("ul[name=products_list]");
for (let i = 0; i < productsJson.length; i++) {
  const product = productsJson[i];
  const { inventory_count, price } = product;
  const newLi = document.createElement("li");
  newLi.innerText = `Price: ${price}, Inventory Count: ${inventory_count}`;
  products_list.appendChild(newLi);
}

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const body = {
    Price: formData.get("price"),
    Inventory_Count: formData.get("inventory_count"),
  };
  await fetch("http://localhost:5173/products", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  location.reload();
});
