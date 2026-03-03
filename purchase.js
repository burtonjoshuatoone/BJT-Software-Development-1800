const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  window.location.href = "Login.html";
}

class DatabaseObjectClass {
  toString() {
    throw new Error("toString not implemented");
  }
}

class Product extends DatabaseObjectClass {
  constructor(name, price, inventory) {
    super();
    this.name = name;
    this.price = price;
    this.inventory = inventory;
  }

  toString() {
    return `${this.name}: ${this.inventory} left in stock. Price:${this.price}`;
  }
}

class Purchase {
  constructor(params) {
    const { product, quantity, address } = params;
    this.product = product;
    this.quantity = quantity;
    this.address = address;
  }

  toString() {
    return `Purchasing ${this.quantity} of ${this.product.name} and we're sending it to ${this.address}!`;
  }
  static create(params) {
    return new Purchase(params);
  }
}

class ProductDao {
  static seeds = [
    {
      name: "Yamaha 5 drum tenor",
      price: 199.99,
      inventory: 25,
    },
    {
      name: "Yamaha Marching Snare",
      price: 179.99,
      inventory: 35,
    },
    {
      name: "Zildjan Marching Cymbals",
      price: 149.99,
      inventory: 40,
    },
    {
      name: "Yamaha Flub Drum",
      price: 50.99,
      inventory: 85,
    },
    {
      name: "5 Yamaha Drum Marching Bass Drum Set",
      price: 599.99,
      inventory: 5,
    },
    {
      name: "Yamaha Marching Timpani",
      price: 259.99,
      inventory: 15,
    },
  ];

  getAll() {
    throw new Error("Product getAll not implemented");
  }

  async getProductByName(name) {
    const products = await this.getAll();
    return products.find((p) => p.name === name);
  }

  update(product) {
    throw new Error("Not implemented, Product");
  }
}

class ApiProductDao extends ProductDao {
  async getAll() {
    const response = await fetch("http://localhost:5202/products");
    const productsData = await response.json();

    return productsData.map((p) => new Product(p.name, p.price, p.inventory));
  }

