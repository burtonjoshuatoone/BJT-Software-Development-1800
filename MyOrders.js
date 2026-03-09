const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
  alert("Not logged in!");
  window.location.href = "Login.html";
}

class PurchaseDao {
  getAll() {
    throw new Error("Not implemented");
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
    return purchasesData;
  }
}

const purchaseDao = new SessionStoragePurchaseDao();
const myPurchasesSection = document.getElementById("myPurchases");

function loadMyPurchases() {
  const purchases = purchaseDao.getAll();

  const myPurchases = purchases.filter((p) => p.userId === loggedInUser.id);

  if (myPurchases.length == 0) {
    const empty = document.createElement("p");
    empty.textContent = "You have not purchased anything";
    myPurchasesSection.appendChild(empty);
    return;
  }

  for (let purchase of myPurchases) {
    const li = document.createElement("li");
    li.textContent = `Purchased ${purchase.quantity} of ${purchase.product.name} sent to ${purchase.address}`;
    myPurchasesSection.appendChild(li);
  }
}

loadMyPurchases();
