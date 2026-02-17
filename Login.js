document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const userName = document.getElementById("userName").value;
    const passWord = document.getElementById("passWord").value;

    if (!userName || !passWord) {
      alert("All fields are required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.userName === userName && u.passWord === passWord,
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Login successful!");

      setTimeout(() => {
        window.location.href = "Index.html";
      }, 1000);
    } else {
      alert("Invalid username or password");
    }
  });
