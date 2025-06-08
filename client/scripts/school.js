import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
  onInnerSideNavClick,
  navigate,
  // generatePagination,
  clear,
} from "./utils.js";

import showToast from "./toast.js";
import myAxios from "./request.js";
import API from "./API.js";

window.addEventListener("DOMContentLoaded", async () => {
  // * CHECK FIRST IF IT WAS CLICKED
  let isPageWasOpened = localStorage.getItem("gQuizInnerSideNavPageOpened");
  if (isPageWasOpened === null || isPageWasOpened === undefined) {
    navigate(".././profile.html");
  }

  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  // * to show by default the inner nav
  onInnerSideNavClick();

  // * DEFINE
  let addNew = document.getElementById("addNewButton");
  let searchInput = document.getElementById("searchInput");
  let addUpdateForm = document.getElementById("addUpdateForm");

  // * determine which cancel button to trigger
  let innerNavPageOpened = localStorage.getItem("gQuizInnerSideNavPageOpened");
  let pageName =
    innerNavPageOpened === "0"
      ? "YearSection"
      : innerNavPageOpened === "1"
      ? "Course"
      : innerNavPageOpened === "2"
      ? "Subject"
      : "YearSection";
  let cancelAddEditButton = document.getElementById(
    `cancelAddEdit${pageName}Button`
  );

  let routeName = "year-section";
  switch (innerNavPageOpened) {
    case "0":
      routeName = "year-section";
      break;
    case "1":
      routeName = "course";
      break;
    case "2":
      routeName = "subject";
      break;
  }

  // * determine which table to show
  let table = document.querySelector(`#${pageName}Table`);
  table.style.display = "flex";

  // * update the title in the inputs overlay
  let inputTitleDiv = document.querySelector("#addUpdateForm > p");
  inputTitleDiv.innerHTML =
    "Add " + (pageName === "YearSection" ? "Year & Section" : pageName);

  // * EVENTS
  addNew.addEventListener("click", async () => {
    await populateSelectElement(null, "teacher");
    await populateSelectElement(null, "subject-course");
    await populateSelectElement(null, "subject-year");
    showAddUpdateDiv("flex", pageName);
  });

  cancelAddEditButton.addEventListener("click", (e) => {
    e.preventDefault();
    resetForms();
    showAddUpdateDiv("none", pageName);
  });

  searchInput.addEventListener("change", async (e) => {
    await getAll(1, e.target.value, "");
  });

  addUpdateForm.addEventListener("submit", (e) => {
    if (
      addUpdateForm.dataset.idToUpdate &&
      addUpdateForm.dataset.idToUpdate !== null
    ) {
      update(e, addUpdateForm.dataset.idToUpdate);
    } else {
      create(e);
    }
  });

  function showAddUpdateDiv(addUpdateDivDisplay, pageName) {
    let addUpdateDiv = document.getElementById("addUpdateDiv");
    addUpdateDiv.style.display = addUpdateDivDisplay;

    // * open div inputs inside
    document.querySelector(`#${pageName}Inputs`).style.display =
      addUpdateDivDisplay;
  }

  function createTableRow(page, id, data) {
    let tableId = "YearSectionTable";
    switch (page) {
      case "0":
        tableId = "YearSectionTable";
        break;
      case "1":
        tableId = "CourseTable";
        break;
      case "2":
        tableId = "SubjectTable";
        break;
    }

    let rowsContainer = document.querySelector(
      `#${tableId} > div.custom-table-rows`
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
      addUpdateForm.dataset.idToUpdate = id;
      await getAll(null, "", id);
      showAddUpdateDiv("flex", pageName);
    });

    actionSpanDelete.addEventListener("click", () => {
      showToast("Do you want to delete this data?", async () => {
        await deleteData(id);
      });
    });

    actionButtonsDiv.appendChild(actionSpanEdit);
    actionButtonsDiv.appendChild(actionSpanDelete);
    tableDataDiv.appendChild(actionButtonsDiv);

    rowsContainer.appendChild(tableDataDiv);
  }

  function resetTable() {
    document
      .querySelectorAll(`div.custom-table-rows`)
      .forEach((tableRowsContainer) => {
        tableRowsContainer.innerHTML = "";
      });
  }

  function resetForms() {
    // Clear all input fields (except submit buttons)
    const inputs = document.querySelectorAll(
      `#addUpdateForm input:not([type='submit'])`
    );
    if (inputs.length > 0) {
      inputs.forEach((input) => {
        input.value = "";
      });
    }

    // Safely remove data-id-to-update attribute from the form
    const form = document.getElementById("addUpdateForm");
    if (form) {
      form.removeAttribute("data-id-to-update");
    }
  }

  // * API CALLS HERE
  async function getAll(pageNumber = 1, search = "", id = "") {
    try {
      if (id === "") {
        resetTable();
      }

      const response = await myAxios.get(
        `${API}/${routeName}?search=${search}&pageNumber=${pageNumber}&id=${id}`
      );

      console.log(response.data);
      if (response.data.success) {
        let allSchoolData = response.data.data;

        if (id === "") {
          allSchoolData.forEach((schoolData) => {
            switch (innerNavPageOpened) {
              case "0":
                createTableRow(innerNavPageOpened, schoolData.id, [
                  schoolData.year,
                  schoolData.section,
                ]);
                break;
              case "1":
                createTableRow(innerNavPageOpened, schoolData.id, [
                  schoolData.name,
                ]);
                break;
              case "2":
                createTableRow(innerNavPageOpened, schoolData.id, [
                  schoolData.subject_code,
                  schoolData.description,
                  `${schoolData.teacher.first_name} ${schoolData.teacher.last_name}`,
                  schoolData.course.name,
                ]);
                break;
            }
          });

          console.log(response.data.pagination);
          // generatePagination(
          //   response.data.pagination.totalPages,
          //   null,
          //   getAll,
          //   resetPagination
          // );
        } else {
          // * FOR UPDATING!
          let inputs = null;
          switch (innerNavPageOpened) {
            case "0":
              inputs = document.querySelectorAll(
                `#${pageName}Inputs input:not([type='submit'])`
              );
              inputs[0].value = allSchoolData[0].year;
              inputs[1].value = allSchoolData[0].section;
              break;
            case "1":
              inputs = document.querySelectorAll(
                `#${pageName}Inputs input:not([type='submit'])`
              );
              inputs[0].value = allSchoolData[0].name;
              break;
            case "2":
              inputs = document.querySelectorAll(
                `#${pageName}Inputs input:not([type='submit'])`
              );
              inputs[0].value = allSchoolData[0].subject_code;
              inputs[1].value = allSchoolData[0].description;

              populateSelectElement(allSchoolData[0].teacher.id, "teacher");
              populateSelectElement(
                allSchoolData[0].course.id,
                "subject-course"
              );
              populateSelectElement(allSchoolData[0].year, "subject-year");
          }
          // generatePagination(response.data.pagination.totalPages, 1, getAll);
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

  async function populateSelectElement(selected = null, selectId) {
    // * populate teacher select
    let select = document.querySelector(`#${selectId}`);
    select.innerHTML = "";

    let routeNameAndParams =
      selectId === "teacher"
        ? "user?role=teacher"
        : selectId === "subject-course"
        ? "course"
        : "year-section";

    let data = await allData(routeNameAndParams);

    if (selectId === "subject-year") {
      const uniqueYears = data.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.year === item.year)
      );

      data = uniqueYears;
    }

    data.forEach((forData) => {
      let option = document.createElement("option");
      console.log(forData);
      option.value = selectId !== "subject-year" ? forData.id : forData.year;

      let OptiontextContent =
        selectId === "teacher"
          ? `${forData.first_name} ${forData.last_name}`
          : selectId === "subject-course"
          ? forData.name
          : forData.year;

      option.textContent = OptiontextContent;

      select.appendChild(option);
    });

    // * set it as selected
    select.value = selected;
  }

  async function create(e) {
    try {
      e.preventDefault();

      // * get inputs value
      let year = document.getElementById("year");
      let section = document.getElementById("section");
      let course = document.getElementById("course");
      let subjectCode = document.getElementById("subjectCode");
      let subjectDescription = document.getElementById("subjectDescription");
      let teacher = document.getElementById("teacher");
      let subjectCourse = document.getElementById("subject-course");
      let subjectYear = document.getElementById("subject-year");

      let dataToSubmit = {};
      switch (innerNavPageOpened) {
        case "0":
          dataToSubmit = {
            year: year.value,
            section: section.value,
          };
          break;
        case "1":
          dataToSubmit = {
            name: course.value,
          };
          break;
        case "2":
          dataToSubmit = {
            subject_code: subjectCode.value,
            description: subjectDescription.value,
            teacher: teacher.value,
            course: subjectCourse.value,
            year: subjectYear.value,
          };
          break;
      }

      const response = await myAxios.post(`${API}/${routeName}`, dataToSubmit);

      console.log(response.data);
      if (response.data.success) {
        showToast(response.data.message);
        await getAll(1, searchInput.value);
        resetForms();
        showAddUpdateDiv("none", pageName);
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

  async function update(e, id) {
    try {
      e.preventDefault();

      // * get inputs value
      let year = document.getElementById("year");
      let section = document.getElementById("section");
      let course = document.getElementById("course");
      let subjectCode = document.getElementById("subjectCode");
      let subjectDescription = document.getElementById("subjectDescription");
      let teacher = document.getElementById("teacher");
      let subjectCourse = document.getElementById("subject-course");
      let subjectYear = document.getElementById("subject-year");

      let dataToUpdate = {};
      switch (innerNavPageOpened) {
        case "0":
          dataToUpdate = {
            year: year.value,
            section: section.value,
          };
          break;
        case "1":
          dataToUpdate = {
            name: course.value,
          };
          break;
        case "2":
          dataToUpdate = {
            subject_code: subjectCode.value,
            description: subjectDescription.value,
            teacher: teacher.value,
            course: subjectCourse.value,
            year: subjectYear.value,
          };
          break;
      }

      const response = await myAxios.put(
        `${API}/${routeName}/${id}`,
        dataToUpdate
      );

      console.log(response.data);
      if (response.data.success) {
        addUpdateForm.removeAttribute("data-id-to-update");
        showToast(response.data.message);
        await getAll(1, searchInput.value);
        resetForms();
        showAddUpdateDiv("none", pageName);
      }
    } catch (ex) {
      console.log(ex);
      addUpdateForm.removeAttribute("data-id-to-update");
      if (ex.data.errors) {
        const errorMessage = Object.values(ex.data.errors).flat().join(", ");
        showToast(errorMessage);
      } else {
        showToast(ex);
      }
    }
  }

  async function deleteData(id) {
    try {
      const response = await myAxios.delete(`${API}/${routeName}/${id}`);

      console.log(response.data);
      if (response.data.success) {
        showToast(response.data.message);
        await getAll(1, searchInput.value);
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
