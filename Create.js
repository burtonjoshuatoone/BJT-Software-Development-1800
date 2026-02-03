const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const body = {
    Price: formData.get("price"),
    Inventory_Count: formData.get("inventory_count"),
  };
  const result = await fetch("http://localhost:5202/products", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const resultBody = await result.text();
  console.log(resultBody);
  window.location.replace("Index.html");
});
