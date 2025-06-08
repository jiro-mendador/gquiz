import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
  // generatePagination,
  clear,
} from "./utils.js";

import showToast from "./toast.js";
import myAxios from "./request.js";
import API from "./API.js";

window.addEventListener("DOMContentLoaded", async () => {
  // * clear localstorage item to avoid already selected page
  localStorage.removeItem("gQuizInnerSideNavPageOpened");

  const CURRENT_USER_ID = localStorage.getItem("gquizCurrentUserId");
  if (CURRENT_USER_ID === null && CURRENT_USER_ID === undefined) {
    navigate("../index.html");
  }

  const CURRENT_USER_ROLE = localStorage.getItem("gquizCurrentUserRole");
  if (CURRENT_USER_ROLE === null && CURRENT_USER_ROLE === undefined) {
    navigate("../index.html");
  }

  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  // * DEFINE
  let routeName = "user";
  let addNewUserButton = document.getElementById("addNewUserButton");
  let cancelAddEditUserButton = document.getElementById(
    "cancelAddEditUserButton"
  );
  let searchInput = document.getElementById("searchInput");
  let roleFilter = document.getElementById("roleFilter");
  let addUpdateForm = document.getElementById("addUpdateUserForm");
  let letRoleSelectInForm = document.getElementById("role");

  // * EVENTS
  addNewUserButton.addEventListener("click", () =>
    showAddUpdateUserDiv("flex")
  );

  cancelAddEditUserButton.addEventListener("click", (e) => {
    e.preventDefault();
    resetForms();
    showAddUpdateUserDiv("none");
  });

  searchInput.addEventListener("change", async (e) => {
    await getAll(1, e.target.value, "", roleFilter.value);
  });

  roleFilter.addEventListener("change", async (e) => {
    await getAll(1, searchInput.value, "", e.target.value);
  });

  letRoleSelectInForm.addEventListener("change", async (e) => {
    let studentSelectDisplay = "none";
    if (e.target.value === "student") {
      studentSelectDisplay = "flex";
      await populateSelectElement(null, "course", "course");
      await populateSelectElement(null, "year-section", "year-section");
    }
    document.querySelector(".student-year-section-course-div").style.display =
      studentSelectDisplay;
  });

  addUpdateForm.addEventListener("submit", (e) => {
    save(e, addUpdateForm.dataset.idToUpdate);
  });

  function showAddUpdateUserDiv(addUpdateUserDivDisplay) {
    let addUpdateUserDiv = document.getElementById("addUpdateUserDiv");
    addUpdateUserDiv.style.display = addUpdateUserDivDisplay;
  }

  // * DOM MANIPULATION HERE
  function createTableRow(id, data) {
    let rowsContainer = document.querySelector(
      `#userTable > div.custom-table-rows`
    );

    // * create table data here
    const tableDataDiv = document.createElement("div");
    tableDataDiv.className = "custom-table-data";
    tableDataDiv.dataset.id = id;

    // * the actual data
    data.forEach((col) => {
      const dataDiv = document.createElement("div");
      const dataSpan = document.createElement("span");
      dataSpan.textContent = col;
      dataDiv.appendChild(dataSpan);
      tableDataDiv.appendChild(dataDiv);
    });

    // * action buttons
    const actionButtonsDiv = document.createElement("div");

    const actionSpanEdit = document.createElement("span");
    actionSpanEdit.className = "material-symbols-outlined";
    actionSpanEdit.textContent = "edit";

    const actionSpanDelete = document.createElement("span");
    actionSpanDelete.className = "material-symbols-outlined";
    actionSpanDelete.textContent = "delete";

    // * events
    actionSpanEdit.addEventListener("click", async () => {
      document.querySelector(`#addUpdateUserForm select`).disabled = true;
      addUpdateForm.dataset.idToUpdate = id;
      await getAll(null, "", id);
      showAddUpdateUserDiv("flex");
    });

    actionSpanDelete.addEventListener("click", () => {
      showToast("Do you want to delete this data?", async () => {
        await remove(id);
      });
    });

    actionButtonsDiv.appendChild(actionSpanEdit);

    if (id != CURRENT_USER_ID && data[4] !== "admin") {
      actionButtonsDiv.appendChild(actionSpanDelete);
    }

    tableDataDiv.appendChild(actionButtonsDiv);

    rowsContainer.appendChild(tableDataDiv);
  }

  async function populateSelectElement(
    selected = null,
    selectId,
    routeNameAndParams
  ) {
    // * populate teacher select
    let select = document.querySelector(`#${selectId}`);
    select.innerHTML = "";

    let data = await allData(routeNameAndParams);

    data.forEach((forData) => {
      let option = document.createElement("option");
      console.log(forData);

      let OptiontextContent =
        selectId === "year-section"
          ? `${forData.year} ${forData.section}`
          : forData.name;

      option.textContent = OptiontextContent;
      option.value = forData.id;
      console.log("OPTION: ", forData);

      select.appendChild(option);
    });

    // * set it as selected
    select.value = selected;
  }

  function resetTable() {
    document
      .querySelectorAll(`div.custom-table-rows`)
      .forEach((tableRowsContainer) => {
        tableRowsContainer.innerHTML = "";
      });
  }

  function resetForms() {
    // Clear all inputs (except submit buttons)
    const inputs = document.querySelectorAll(
      `#addUpdateUserForm input:not([type='submit'])`
    );
    if (inputs.length > 0) {
      inputs.forEach((input) => {
        input.value = "";
      });
    }

    // Clear select and enable it
    const select = document.querySelector(`#addUpdateUserForm select`);
    if (select) {
      select.disabled = false;
      select.selectedIndex = 0;
    }

    // Hide and clear student-year-section-course-div attributes
    const yearSectionDiv = document.querySelector(
      ".student-year-section-course-div"
    );
    if (yearSectionDiv) {
      yearSectionDiv.removeAttribute("data-id");
      yearSectionDiv.style.display = "none";
    }

    // Remove data-id-to-update from the form itself
    const form = document.getElementById("addUpdateForm");
    if (form) {
      form.removeAttribute("data-id-to-update");
    }

    // Reset search input if it exists and is defined
    if (typeof searchInput !== "undefined" && searchInput) {
      searchInput.value = "";
    }
  }

  // * API CALLS HERE
  async function getAll(pageNumber = 1, search = "", id = "", role = "") {
    try {
      if (id === "") {
        resetTable();
      }

      const response = await myAxios.get(
        `${API}/user?search=${search}&pageNumber=${pageNumber}&id=${id}&role=${role}`
      );

      console.log(response.data);
      if (response.data.success) {
        let allData = response.data.data;

        if (id === "") {
          allData.forEach((data) => {
            createTableRow(data.id, [
              data.first_name,
              data.middle_name,
              data.last_name,
              data.email,
              data.role,
            ]);
          });
          // generatePagination(response.data.pagination.totalPages, null);
        } else {
          // * FOR UPDATING!
          let inputs = document.querySelectorAll(
            `#UserInputs input:not([type='submit'])`
          );
          inputs[0].value = allData[0].first_name;
          inputs[1].value = allData[0].middle_name;
          inputs[2].value = allData[0].last_name;
          inputs[3].value = allData[0].username;
          inputs[4].value = allData[0].email;

          // * display course year section if student
          document.querySelector(
            ".student-year-section-course-div"
          ).style.display = allData[0].role === "student" ? "flex" : "none";

          let select = document.querySelector(`#UserInputs select`);
          select.value = allData[0].role;

          console.log("all: ", allData);

          if (allData[0].role === "student") {
            let extra = response.data.extra || null;

            document.querySelector(
              ".student-year-section-course-div"
            ).dataset.id = extra?.course_year_section[0]?.id;

            await populateSelectElement(
              extra?.course_year_section[0]?.course,
              "course",
              "course"
            );

            await populateSelectElement(
              extra?.course_year_section[0]?.year_section,
              "year-section",
              "year-section"
            );
          }
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

  async function allData(routeNameAndParams) {
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
      let role = document.getElementById("role");
      let email = document.getElementById("email");
      let password = document.getElementById("password");

      let yearSection = document.getElementById("year-section");
      let course = document.getElementById("course");

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

      if (
        role.value === "student" &&
        yearSection.value === "" &&
        course.value === ""
      ) {
        showToast("Year & Section and Course is required!");
        return;
      }

      let response = null;
      if (id) {
        response = await myAxios.put(`${API}/${routeName}/${id}`, dataToSave);
      } else {
        if (password.value === "") {
          showToast("Password fields is required!");
          return;
        }
        response = await myAxios.post(`${API}/${routeName}`, dataToSave);
      }

      console.log(response.data);
      let newUserId = response.data?.data?.id;
      let prevResponse = response;

      if (response.data.success && prevResponse.data.success) {
        // * after saving or updating, if it is student, also save their course year section
        response = null;
        dataToSave = null;

        let courseYearSectionId =
          document.querySelector(".student-year-section-course-div").dataset
            .id || "";

        dataToSave = {
          student: Number(id ? id : newUserId),
          course: Number(course.value),
          year_section: Number(yearSection.value),
        };

        if (role.value === "student") {
          if (
            id &&
            courseYearSectionId !== "undefined" &&
            courseYearSectionId !== ""
          ) {
            response = await myAxios.put(
              `${API}/student-course-year-section/${courseYearSectionId}`,
              dataToSave
            );
          } else {
            response = await myAxios.post(
              `${API}/student-course-year-section`,
              dataToSave
            );
          }
        } else {
          response = response;
        }

        if (response?.data?.success || prevResponse?.data?.success) {
          showToast(response?.data?.message || prevResponse?.data?.message);
          await getAll(1, searchInput.value, "", roleFilter.value);
          resetForms();
          showAddUpdateUserDiv("none");
        }
      }
      
      addUpdateForm.removeAttribute("data-id-to-update");
    } catch (ex) {
      addUpdateForm.removeAttribute("data-id-to-update");
      console.log(ex);
      if (ex.data.errors) {
        const errorMessage = Object.values(ex.data.errors).flat().join(", ");
        showToast(errorMessage);
      } else {
        showToast(ex);
      }
    }
  }

  async function remove(id) {
    try {
      const response = await myAxios.delete(`${API}/user/${id}`);

      console.log(response.data);
      if (response.data.success) {
        showToast(response.data.message);
        await getAll(1, searchInput.value, "", roleFilter.value);
      }
    } catch (ex) {
      console.log(ex);
      if (ex.data?.errors) {
        const errorMessage = Object.values(ex.data?.errors).flat().join(", ");
        showToast(errorMessage);
      } else {
        showToast(ex);
      }
    }
  }

  await getAll();

  clear(window, () => {
    resetForms();
  });
});
