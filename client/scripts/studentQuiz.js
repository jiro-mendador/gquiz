import {
  applyMainSectionMargin,
  applyQuizQuestionMargin,
  navigate,
} from "../scripts/utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // * STYLINGS
  applyMainSectionMargin();
  applyQuizQuestionMargin();

  let minMaxHeaderButton = document.getElementById("minMaxHeaderButton");
  let quizHeader = document.getElementById("quizHeader");

  let isQuizHeaderOpen = false;

  minMaxHeaderButton.addEventListener("click", openQuizHeaderOnSmallScreen);

  function openQuizHeaderOnSmallScreen() {
    isQuizHeaderOpen = !isQuizHeaderOpen;
    quizHeader.style.display = isQuizHeaderOpen ? "flex" : "none";
  }

  function checkPageMaximumWidth() {
    const maxWidth = window.innerWidth;
    if (maxWidth >= 601) {
      quizHeader.style.display = "flex";
      isQuizHeaderOpen = true;
    } else {
      quizHeader.style.display = "none";
      isQuizHeaderOpen = false;
    }
    console.log("TRIGGERED!");
    applyMainSectionMargin();
    applyQuizQuestionMargin();
  }

  checkPageMaximumWidth();
  window.addEventListener("resize", checkPageMaximumWidth);

  // * CANCELLING THE QUIZ
  let cancelQuizButton = document.getElementById("cancelQuizButton");
  cancelQuizButton.addEventListener("click", onCancelQuiz);

  function onCancelQuiz() {
    navigate("./dashboard.html");
  }
});
