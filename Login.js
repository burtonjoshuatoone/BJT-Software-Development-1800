document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const userName = document.getElementById("userName").value.trim();
    const passWord = document.getElementById("passWord").value.trim();

    if (!userName || !passWord) {
      alert("All fields are required.");
      return;
    }

    try {
      const result = await fetch("http://localhost:5202/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, passWord }),
      });

      if (!result.ok) {
        const message = await result.text();
        alert(message);
        return;
      }

      const user = await result.json();

      localStorage.setItem("loggedInUser", JSON.stringify(user));

      alert("Login successful!");

      setTimeout(() => {
        window.location.href = "Index.html";
      }, 1000);
    } catch (err) {
      alert("Server error. Please try again");
    }
  });
//   if (!userName || !passWord) {
//     alert("All fields are required.");
//     return;
//   }

//   const users = JSON.parse(localStorage.getItem("users")) || [];

//   const user = users.find(
//     (u) => u.userName === userName && u.passWord === passWord,
//   );

//   if (user) {
//     localStorage.setItem("loggedInUser", JSON.stringify(user));
//     alert("Login successful!");

//     setTimeout(() => {
//       window.location.href = "Index.html";
//     }, 1000);
//   } else {
//     alert("Invalid username or password");
//   }
// });
