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

  // * define

  let minMaxHeaderButton = document.getElementById("minMaxHeaderButton");
  let minMaxHeaderButtonBig = document.getElementById("minMaxHeaderButtonBig");

  let quizHeader = document.getElementById("quizHeader");
  let isQuizHeaderOpen = false;

  let cancelQuizButton = document.getElementById("cancelQuizButton");

  // * events
  minMaxHeaderButton.addEventListener("click", openQuizHeaderOnSmallScreen);
  minMaxHeaderButtonBig.addEventListener("click", openQuizHeaderOnBigScreen);

  window.addEventListener("resize", checkPageMaximumWidth);

  // * CANCELLING THE QUIZ
  cancelQuizButton.addEventListener("click", onCancelQuiz);

  // * dom
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

  function onCancelQuiz() {
    localStorage.removeItem("reviewingQuizId");
    navigate("./student-response-history.html");
  }

  function createQuizQuestionUI(
    question,
    choices,
    index,
    studentAnswer = null,
    input_answer = null
  ) {
    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-question";
    questionDiv.dataset.id = question.id || `q-${index}`;

    // Question header
    const questionInfoDiv = document.createElement("div");
    questionInfoDiv.className = "quiz-number-question";

    const numberP = document.createElement("p");
    numberP.textContent = `Question ${index + 1}`;

    const textP = document.createElement("p");
    textP.textContent = question.question;

    questionInfoDiv.appendChild(numberP);
    questionInfoDiv.appendChild(textP);
    questionDiv.appendChild(questionInfoDiv);

    // Type label
    const typeP = document.createElement("p");
    typeP.className = "quiz-question-type";
    typeP.textContent = question.question_type;
    questionDiv.appendChild(typeP);

    const choicesContainer = document.createElement("div");
    choicesContainer.className = "quiz-choices-container";

    const type = question.question_type.toUpperCase();

    if (type === "IDENTIFICATION") {
      const answerDiv = document.createElement("div");
      answerDiv.className = "quiz-answer-mark-div";

      const answerP = document.createElement("p");
      answerP.className = "quiz-input-answer";
      // answerP.textContent = studentAnswer?.choice || "[No Answer]";
      answerP.textContent = input_answer.choice || "[No Answer]";
      answerDiv.appendChild(answerP);

      const isCorrect =
        input_answer?.choice?.trim().toLowerCase() ===
        choices[0].choice.trim().toLowerCase();
      answerDiv.classList.add(isCorrect ? "correct" : "incorrect");

      const icon = document.createElement("span");
      icon.className = "material-symbols-outlined";
      icon.textContent = isCorrect ? "check" : "close";
      answerDiv.appendChild(icon);

      choicesContainer.appendChild(answerDiv);

      // Show correct answer if the student is wrong
      if (!isCorrect) {
        const correctDiv = document.createElement("div");
        correctDiv.className = "correct-answer-div";

        const label = document.createElement("p");
        label.textContent = "Correct Answer";
        const correctText = document.createElement("p");
        correctText.textContent = choices[0].choice;

        correctDiv.appendChild(label);
        correctDiv.appendChild(correctText);
        choicesContainer.appendChild(correctDiv);
      }
    } else if (type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE") {
      choices.forEach((choice) => {
        const answerMarkDiv = document.createElement("div");
        answerMarkDiv.className = "quiz-answer-mark-div";

        const choiceDiv = document.createElement("div");
        choiceDiv.className = "quiz-select-one-choice";

        const choiceP = document.createElement("p");
        choiceP.textContent = choice.choice;
        choiceDiv.appendChild(choiceP);

        answerMarkDiv.appendChild(choiceDiv);

        const isSelected = studentAnswer?.id === choice.id;
        const isCorrect = choice.is_correct;

        if (isSelected) {
          choiceDiv.classList.add("selected");
          if (isCorrect) {
            answerMarkDiv.classList.add("correct");
            choiceDiv.classList.add("correct-answer");

            const icon = document.createElement("span");
            icon.className = "material-symbols-outlined";
            icon.textContent = "check";
            answerMarkDiv.appendChild(icon);
          } else {
            answerMarkDiv.classList.add("incorrect");

            const icon = document.createElement("span");
            icon.className = "material-symbols-outlined";
            icon.textContent = "close";
            answerMarkDiv.appendChild(icon);
          }
        }

        choicesContainer.appendChild(answerMarkDiv);
      });

      // Show correct answer if the student's selected answer is wrong
      const correctChoice = choices.find((c) => c.is_correct);
      if (studentAnswer && correctChoice?.id !== studentAnswer?.id) {
        const correctDiv = document.createElement("div");
        correctDiv.className = "correct-answer-div";

        const label = document.createElement("p");
        label.textContent = "Correct Answer";
        const correctText = document.createElement("p");
        correctText.textContent = correctChoice?.choice;

        correctDiv.appendChild(label);
        correctDiv.appendChild(correctText);
        choicesContainer.appendChild(correctDiv);
      }
    }

    questionDiv.appendChild(choicesContainer);
    return questionDiv;
  }

  function resetContainer() {
    document.getElementById("quiz-questions-container").innerHTML = "";
  }

  // * api
  async function getAll(pageNumber = 1, search = "", id = "", quiz = "") {
    try {
      if (id === "") {
        resetContainer();
      }

      const response = await myAxios.get(
        `${API}/quiz-question?search=${search}&pageNumber=${pageNumber}&id=${id}&quiz=${quiz}`
      );

      console.log(response.data);
      if (response.data.success) {
        let allQuestions = response.data.data;

        if (id === "") {
          // * setup quiz details
          let quizDetails = await otherData(`quiz?id=${reviewingQuizId}`);
          console.log("details", quizDetails);

          let allDetailsParags = document.querySelectorAll(".quiz-header p");
          allDetailsParags[0].textContent = quizDetails[0].title;
          allDetailsParags[1].textContent = quizDetails[0].subject.subject_code;
          allDetailsParags[6].textContent = quizDetails[0].instructions;

          // * score over total with percentage, time limit
          // * get the auto computed score
          let score = await otherData(
            `quiz-attempt?score=${CURRENT_USER_ID}&quiz=${quiz}`
          );

          if (score) {
            document.querySelector(
              ".score-over-total-percentage"
            ).textContent = `${score.score}/${score.total} (${score.percentage}%)`;

            document.querySelector(
              "#score-level"
            ).style.width = `${score.percentage}%`;

            document.querySelector(".time-limit").textContent = getTimeSpan(
              quizDetails[0].quiz_start_date,
              quizDetails[0].quiz_end_date
            );
          }

          const container = document.getElementById("quiz-questions-container");

          for (let index = 0; index < allQuestions.length; index++) {
            const question = allQuestions[index];
            console.log("QUESTION FROM DB : ", question);

            // * get the student answers
            const answer = await otherData(
              `quiz-attempt?student=${CURRENT_USER_ID}&question=${question.id}`
            );
            console.log("ANSWER FOR Q: ", answer[0]);

            // * get the choices for that question
            const choices = await otherData(
              `quiz-question-choice?question=${question.id}`
            );
            console.log("CHOICES FROM DB : ", choices);

            // * add the question ui 1 by 1
            if (question && choices && answer.length > 0) {
              container.appendChild(
                createQuizQuestionUI(
                  question,
                  choices,
                  index,
                  answer[0].answer,
                  answer[0].input_answer
                )
              );
            }
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

  await getAll(1, "", "", reviewingQuizId);
});
