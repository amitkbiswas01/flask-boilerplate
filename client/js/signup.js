"use strict";

// redirect to homepage if logged in
if (localStorage.getItem("token")) {
  window.location.href = "homepage.html";
}

document.getElementById("signupForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const signupForm = document.getElementById("signupForm");
  const signupDataEntries = new FormData(signupForm).entries();
  const { email, password } = Object.fromEntries(signupDataEntries);

  const signupURL = "http://localhost:5000/api/v1/auth/signup";
  const requestConfig = {
    method: "POST",
    redirect: "follow",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ email: email, password: password }),
  };

  fetch(signupURL, requestConfig)
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        window.location.href = "login.html";
      } else {
        throw data;
      }
    })
    .catch((err) => {
      const signupTitle = document.getElementById("signupTitle");
      const errorElem = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">${err.error}</div>`;
      signupTitle.insertAdjacentHTML("afterend", errorElem);
    });
});