  async update(product) {
    await fetch(`http://localhost:5202/products/${product.name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        price: product.price,
        inventory: product.inventory,
      }),
    });
  }
}

async function loadProducts() {
  productNameSelect.innerHTML = "";
  const products = await productDao.getAll();

  for (let product of products) {
    const option = document.createElement("option");
    option.innerText = product.toString();
    //option.innerText = `${product.name} — $${product.price} (${product.inventory} left)`;
    option.value = product.name;
    productNameSelect.appendChild(option);
  }

  if (products.length > 0) {
    const firstProduct = products[0];
    quantityInput.setAttribute("max", firstProduct.inventory);

    if (firstProduct.inventory === 0) {
      submitButton.disabled = true;
      submitButton.textContent = "Out of Stock";
    } else {
      submitButton.disabled = false;
      submitButton.textContent = "Purchase";
    }
  }
}

class SessionStorageProductDao extends ProductDao {
  constructor() {
    super();
    this.database = sessionStorage;
  }

  getAll() {
    const productsAsJSON = this.database.getItem("products");
    const productsData = productsAsJSON
      ? JSON.parse(productsAsJSON)
      : ProductDao.seeds;
    return productsData.map((productData) => {
      const { name, price, inventory } = productData;
      return new Product(name, price, inventory);
    });
  }

  update(product) {
    const existingProduct = this.getAll();
    const indexToDelete = existingProduct.findIndex(
      (productInList) => productInList.name == product.name,
    );
    existingProduct.splice(indexToDelete, 1, product);
    this.database.setItem("products", JSON.stringify(existingProduct));
  }
}

class CookieStorageProductDao extends ProductDao {
  constructor() {
    super();
    this.database = document.cookie;
  }

  getAll() {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("product"))
      ?.split("=")[1];

    const productsData = cookieValue
      ? JSON.parse(cookieValue)
      : ProductDao.seeds;
    return productsData.map(
      (productData) =>
        new Product(productData.name, productData.price, productData.inventory),
    );
  }

  update(product) {
    const existingProducts = this.getAll();
    const indexToDelete = existingProducts.findIndex(
      (productInList) => productInList.name == product.name,
    );
    existingProducts.splice(indexToDelete, 1, product);
    document.cookie = `products=${JSON.stringify(existingProducts)};`;
  }
}

class PurchaseDao {
  getAll() {
    throw new Error("SessionStoragePurchaseDao getAll not implemented");
  }
  create(purchase) {
    throw new Error("SessionStoragePurchaseDao create not implemented");
  }
}

class SessionStoragePurchaseDao extends PurchaseDao {
  constructor() {
    super();
    this.database = sessionStorage;
  }

  getAll() {
    const purchasesInSessionStorage = this.database.getItem("purchases");
    const purchasesData = purchasesInSessionStorage
      ? JSON.parse(purchasesInSessionStorage)
      : [];
    return purchasesData.map((purchaseData) => {
      return Purchase.create(purchaseData);
    });
  }
  create(purchase) {
    const existingPurchases = this.getAll();
    existingPurchases.push(purchase);
    this.database.setItem("purchases", JSON.stringify(existingPurchases));
  }
}

class CookieStoragePurchaseDao extends PurchaseDao {
  getAll() {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("purchases"))
      ?.split("=")[1];

    const purchasesData = cookieValue ? JSON.parse(cookieValue) : [];
    return purchasesData.map((purchaseData) => Purchase.create(purchaseData));
  }
  create(purchase) {
    const existingPurchases = this.getAll();
    existingPurchases.push(purchase);
    document.cookie = `purchases=${JSON.stringify(existingPurchases)};`;
  }
}

class CreatePurchaseService {
  constructor(productDao, purchaseDao) {
    this.productDao = productDao;
    this.purchaseDao = purchaseDao;
  }

  async createPurchase(productName, quantity, address) {
    const products = await this.productDao.getAll();
    const product = products.find((p) => p.name === productName);
    product.inventory -= quantity;
    await this.productDao.update(product);
    const purchase = Purchase.create({ product, quantity, address });
    this.purchaseDao.create(purchase);
  }
}

const productDao = new ApiProductDao();
//const producatDao = new CookieStorageProductDao();
const purchaseDao = new SessionStoragePurchaseDao();
//const purchaseDao = new CookieStoragePurchaseDao();
const createPurchaseService = new CreatePurchaseService(
  productDao,
  purchaseDao,
);

const purchaseList = document.getElementById("purchases-list");
const purchases = purchaseDao.getAll();
for (let i = 0; i < purchases.length; i++) {
  const purchase = purchases[i];
  const purchaseLi = document.createElement("li");
  purchaseLi.textContent = purchase.toString();
  purchaseList.appendChild(purchaseLi);
}

const productNameSelect = document.querySelector("#purchases form select");
const quantityInput = document.querySelector(
  "#purchases form input[name='quantity']",
);
const submitButton = document.querySelector(
  "#purchases form button[type='submit']",
);

loadProducts();

productNameSelect.addEventListener("change", handleChangeToProductName);

async function handleChangeToProductName(event) {
  const productName = event.target.value;
  const selectedProduct = await productDao.getProductByName(productName);

  quantityInput.setAttribute("max", selectedProduct.inventory);

  if (selectedProduct.inventory === 0) {
    submitButton.disabled = true;
    submitButton.textContent = "Out of Stock";
  } else {
    submitButton.disabled = false;
    submitButton.textContent = "Purchase";
  }
}

quantityInput.addEventListener("input", handleQuantityChange);

function handleQuantityChange() {
  const value = Number(quantityInput.value);
  const max = Number(quantityInput.getAttribute("max"));

  if (!value || value <= 0 || value > max) {
    submitButton.disabled = true;
    return;
  }

  submitButton.disabled = false;
}

const createProductForm = document.querySelector("#purchases form");
createProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("submitting form");
  const formData = new FormData(event.target);
  const address = formData.get("address");
  const quantity = Number(formData.get("quantity"));
  const productName = formData.get("productName");

  await createPurchaseService.createPurchase(productName, quantity, address);

  const successDiv = document.getElementById("purchase-success");
  successDiv.textContent = `Successfully purchased ${quantity} of ${productName}!`;

  const newLi = document.createElement("li");
  newLi.textContent = `Purchasing ${quantity} of ${productName} and we're sending it to ${address}!`;
  purchaseList.appendChild(newLi);

  productNameSelect.innerHTML = "";
  await loadProducts();

  setTimeout(() => {
    successDiv.textContent = "";
  }, 3000);

  event.target.reset();
});
