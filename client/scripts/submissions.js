import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
  clear,
} from "../scripts/utils.js";

import showToast from "./toast.js";
import myAxios from "./request.js";
import API from "./API.js";

window.addEventListener("DOMContentLoaded", async () => {
  // * clear localstorage item to avoid already selected page
  localStorage.removeItem("gQuizInnerSideNavPageOpened");

  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  // * DEFINE
  let cancelAddEditButton = document.getElementById("cancelAddEditButton");
  let searchInput = document.getElementById("searchInput");
  let filterQuiz = document.getElementById("filter-quiz");

  // * EVENTS
  cancelAddEditButton.addEventListener("click", (e) => {
    e.preventDefault();
    showAddUpdateDiv("none");
  });

  searchInput.addEventListener("change", async (e) => {
    await getAll(1, e.target.value, "", filterQuiz.value);
  });

  filterQuiz.addEventListener("change", async (e) => {
    await getAll(1, searchInput.value, "", e.target.value);
  });

  // * DOM MANIPULATION HERE
  function createQuestionChoicesDiv(questionData = {}) {
    const { question = "", choices = [], studentAnswer = "" } = questionData;

    // * Main container
    const container = document.createElement("div");
    container.className = "question-choices-inputs-div";

    // * Question section
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-div";

    const questionLabel = document.createElement("p");
    questionLabel.textContent = "Question";

    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.disabled = true;
    questionInput.value = question.question;

    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);
    container.appendChild(questionDiv);

    // * Choices (only for non-identification)
    if (choices && choices.length > 0) {
      const choicesContainer = document.createElement("div");
      choicesContainer.className = "choices-container";

      const choicesLabel = document.createElement("p");
      choicesLabel.textContent = "Choices";

      const indivChoicesDiv = document.createElement("div");
      indivChoicesDiv.className = "indiv-choices-div";

      choices.forEach((choice) => {
        const choiceWrapper = document.createElement("div");
        const choiceInput = document.createElement("input");
        choiceInput.type = "text";
        choiceInput.disabled = true;
        choiceInput.value = choice.choice;

        choiceWrapper.appendChild(choiceInput);
        indivChoicesDiv.appendChild(choiceWrapper);
      });

      choicesContainer.appendChild(choicesLabel);
      choicesContainer.appendChild(indivChoicesDiv);
      container.appendChild(choicesContainer);
    }

    // * Student Answer
    const studentAnswerContainer = document.createElement("div");
    studentAnswerContainer.className = "answer-container";

    const studentAnswerLabel = document.createElement("p");
    studentAnswerLabel.textContent = "Student Answer";

    const studentAnswerInput = document.createElement("input");
    studentAnswerInput.type = "text";
    studentAnswerInput.disabled = true;
    studentAnswerInput.value = studentAnswer.choice;
    studentAnswerInput.required = true;

    studentAnswerContainer.appendChild(studentAnswerLabel);
    studentAnswerContainer.appendChild(studentAnswerInput);
    container.appendChild(studentAnswerContainer);

    // * Correct Answer
    const correctAnswerContainer = document.createElement("div");
    correctAnswerContainer.className = "answer-container";

    const correctAnswerLabel = document.createElement("p");
    correctAnswerLabel.textContent = "Correct Answer";

    const correctAnswerInput = document.createElement("input");
    correctAnswerInput.type = "text";
    correctAnswerInput.disabled = true;
    correctAnswerInput.value = choices.find(
      (choice) => choice.is_correct
    ).choice;

    correctAnswerContainer.appendChild(correctAnswerLabel);
    correctAnswerContainer.appendChild(correctAnswerInput);
    container.appendChild(correctAnswerContainer);

    // * Marking icons
    const markDiv = document.createElement("div");
    markDiv.className = "student-mark-div";

    const checkIcon = document.createElement("span");
    checkIcon.className = "material-symbols-outlined unmarked-answer";
    checkIcon.textContent = "check";

    const closeIcon = document.createElement("span");
    closeIcon.className = "material-symbols-outlined unmarked-answer";
    closeIcon.textContent = "close";

    // * add listeners for manual check
    // checkIcon.addEventListener("click", () => {
    //   updateMarkButtonStyles(checkIcon, true, closeIcon);
    // });

    // closeIcon.addEventListener("click", () => {
    //   updateMarkButtonStyles(closeIcon, false, checkIcon);
    // });

    // * update style if correct or incorrect
    if (
      choices.find((choice) => choice.is_correct).choice ===
      studentAnswer.choice
    ) {
      updateMarkButtonStyles(checkIcon, true, closeIcon);
    } else {
      updateMarkButtonStyles(closeIcon, false, checkIcon);
    }

    markDiv.appendChild(checkIcon);
    markDiv.appendChild(closeIcon);
    container.appendChild(markDiv);

    return container;
  }

  function updateMarkButtonStyles(selected, isCorrect, unselected) {
    unselected.className = "material-symbols-outlined unmarked-answer";
    unselected.style.display = "none";
    selected.className =
      "material-symbols-outlined " +
      (isCorrect ? "correct-mark-button" : "incorrect-mark-button");
  }

  function showAddUpdateDiv(addUpdateUserDivDisplay) {
    let addUpdateUserDiv = document.getElementById("addUpdateDiv");
    addUpdateUserDiv.style.display = addUpdateUserDivDisplay;
    document.querySelector(`#addUpdateForm`).style.display =
      addUpdateUserDivDisplay;
  }

  function createTableRow(id, data, quizId = null, studentId = null) {
    let rowsContainer = document.querySelector(
      `#submissionTable > div.custom-table-rows`
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
      resetForms();
      addUpdateForm.dataset.idToUpdate = id;
      await getAll(1, "", id, quizId, studentId);
      showAddUpdateDiv("flex");
    });

    actionSpanDelete.addEventListener("click", () => {
      showToast("Do you want to delete this data?", async () => {
        await remove(id);
      });
    });

    actionButtonsDiv.appendChild(actionSpanEdit);
    actionButtonsDiv.appendChild(actionSpanDelete);
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

    let data = await otherData(routeNameAndParams);

    let defOption = document.createElement("option");
    defOption.textContent = "-- Quizzes --";
    defOption.value = "";
    select.appendChild(defOption);

    data.forEach((forData) => {
      let option = document.createElement("option");
      console.log(forData);

      option.textContent = forData.title;
      option.value = forData.id;
      console.log("OPTION: ", forData);

      select.appendChild(option);
    });

    // * set it as selected
    if (selected) {
      select.value = selected;
    } else {
      select.selectedIndex = 0;
    }
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
      `#generateQuizForm input:not([type='submit'])`
    );
    if (inputs.length > 0) {
      inputs.forEach((input) => {
        input.value = "";
      });
    }
    const textareas = document.querySelectorAll(`#generateQuizForm textarea`);
    if (textareas.length > 0) {
      textareas.forEach((textarea) => {
        textarea.value = "";
      });
    }

    // Clear select and enable it
    // const select = document.querySelector(`#addUpdateForm select`);
    // if (select) {
    //   select.disabled = false;
    //   select.selectedIndex = 0;
    // }

    // Remove data-id-to-update from the form itself
    const form = document.getElementById("addUpdateForm");
    if (form) {
      form.removeAttribute("data-id-to-update");
    }

    // Reset search input if it exists and is defined
    if (typeof searchInput !== "undefined" && searchInput) {
      searchInput.value = "";
    }

    resetResponseUI();
  }

  function resetResponseUI() {
    // * reset all before opening
    let questionDivs =
      document.querySelectorAll(
        "#add-update-inputs-div .question-choices-inputs-div"
      ) || null;

    let quizDetailsInputs = document.querySelectorAll(
      ".quiz-details-div > div > *:nth-child(2)"
    );

    questionDivs.forEach((questionDiv) => {
      questionDiv.remove();
    });

    quizDetailsInputs.forEach((quizDetailsInput) => {
      quizDetailsInput.value = "";
    });
  }

  // * API CALLS HERE
  async function getAll(
    pageNumber = 1,
    search = "",
    id = "",
    quiz = "",
    student = ""
  ) {
    try {
      if (id === "") {
        resetTable();
      }

      const response = await myAxios.get(
        `${API}/quiz-submission?search=${search}&pageNumber=${pageNumber}&id=${id}&quiz=${quiz}&student=${student}`
      );

      console.log(response.data);
      if (response.data.success) {
        let allData = response.data.data;

        if (id === "") {
          allData.forEach(async (data) => {
            // * get the auto computed score
            let score = await otherData(
              `quiz-attempt?score=${data.student.id}&quiz=${data.quiz.id}`
            );

            createTableRow(
              data.id,
              [
                data.quiz.title,
                data.quiz.subject.subject_code,
                `${data.quiz.subject.teacher.first_name} ${data.quiz.subject.teacher.last_name}`,
                `${data.student.first_name} ${data.student.last_name}`,
                `${score.score}/${score.total}`,
                data.submitted_at,
              ],
              data.quiz.id,
              data.student.id
            );
          });
        } else {
          // * FOR UPDATING!
          // * populate quiz details first
          let inputs = document.querySelectorAll(
            `#addUpdateForm .quiz-details-div input:not([type='submit'])`
          );

          console.log("ALL DATA: ", allData);

          inputs[0].value = allData[0].quiz.title;
          inputs[1].value = `${allData[0].quiz.subject.teacher.first_name} ${allData[0].quiz.subject.teacher.last_name}`;
          inputs[2].value = allData[0].quiz.subject.subject_code;
          inputs[3].value = `${allData[0].student.first_name} ${allData[0].student.last_name}`;

          const isoSubmitted = allData[0].submitted_at || null;

          const toDatetimeLocal = (iso) => {
            const date = new Date(iso);
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - offset * 60000); // * Adjust to local time
            return localDate.toISOString().slice(0, 16); // * Keep only YYYY-MM-DDTHH:mm
          };

          inputs[4].value = toDatetimeLocal(isoSubmitted);

          // * get the auto computed score
          let score = await otherData(
            `quiz-attempt?score=${allData[0].student.id}&quiz=${allData[0].quiz.id}`
          );
          inputs[5].value = `${score.score}/${score.total}`;

          // * based on quiz id, get all the questions in the database
          let questions = await otherData(
            `quiz-question?quiz=${allData[0].quiz.id}`
          );
          console.log("QUESTIONS FROM DB", questions);

          // * loop the questions
          questions.forEach(async (question) => {
            // * get the choices for that question on database
            let choices = await otherData(
              `quiz-question-choice?question=${question.id}`
            );
            console.log("CHOICES FROM DB", choices);

            // * after that get the student answer on database
            let studentAnswer = await otherData(
              `quiz-attempt?student=${allData[0].student.id}&question=${question.id}`
            );

            console.log("student answer:", studentAnswer);

            let tempAns = {
              id: studentAnswer[0].answer.id,
              choice: studentAnswer[0].answer.choice,
              is_correct: studentAnswer[0].answer.is_correct,
            };

            if (question.question_type === "identification") {
              tempAns.choice = studentAnswer[0].input_answer.choice;
            }

            // * then construct the ui and add it
            let responseUI = createQuestionChoicesDiv({
              question: question,
              choices: choices,
              studentAnswer: tempAns,
            });

            document
              .querySelector(".add-update-inputs-div")
              .insertBefore(
                responseUI,
                document.querySelector(".add-update-buttons-div")
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

  async function save(e, id = null) {
    try {
      e.preventDefault();

      // * get quiz details inputs
      let title = document.getElementById("title");
      let instructions = document.getElementById("instructions");
      let quiz_start_date = document.getElementById("quiz_start_date");
      let quiz_end_date = document.getElementById("quiz_end_date");
      let quizSubject = document.getElementById("quiz-subject");
      let response = null;
      let dataToSave = null;

      dataToSave = {
        title: title.value,
        instructions: instructions.value,
        subject: quizSubject.value,
        quiz_start_date: new Date(quiz_start_date.value).toISOString(),
        quiz_end_date: new Date(quiz_end_date.value).toISOString(),
      };

      // * save first the quiz details, to have a ref on its id
      if (!id) {
        if (
          document.querySelector(
            ".question-choices-inputs-div .question-div > input"
          ) === null ||
          document.querySelector(
            ".question-choices-inputs-div .question-div > input"
          ).value === ""
        ) {
          showToast("Add at least one question on this quiz!");
          return;
        }
        response = await myAxios.post(`${API}/quiz`, dataToSave);
      } else {
        response = await myAxios.put(`${API}/quiz/${id}`, dataToSave);
      }

      // * checker before proceeding
      if (!response.data.success) {
        showToast(
          "There is an error saving Quiz Details! Please contact your admin."
        );
        return;
      }

      // * save the new quiz details id to a new var
      let savedQuizId = response.data?.data?.id;

      // * now we can save the questions
      dataToSave = [];

      // * get all the question parent containers
      let allQuestionParentContainers = document.querySelectorAll(
        ".question-choices-inputs-div"
      );

      // * loop through the q's and save all in one the choices
      allQuestionParentContainers.forEach(async (questionParentDiv) => {
        let questionInput = questionParentDiv.querySelector(
          ".question-div > input"
        );

        dataToSave = {
          quiz: savedQuizId,
          question: questionInput.value,
          question_type: questionInput.dataset.questionType,
        };

        // * save the question
        if (!id) {
          response = await myAxios.post(`${API}/quiz-question`, dataToSave);
        } else {
          response = await myAxios.put(
            `${API}/quiz-question/${questionInput.dataset.id}`,
            dataToSave
          );
        }

        // * save the new question id
        let newQuestionId = response.data.data.id;

        // * get all the choices' inputs inside the question
        let choicesInputs = null;

        if (questionInput.dataset.questionType !== "identification") {
          choicesInputs = questionParentDiv.querySelectorAll(
            ".indiv-choices-div > div > input"
          );
        } else {
          choicesInputs = questionParentDiv.querySelectorAll(
            ".answer-container > input"
          );
        }

        // * construct an array object first
        dataToSave = [];
        choicesInputs.forEach(async (choiceInput) => {
          let answerInput = questionParentDiv.querySelector(
            ".answer-container >*:nth-child(2)"
          );

          console.log("UPDATING INPUT....: ", choiceInput);
          console.log("UPDATING....: ", choiceInput.value);

          let choiceObject = {
            question: newQuestionId,
            choice: choiceInput.value,
            is_correct: answerInput.value === choiceInput.value,
          };

          if (!id) {
            dataToSave.push(choiceObject);
          } else {
            dataToSave.push({ id: choiceInput.dataset.id, choiceObject });
          }
        });

        // * now save in one go its choices
        if (!id) {
          response = await myAxios.post(
            `${API}/quiz-question-choice`,
            dataToSave
          );
        } else {
          // * if updating, choices should be updated 1 by 1
          dataToSave.forEach(async (data) => {
            response = await myAxios.put(
              `${API}/quiz-question-choice/${data.id}`,
              data.choiceObject
            );
          });
        }

        dataToSave = null;
        response = null;
      });

      // * after that show the prompt
      if (response.data.success) {
        addUpdateForm.removeAttribute("data-id-to-update");
        showToast(response.data.message);
        await getAll(1, searchInput.value, "", filterQuiz.value);
        resetForms();
        showAddUpdateDiv("none", "addUpdateForm");
      }
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
      const response = await myAxios.delete(`${API}/quiz-submission/${id}`);

      console.log(response.data);
      if (response.data.success) {
        showToast(response.data.message);
        await getAll(1, searchInput.value, "", filterQuiz.value);
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

  // await populateSelectElement(null, "quiz-subject", "subject");
  await populateSelectElement(null, "filter-quiz", "quiz");
  await getAll();
});
