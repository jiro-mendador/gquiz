import myAxios from "./request.js";
import API from "./API.js";
import showToast from "./toast.js";
import { navigate } from "./utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // * CHECK IF THE USER IS STILL LOGGED IN
  const CURRENT_USER = localStorage.getItem("gquizCurrentUserId");
  if (CURRENT_USER !== null && CURRENT_USER !== undefined) {
    navigate("./dashboard.html");
  }

  let headerLoginButton = document.getElementById("header-login-button");
  let headerSignUpButton = document.getElementById("header-signup-button");
  let loginForm = document.getElementById("loginForm");
  let signupForm = document.getElementById("signupForm");

  headerLoginButton.addEventListener("click", headerLoginClicked);
  headerSignUpButton.addEventListener("click", headerSignUpClicked);
  loginForm.addEventListener("submit", onLogin);
  signupForm.addEventListener("submit", onRegister);

  function headerLoginClicked() {
    document.getElementById("login-div").style.display = "flex";
    document.getElementById("signup-div").style.display = "none";
  }

  function headerSignUpClicked() {
    document.getElementById("login-div").style.display = "none";
    document.getElementById("signup-div").style.display = "flex";
  }

  // * LOGIN
  async function onLogin(e) {
    e.preventDefault();

    let email = document.getElementById("email");
    let password = document.getElementById("password");

    try {
      const response = await myAxios.post(`${API}/user/login`, {
        email: email.value,
        password: password.value,
      });

      if (response.data.success) {
        showToast("success", response.data.message);

        // * save user id on localStorage for later
        localStorage.setItem("gquizCurrentUserId", response.data.user_id);

        setTimeout(() => {
          navigate("./dashboard.html");
        }, 1000);
      }
    } catch (ex) {
      showToast("error", ex.data.message);
    }
  }

  // * REGISTER
  async function onRegister(e) {
    e.preventDefault();

    let firstName = document.getElementById("firstName");
    let middleName = document.getElementById("middleName");
    let lastName = document.getElementById("lastName");
    let username = document.getElementById("username");
    let email = document.getElementById("email-reg");
    let password = document.getElementById("password-reg");

    try {
      const response = await myAxios.post(`${API}/user`, {
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        username: username.value,
        email: email.value,
        password: password.value,
      });

      if (response.data.success) {
        showToast("success", response.data.message);

        setTimeout(() => {
          headerLoginClicked();
        }, 1500);
      }
    } catch (ex) {
      const errorMessage = Object.values(ex.data.errors).flat().join(", ");
      showToast("error", errorMessage);
    }
  }
});
