import {
  navigate,
  applyMainSectionMargin,
  onSideNavButtonsClick,
} from "../scripts/utils.js";
import showToast from "../scripts/toast.js";

window.addEventListener("DOMContentLoaded", () => {
  // * CHECK IF THE USER IS STILL LOGGED IN
  const CURRENT_USER = localStorage.getItem("gquizCurrentUserId");
  if (CURRENT_USER === null && CURRENT_USER === undefined) {
    navigate("./index.html");
  }

  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  const takeQuiz1Btn = document.getElementById("takeQuiz1Btn");
  takeQuiz1Btn.addEventListener("click", openQuiz);

  function openQuiz() {
    showToast("This quiz is not available yet for answering!");
  }
});
