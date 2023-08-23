let indexPage = "http://127.0.0.1:5500/FrontEnd/index.html";
let log = document.querySelector(".log");
// console.log(log);
let errorMessage = document.querySelector(".error");
// console.log(errorMessage);
let formLogin = document.getElementById("login");
let token = "";

// if (localStorage.getItem("token")) {
//   log.textContent = "Logout";
// }

formLogin.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const email = emailInput.value;

  const passwordInput = document.getElementById("password");
  const password = passwordInput.value;

  let response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  });
  let result = await response.json();
  console.log(result);
  token = result.token;

  if (token) {
    errorMessage.style.display = "none";
    window.localStorage.setItem("token", result.token);
    window.location.href = indexPage;
  } else {
    errorMessage.style.display = "block";
  }
});
