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
  // * STYLINGS
  applyMainSectionMargin();
  applyQuizQuestionMargin();

  // * CHECK IF THE USER IS STILL LOGGED IN
  const CURRENT_USER_ID = localStorage.getItem("gquizCurrentUserId");
  if (CURRENT_USER_ID === null && CURRENT_USER_ID === undefined) {
    navigate("./index.html");
  }

  // ! CHECK FIRST IF THE USER CLICKS A QUIZ
  let answeringQuizId = localStorage.getItem("answeringQuizId");
  if (!answeringQuizId) {
    onCancelQuiz();
  }

  // * define
  let minMaxHeaderButton = document.getElementById("minMaxHeaderButton");
  let minMaxHeaderButtonBig = document.getElementById("minMaxHeaderButtonBig");

  let quizHeader = document.getElementById("quizHeader");
  let isQuizHeaderOpen = false;

  let cancelQuizButton = document.getElementById("cancelQuizButton");
  let submitQuizButton = document.getElementById("submitQuizButton");

  let progressPercentage = document.getElementById("progress-percentage");
  let progressLevel = document.getElementById("quiz-progress-level");
  let answeredQuestions = new Set(); // Keeps track of question IDs answered
  let totalQuestions = 0;

  // * events
  minMaxHeaderButton.addEventListener("click", openQuizHeaderOnSmallScreen);
  minMaxHeaderButtonBig.addEventListener("click", openQuizHeaderOnBigScreen);

  // * CANCELLING THE QUIZ
  cancelQuizButton.addEventListener("click", onCancelQuiz);

  // * saving quiz
  submitQuizButton.addEventListener("click", () => {
    // showToast("Are you sure you want to submit your answers?", () => {
    //   // * call save here
    // });
    save();
  });

  // * DOM MANIPULATION
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

  function onCancelQuiz() {
    localStorage.removeItem("answeringQuizId");
    navigate("./dashboard.html");
  }

  function createQuizQuestionUI(question, choices, index) {
    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-question";
    questionDiv.dataset.id = question.id || `q-${index}`; // fallback if no ID

    // Question number and text
    const questionInfoDiv = document.createElement("div");
    questionInfoDiv.className = "quiz-number-question";

    const numberP = document.createElement("p");
    numberP.textContent = `Question ${index + 1}`;

    const textP = document.createElement("p");
    textP.textContent = question.question;

    questionInfoDiv.appendChild(numberP);
    questionInfoDiv.appendChild(textP);
    questionDiv.appendChild(questionInfoDiv);

    // Question type label
    const typeP = document.createElement("p");
    typeP.className = "quiz-question-type";
    typeP.textContent = question.question_type;
    questionDiv.appendChild(typeP);

    // Choices container
    const choicesContainer = document.createElement("div");
    choicesContainer.className = "quiz-choices-container";

    const type = question.question_type.toUpperCase();

    if (type === "IDENTIFICATION" || type === "FILL IN THE BLANKS") {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "quiz-input-answer";
      input.placeholder = "Enter your answer here...";
      input.required = true;
      input.name = `question_${index}`;

      // * put all the reference necessary to save this in one go
      input.dataset.quizId = answeringQuizId;
      input.dataset.questionId = question.id;
      input.dataset.choiceId = choices[0].id;
      input.dataset.questionType = question.question_type;

      input.addEventListener("input", () => {
        const value = input.value.trim();
        const qId = input.dataset.questionId;

        if (value !== "") {
          answeredQuestions.add(qId);
        } else {
          answeredQuestions.delete(qId);
        }

        updateProgress(totalQuestions);
      });

      choicesContainer.appendChild(input);
    } else if (type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE") {
      const options = choices || [];

      options.forEach((choice) => {
        const choiceDiv = document.createElement("div");
        choiceDiv.className = "quiz-select-one-choice";

        // * put all the reference necessary to save this in one go
        choiceDiv.dataset.quizId = answeringQuizId;
        choiceDiv.dataset.questionId = question.id;
        choiceDiv.dataset.choiceId = choice.id;
        choiceDiv.dataset.questionType = question.question_type;

        const choiceP = document.createElement("p");
        choiceP.textContent = choice.choice; // use dynamic text
        choiceDiv.appendChild(choiceP);

        // Add click handler
        choiceDiv.addEventListener("click", () => {
          const qId = choiceDiv.dataset.questionId;
          
          // Unselect others
          const allChoices = choicesContainer.querySelectorAll(
            ".quiz-select-one-choice"
          );
          allChoices.forEach((el) => el.classList.remove("selected"));
          // Select this one
          choiceDiv.classList.add("selected");
          
          answeredQuestions.add(qId);
          updateProgress(totalQuestions);
        });

        choicesContainer.appendChild(choiceDiv);
      });
    }

    questionDiv.appendChild(choicesContainer);
    return questionDiv;
  }

  function collectQuizAnswers() {
    const questionDivs = document.querySelectorAll(".quiz-question");
    const answers = [];
    let allQuestionsAnswered = true;

    questionDivs.forEach((qDiv) => {
      const input = qDiv.querySelector("input.quiz-input-answer");

      if (input) {
        if (input.value !== "") {
          answers.push(input);
        } else {
          allQuestionsAnswered = false;
        }
      } else {
        const selected = qDiv.querySelector(".quiz-select-one-choice.selected");
        if (selected) {
          answers.push(selected);
        } else {
          allQuestionsAnswered = false;
        }
      }
    });

    return { answers, allQuestionsAnswered };
  }

  function resetContainer() {
    document.getElementById("quiz-questions-container").innerHTML = "";
  }

  function startQuizCountdown(quizStartDate, quizEndDate, displayElementId) {
    const display = document.getElementById(displayElementId);

    const start = new Date(quizStartDate).getTime();
    const end = new Date(quizEndDate).getTime();

    function updateCountdown() {
      const now = new Date().getTime();

      if (now < start) {
        display.textContent = "Quiz hasn't started yet";

        // showToast(
        //   "This quiz cannot be answered yet! You will now be redirected to your homepage shortly."
        // );

        // setTimeout(() => {
        //   navigate("./dashboard.html");
        // }, 5000);
      } else if (now > end) {
        display.textContent = "Time is up!";

        // showToast("Time is up! You will be redirected to your homepage!");

        // setTimeout(() => {
        //   navigate("./dashboard.html");
        // }, 5000);
      } else {
        const timeLeft = end - now;

        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);

        display.textContent = `${hours}h ${minutes}m ${seconds}s left`;
      }
    }

    // Initial call
    updateCountdown();

    // Update every second
    const intervalId = setInterval(() => {
      updateCountdown();

      if (new Date().getTime() > end) {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  function updateProgress(totalQuestions) {
    const answeredCount = answeredQuestions.size;
    const percentage = Math.round((answeredCount / totalQuestions) * 100);

    progressPercentage.textContent = `${percentage}%`;
    progressLevel.style.width = `${percentage}%`;
  }

  // * API CALLS
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
        totalQuestions = allQuestions.length;

        if (id === "") {
          // * setup quiz details
          let quizDetails = await otherData(`quiz?id=${answeringQuizId}`);
          console.log("details", quizDetails);

          let allDetailsParags = document.querySelectorAll(".quiz-header p");
          allDetailsParags[0].textContent = quizDetails[0].title;
          allDetailsParags[1].textContent = quizDetails[0].subject.subject_code;
          allDetailsParags[6].textContent = quizDetails[0].instructions;

          allQuestions.forEach(async (question, index) => {
            console.log("QUESTION FROM DB : ", question);

            // * get the choices for that question
            let choices = await otherData(
              `quiz-question-choice?question=${question.id}`
            );
            console.log("CHOICES FROM DB : ", choices);

            // * add the question ui 1 by 1
            document
              .getElementById("quiz-questions-container")
              .appendChild(createQuizQuestionUI(question, choices, index));

            startQuizCountdown(
              quizDetails[0].quiz_start_date,
              quizDetails[0].quiz_end_date,
              "quiz-timer"
            );
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

  async function save() {
    try {
      // * before anything get all student answers and check for null or empty
      let { answers, allQuestionsAnswered } = collectQuizAnswers();

      if (!allQuestionsAnswered) {
        showToast("All questions are required to answer!");
        return;
      }

      let dataToSave = {
        quiz: answeringQuizId,
        student: CURRENT_USER_ID,
      };

      // * initially save the submission, update it once all the answer are saved!
      let response = await myAxios.post(`${API}/quiz-submission`, dataToSave);

      // * checker before proceeding
      if (!response.data.success) {
        showToast(
          "There is an error Submitting Quiz Answers! Please contact your admin."
        );
        return;
      }

      // * save the quiz submission id to a new var
      let quizSubmissionId = response.data?.data?.id;

      if (quizSubmissionId) {
        let studentAnswerToSave = [];

        for (let answerElement of answers) {
          console.log(answerElement);

          let type = answerElement.dataset.questionType;
          let attempt = {
            submission: quizSubmissionId,
            quiz: answeringQuizId,
            question: answerElement.dataset.questionId,
            student: CURRENT_USER_ID,
            answer: answerElement.dataset.choiceId,
          };

          if (type === "identification") {
            attempt.input_answer = answerElement.value;
          }

          studentAnswerToSave.push(attempt);
        }

        // * save all the attempt in one go
        // * initially save the submission, update it once all the answer are saved!
        let response = await myAxios.post(
          `${API}/quiz-attempt`,
          studentAnswerToSave
        );

        // * after that show the prompt
        if (!response.data.success) {
          showToast(
            "There is an error Submitting Quiz Answers! Please contact your admin."
          );
          return;
        }

        // * after saving answers update the submission date
        dataToSave = {
          quiz: answeringQuizId,
          student: CURRENT_USER_ID,
          submitted_at: new Date().toISOString(),
        };

        // * initially save the submission, update it once all the answer are saved!
        response = await myAxios.put(
          `${API}/quiz-submission/${quizSubmissionId}`,
          dataToSave
        );

        if (!response.data.success) {
          showToast(
            "There is an error Submitting Quiz Answers! Please contact your admin."
          );
          return;
        }

        showToast("Quiz answers successfully submitted!");
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

  await getAll(1, "", "", answeringQuizId);

  clear(window, () => {
    // localStorage.removeItem("answeringQuizId");
  });
});
