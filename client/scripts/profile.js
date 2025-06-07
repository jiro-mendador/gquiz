import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
  clear,
} from "../scripts/utils.js";

import showToast from "./toast.js";
import myAxios from "./request.js";
import API from "./API.js";

window.addEventListener("DOMContentLoaded", async () => {
  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  // * check the role first
  let CURRENT_USER_ID = localStorage.getItem("gquizCurrentUserId");
  let CURRENT_USER_ROLE = localStorage.getItem("gquizCurrentUserRole");

  // * define
  let editProfileButton = document.getElementById("editProfileButton");
  let saveProfileButton = document.getElementById("saveProfileButton");
  displayActionButton(saveProfileButton, false);

  // * events
  editProfileButton.addEventListener("click", (e) => {
    e.preventDefault();
    disableProfileInputs(false);
    displayActionButton(editProfileButton, false);
    displayActionButton(saveProfileButton, true);
  });

  saveProfileButton.addEventListener("click", (e) => {
    save(e, CURRENT_USER_ID);
  });

  // * DOM MANIPULATION
  function disableProfileInputs(isDisabled) {
    let profileInputs = document.querySelectorAll(
      ".user-information-input-div > input"
    );
    profileInputs.forEach((input) => {
      input.disabled = isDisabled;
    });
  }

  function displayActionButton(button, isVisible) {
    button.style.display = isVisible ? "flex" : "none";
  }

  // * API CALLS
  async function getAll(pageNumber = 1, search = "", id = "", role = "") {
    try {
      const response = await myAxios.get(
        `${API}/user?search=${search}&pageNumber=${pageNumber}&id=${id}&role=${role}`
      );

      console.log(response.data);
      if (response.data.success) {
        let allData = response.data.data;

        if (id) {
          allData.forEach(async (data) => {
            // * update user info here
            let initialsBoxParag = document.querySelector(
              ".user-initial-div > p"
            );
            initialsBoxParag.textContent = `${data.first_name[0]}${data.last_name[0]}`;

            let fullnameParags = document.querySelectorAll(
              ".fullname-email-div > p"
            );
            fullnameParags[0].textContent = `${data.first_name} ${data.middle_name} ${data.last_name}`;
            fullnameParags[1].textContent = data.email;

            let roleSpan = document.createElement("span");
            roleSpan.textContent = data.role;
            fullnameParags[0].appendChild(roleSpan);
            CURRENT_USER_ROLE = data.role;

            if (CURRENT_USER_ROLE === "student") {
              let studentYearSectionDiv = document.querySelector(
                ".student-section-year-div"
              );
              studentYearSectionDiv.style.display = "flex";
            }

            let profileInputs = document.querySelectorAll(
              ".user-information-input-div > input"
            );

            profileInputs[0].value = data.first_name;
            profileInputs[1].value = data.middle_name;
            profileInputs[2].value = data.last_name;
            profileInputs[3].value = data.username;
            profileInputs[4].value = data.email;
          });
        }
      }
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.data && ex.response.data.message) {
        showToast(ex.response.data.message);
      } else {
        showToast("An unexpected error occurred");
      }
    }
  }

  async function otherData(routeNameAndParams) {
    try {
      const response = await myAxios.get(`${API}/${routeNameAndParams}`);

      console.log(response.data);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (ex) {
      console.log(ex);
      if (ex.data?.errors) {
        const errorMessage = Object.values(ex.data?.errors).flat().join(", ");
        showToast(errorMessage);
      } else {
        showToast(ex);
      }
      return null;
    }
  }

  async function save(e, id = null) {
    try {
      e.preventDefault();

      // * get inputs value
      let firstName = document.getElementById("firstName");
      let middleName = document.getElementById("middleName");
      let lastName = document.getElementById("lastName");
      let username = document.getElementById("username");
      let role = CURRENT_USER_ROLE;
      let email = document.getElementById("email");
      let password = document.getElementById("password");

      let dataToSave = {
        first_name: firstName.value,
        middle_name: middleName.value,
        last_name: lastName.value,
        username: username.value,
        role: role.value,
        email: email.value,
      };

      if (password.value !== "") {
        dataToSave.password = password.value;
      }

      let response = await myAxios.put(`${API}/user/${id}`, dataToSave);

      console.log(response.data);

      if (response.data.success) {
        showToast(response.data.message);
        await getAll(1, "", CURRENT_USER_ID, CURRENT_USER_ROLE);
        displayActionButton(saveProfileButton, false);
        displayActionButton(editProfileButton, true);
        disableProfileInputs(true);

        if (password.value !== "") {
          password.value = "";
        }
      }
    } catch (ex) {
      console.log(ex);
      if (ex.data.errors) {
        const errorMessage = Object.values(ex.data.errors).flat().join(", ");
        showToast(errorMessage);
      } else {
        showToast(ex);
      }
    }
  }

  await getAll(1, "", CURRENT_USER_ID, "", "");
});
