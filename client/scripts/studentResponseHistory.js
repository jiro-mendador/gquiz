import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
  navigate,
} from "../scripts/utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  const reviewQuizButton1 = document.getElementById("reviewQuizButton");
  reviewQuizButton1.addEventListener("click", openQuiz);

  function openQuiz() {
    navigate("./student-answer.html");
  }
});
