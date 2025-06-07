import {
  applyMainSectionMargin,
  applyQuizQuestionMargin,
  clear,
  navigate,
  getTimeSpan,
} from "../scripts/utils.js";

import showToast from "./toast.js";
import myAxios from "./request.js";
import API from "./API.js";

window.addEventListener("DOMContentLoaded", async () => {
  // * CHECK IF THE USER IS STILL LOGGED IN
  const CURRENT_USER_ID = localStorage.getItem("gquizCurrentUserId");
  if (CURRENT_USER_ID === null && CURRENT_USER_ID === undefined) {
    navigate("./index.html");
  }

  // ! CHECK FIRST IF THE USER CLICKS A QUIZ
  let reviewingQuizId = localStorage.getItem("reviewingQuizId");
  if (!reviewingQuizId) {
    onCancelQuiz();
  }

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
      document.querySelector("#minMaxHeaderButtonBig span").innerHTML =
        "keyboard_double_arrow_up";
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
    localStorage.removeItem("reviewingQuizId");
    navigate("./student-response-history.html");
  }
});
