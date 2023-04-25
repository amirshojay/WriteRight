const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const formSignUp = document.getElementById("formSignUp");
const formSignIn = document.getElementById("formSignIn");

const btnSignUp = document.getElementById("btnSignUp");
const btnSignIn = document.getElementById("btnSignIn");

const signInError = document.querySelector("#signInError");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

const emailSignIn = formSignIn.elements[0];
const passwordSignIn = formSignIn.elements[1];

const nameSignUp = formSignUp.elements[0];
const emailSignUp = formSignUp.elements[1];
const passwordSignUp = formSignUp.elements[2];

btnSignIn.addEventListener("click", (e) => {
  e.preventDefault();
  fetch("http://localhost:3000/login", {
    method: "POST",
    body: JSON.stringify({
      email: emailSignIn.value,
      password: passwordSignIn.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          // Save the JWT token in local storage
          localStorage.setItem("jwt", data.token);
          // Redirect the user to the protected route
          window.location.href = "/index";
        });
      } else {
        document.getElementById("error-message").textContent =
          "Invalid email or password.";
          console.error(response)
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

btnSignUp.addEventListener("click", (e) => {
  e.preventDefault();
  fetch("http://localhost:3000/register", {
    method: "POST",
    body: JSON.stringify({
      name: nameSignUp.value,
      email: emailSignUp.value,
      password: passwordSignUp.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          // Save the JWT token in local storage
          localStorage.setItem("jwt", data.token);
          // Redirect the user to the protected route
          window.location.href = "/index";
        });
      } else {
        document.getElementById("error-message").textContent =
          "User registration failed.";
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
