const getResponse = await fetch("http://localhost:5202/products");
const productsJson = await getResponse.json();
console.log(productsJson);
const products_list = document.querySelector("ul[name=products_list]");
for (let i = 0; i < productsJson.length; i++) {
  const product = productsJson[i];
  const { inventory_count, price } = product;
  const newLi = document.createElement("li");
  newLi.innerText = `Price: ${price}, Inventory Count: ${inventory_count}`;
  products_list.appendChild(newLi);
}
