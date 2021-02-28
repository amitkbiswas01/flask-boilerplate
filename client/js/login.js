"use strict";

// redirect to homepage if logged in
if (localStorage.getItem("token")) {
  window.location.href = "homepage.html";
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const loginForm = document.getElementById("loginForm");
  const loginDataEntries = new FormData(loginForm).entries();
  const { email, password } = Object.fromEntries(loginDataEntries);

  const loginURL = "http://localhost:5000/api/v1/auth/login";
  const requestConfig = {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ email: email, password: password }),
  };

  fetch(loginURL, requestConfig)
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "homepage.html";
      } else {
        console.log(data);
        throw data;
      }
    })
    .catch((err) => {
      const loginTitle = document.getElementById("loginTitle");
      const errorElem = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">${err.error}</div>`;
      loginTitle.insertAdjacentHTML("afterend", errorElem);
    });
});
