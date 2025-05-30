import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
} from "../scripts/utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  // * DEFINE
  let addNewUserButton = document.getElementById("addNewUserButton");
  let cancelAddEditUserButton = document.getElementById(
    "cancelAddEditUserButton"
  );

  // * EVENTS
  addNewUserButton.addEventListener("click", () =>
    showAddUpdateUserDiv("flex")
  );
  cancelAddEditUserButton.addEventListener("click", () =>
    showAddUpdateUserDiv("none")
  );

  function showAddUpdateUserDiv(addUpdateUserDivDisplay) {
    let addUpdateUserDiv = document.getElementById("addUpdateUserDiv");
    addUpdateUserDiv.style.display = addUpdateUserDivDisplay;
  }
});
