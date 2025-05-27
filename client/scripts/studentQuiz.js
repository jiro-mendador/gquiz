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
  let minMaxHeaderButtonBig = document.getElementById("minMaxHeaderButtonBig");
  
  let quizHeader = document.getElementById("quizHeader");
  let isQuizHeaderOpen = false;
  
  minMaxHeaderButton.addEventListener("click", openQuizHeaderOnSmallScreen);
  minMaxHeaderButtonBig.addEventListener("click", openQuizHeaderOnBigScreen);

  function openQuizHeaderOnSmallScreen() {
    isQuizHeaderOpen = !isQuizHeaderOpen;
    quizHeader.style.display = isQuizHeaderOpen ? "flex" : "none";
  }

  function openQuizHeaderOnBigScreen() {
    isQuizHeaderOpen = !isQuizHeaderOpen;
    quizHeader.style.display = isQuizHeaderOpen ? "flex" : "none";
    document.querySelector("#minMaxHeaderButtonBig span").innerHTML =
      isQuizHeaderOpen
        ? "keyboard_double_arrow_up"
        : "keyboard_double_arrow_down";
    applyMainSectionMargin();
    applyQuizQuestionMargin();
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
