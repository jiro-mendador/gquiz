import myAxios from "./request.js";
import API from "./API.js";
import showToast from "./toast.js";
import { navigate, applyMainSectionMargin } from "./utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // * CHECK IF THE USER IS STILL LOGGED IN
  const CURRENT_USER = localStorage.getItem("gquizCurrentUserId");
  if (CURRENT_USER !== null && CURRENT_USER !== undefined) {
    navigate("./dashboard.html");
  }

  // * styles
  applyMainSectionMargin();

  let headerLoginButton = document.getElementById("header-index-login-button");
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
        showToast(response.data.message);

        // * save user id on localStorage for later
        localStorage.setItem("gquizCurrentUserId", response.data.user_id);
        localStorage.setItem("gquizCurrentUserRole", response.data.role);

        setTimeout(() => {
          navigate(
            response.data.role === "student"
              ? "./dashboard.html"
              : "./admin-teacher/admin-dashboard.html"
          );
        }, 1000);
      }
    } catch (ex) {
      if (ex.data.errors) {
        const errorMessage = Object.values(ex.data.errors).flat().join(", ");
        showToast(errorMessage);
      } else {
        showToast(ex);
      }
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
    let yearSection = document.getElementById("year-section");
    let course = document.getElementById("course");
    let role = "student";

    try {
      const response = await myAxios.post(`${API}/user`, {
        first_name: firstName.value,
        middle_name: middleName.value,
        last_name: lastName.value,
        username: username.value,
        email: email.value,
        password: password.value,
      });

      if (response.data.success) {
        console.log(response.data);

        // * check if it is a student
        if (role === "student") {
          // * after saving the user, save the student's year, section, and course on another table
          await myAxios.post(`${API}/student-course-year-section`, {
            course: course.value,
            year_section: yearSection.value,
            student: response.data.data.id,
          });
        }

        showToast(response.data.message);

        setTimeout(() => {
          headerLoginClicked();
        }, 1500);
      }
    } catch (ex) {
      if (ex.data && ex.data?.errors) {
        const errorMessage = Object.values(ex.data.errors).flat().join(", ");
        showToast(errorMessage);
      }
    }
  }
});
