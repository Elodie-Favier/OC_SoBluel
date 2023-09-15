let indexPage = "http://127.0.0.1:5500/FrontEnd/index.html";
let log = document.querySelector(".log");
let formLogin = document.getElementById("login");
let token = "";

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
  let errorSpan = document.querySelector(".error");
  if (token) {
    errorSpan.style.display = "none";
    window.localStorage.setItem("token", result.token);
    window.location.href = indexPage;
  } else {
    errorSpan.style.display = "block";
    errorSpan.textContent = "Erreur dans l’identifiant ou le mot de passe";
  }
});
