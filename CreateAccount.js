const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const body = {
    userName: formData.get("userName"),
    passWord: formData.get("passWord"),
  };
  const result = await fetch("http://localhost:5202/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    const message = await result.text();
    document.getElementById("errorMessage").textContent = message;
    return; // stop here, do NOT redirect
  }

  // success → redirect
  window.location.replace("Index.html");
});
