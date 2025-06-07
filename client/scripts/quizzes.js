import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
  clear,
  formatDateToReadableString,
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
  let addNewButton = document.getElementById("addNewButton");
  let generateButton = document.getElementById("generateButton");
  let cancelAddEditButton = document.getElementById("cancelAddEditButton");
  let cancelGenerateButton = document.getElementById("cancelGenerateButton");

  // * new quiz question type
  let addQuizQuestionType = document.getElementById("question-type");

  // * new quiz question button
  let addQuizQuestion = document.getElementById("addQuizQuestion");

  let searchInput = document.getElementById("searchInput");
  let filterSubject = document.getElementById("filter-subject");
  let addUpdateForm = document.getElementById("addUpdateForm");
  let generateQuizForm = document.getElementById("generateQuizForm");

  // * EVENTS
  addNewButton.addEventListener("click", async () => {
    resetForms();
    showAddUpdateDiv("flex", "addUpdateForm");
  });

  generateButton.addEventListener("click", async (e) => {
    resetForms();
    showAddUpdateDiv("flex", "generateQuizForm");
  });

  cancelAddEditButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("add-question-type-div").style.display = "flex";
    showAddUpdateDiv("none", "addUpdateForm");
  });

  cancelGenerateButton.addEventListener("click", (e) => {
    e.preventDefault();
    showAddUpdateDiv("none", "generateQuizForm");
  });

  addQuizQuestion.addEventListener("click", addNewQuestionToParentDiv);

  searchInput.addEventListener("change", async (e) => {
    await getAll(1, e.target.value, "", filterSubject.value);
  });

  filterSubject.addEventListener("change", async (e) => {
    await getAll(1, searchInput.value, "", e.target.value);
  });

  addUpdateForm.addEventListener("submit", (e) => {
    save(e, addUpdateForm.dataset.idToUpdate);
  });

  generateQuizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    generateQuestion();
  });

  // * DOM MANIPULATION
  function addNewQuestionToParentDiv() {
    if (addQuizQuestionType.value === "") {
      showToast("Please Pick A Question Type First!");
      return;
    }

    document
      .getElementById("add-update-inputs-div")
      .insertBefore(
        createQuestionChoicesDiv(),
        document.getElementById("add-question-type-div")
      );
  }

  function createQuestionChoicesDiv(
    question = null,
    choices = null,
    canRemoveQuestion = false,
    canRemoveChoice = false
  ) {
    // * THIS WILL BE USED TO REFER TO THE QUESTION AND ITS CHILDREN
    const questionId = `question-${Date.now()}`;

    // * Main container
    const container = document.createElement("div");
    container.className = "question-choices-inputs-div";
    container.id = questionId;
    container.name = questionId;

    // * to be able to ref it in update
    const answerInputSelect = document.createElement(
      addQuizQuestionType.value === "identification" ||
        question?.question_type === "identification"
        ? "input"
        : "select"
    );
    answerInputSelect.required = true;

    // * remove question button
    const removeQuestionButton = document.createElement("span");
    removeQuestionButton.className =
      "material-symbols-outlined remove-question-button";
    removeQuestionButton.textContent = "close";

    // * Add click event to remove the whole container
    removeQuestionButton.addEventListener("click", () => {
      container.remove();
    });

    // * Question div
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-div";

    const questionLabel = document.createElement("p");
    questionLabel.textContent = "Question";

    const questionInput = document.createElement("input");
    questionInput.type = "text";
    questionInput.required = true;
    questionInput.dataset.questionType = addQuizQuestionType.value;

    // * for updating
    if (question) {
      questionInput.value = question.question;
      questionInput.dataset.id = question?.id;
      questionInput.dataset.questionType = question.question_type;
    }

    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(questionInput);

    if (!question || canRemoveQuestion) {
      container.appendChild(removeQuestionButton);
    }

    container.appendChild(questionDiv);

    // * only exclude choices if it is an identification
    if (
      addQuizQuestionType.value !== "identification" ||
      question?.question_type !== "identification"
    ) {
      // * Choices container
      const choicesContainer = document.createElement("div");
      choicesContainer.className = "choices-container";

      const choicesLabel = document.createElement("p");
      choicesLabel.textContent = "Choices";

      // const indivChoiceDiv = document.createElement("div");
      // indivChoiceDiv.className = "indiv-choices-div";

      if (addQuizQuestionType.value !== "identification") {
        choicesContainer.appendChild(choicesLabel);
        // choicesContainer.appendChild(indivChoiceDiv);
      }

      // * only add multiple choice if the question is a multi choice question
      if (
        addQuizQuestionType.value === "multiple_choice" ||
        question?.question_type === "multiple_choice"
      ) {
        // const choiceInputRemoveDiv = document.createElement("div");

        // // * remove choice button
        // const removeChoiceButton = document.createElement("span");
        // removeChoiceButton.className =
        //   "material-symbols-outlined remove-choice-button";
        // removeChoiceButton.textContent = "close";
        // // * Add click event to remove the choice container
        // removeChoiceButton.addEventListener("click", () => {
        //   choiceInputRemoveDiv.remove();
        // });

        // const choiceInput = document.createElement("input");
        // choiceInput.type = "text";
        // choiceInput.required = true;

        // choiceInputRemoveDiv.appendChild(choiceInput);
        // choiceInputRemoveDiv.appendChild(removeChoiceButton);
        // indivChoiceDiv.appendChild(choiceInputRemoveDiv);

        // * for updating
        if (choices) {
          choices.forEach((choice) => {
            const newChoiceDiv = document.createElement("div");
            newChoiceDiv.className = "indiv-choices-div";

            const newChoiceInputRemoveDiv = document.createElement("div");

            const newChoiceInput = document.createElement("input");
            newChoiceInput.type = "text";
            newChoiceInput.required = true;
            newChoiceInput.value = choice?.choice;
            newChoiceInput.dataset.id = choice?.id;
            newChoiceInput.id = choice?.id;
            newChoiceInput.name = choice?.id;

            const newRemoveChoiceButton = document.createElement("span");
            // * remove choice button
            newRemoveChoiceButton.className =
              "material-symbols-outlined remove-choice-button";
            newRemoveChoiceButton.textContent = "close";
            // * Add click event to remove the choice container
            newRemoveChoiceButton.addEventListener("click", () => {
              newChoiceDiv.remove();
              updateAnswerOptions(container, answerInputSelect);
            });

            newChoiceInputRemoveDiv.appendChild(newChoiceInput);

            if (canRemoveChoice) {
              newChoiceInputRemoveDiv.appendChild(newRemoveChoiceButton);
            }

            newChoiceDiv.appendChild(newChoiceInputRemoveDiv);
            choicesContainer.appendChild(newChoiceDiv);

            updateAnswerOptions(container, answerInputSelect);
          });
        }

        if (!choices || canRemoveChoice) {
          // * Add Choice button
          const addChoiceButton = document.createElement("button");
          addChoiceButton.className = "add-choice-button";
          addChoiceButton.type = "button"; // * Prevent form submission

          const addIcon = document.createElement("span");
          addIcon.className = "material-symbols-outlined";
          addIcon.textContent = "add";

          addChoiceButton.appendChild(addIcon);
          addChoiceButton.appendChild(document.createTextNode("Add Choice"));

          // * Add functionality to append a new choice input
          addChoiceButton.addEventListener("click", () => {
            const newChoiceDiv = document.createElement("div");
            newChoiceDiv.className = "indiv-choices-div";

            const newChoiceInputRemoveDiv = document.createElement("div");

            // * remove choice button
            const newRemoveChoiceButton = document.createElement("span");
            newRemoveChoiceButton.className =
              "material-symbols-outlined remove-choice-button";
            newRemoveChoiceButton.textContent = "close";
            // * Add click event to remove the choice container
            newRemoveChoiceButton.addEventListener("click", () => {
              newChoiceDiv.remove();
              updateAnswerOptions(container, answerInputSelect);
            });

            const newChoiceInput = document.createElement("input");
            newChoiceInput.type = "text";
            newChoiceInput.required = true;

            newChoiceInputRemoveDiv.appendChild(newChoiceInput);
            newChoiceInputRemoveDiv.appendChild(newRemoveChoiceButton);
            newChoiceDiv.appendChild(newChoiceInputRemoveDiv);
            choicesContainer.insertBefore(newChoiceDiv, addChoiceButton);

            updateAnswerOptions(container, answerInputSelect);
          });
          choicesContainer.appendChild(addChoiceButton);
        }
      }

      // * only add true false choices if the question is a true or false
      if (
        addQuizQuestionType.value === "true_false" ||
        question?.question_type === "true_false"
      ) {
        const indivChoiceDiv = document.createElement("div");
        indivChoiceDiv.className = "indiv-choices-div";

        const choiceInputTrueDiv = document.createElement("div");
        const choiceInputFalseDiv = document.createElement("div");

        const choiceInputTrue = document.createElement("input");
        choiceInputTrue.type = "text";
        choiceInputTrue.required = true;
        choiceInputTrue.disabled = true;
        choiceInputTrue.value = "true";

        // * for updating
        if (choices) {
          choiceInputTrue.value = choices.filter(
            (choice) => choice?.choice === "true"
          )[0]?.choice;
          choiceInputTrue.dataset.id = choices.filter(
            (choice) => choice?.choice === "true"
          )[0]?.id;
        }

        const choiceInputFalse = document.createElement("input");
        choiceInputFalse.type = "text";
        choiceInputFalse.required = true;
        choiceInputFalse.disabled = true;
        choiceInputFalse.value = "false";

        // * for updating
        if (choices) {
          choiceInputFalse.value = choices.filter(
            (choice) => choice?.choice === "false"
          )[0]?.choice;
          choiceInputFalse.dataset.id = choices.filter(
            (choice) => choice?.choice === "false"
          )[0]?.id;
        }

        choiceInputTrueDiv.appendChild(choiceInputTrue);
        choiceInputFalseDiv.appendChild(choiceInputFalse);

        indivChoiceDiv.appendChild(choiceInputTrueDiv);
        indivChoiceDiv.appendChild(choiceInputFalseDiv);
        choicesContainer.appendChild(indivChoiceDiv);
      }

      container.appendChild(choicesContainer);
    }

    // * Answer container
    const answerContainer = document.createElement("div");
    answerContainer.className = "answer-container";

    const answerLabel = document.createElement("p");
    answerLabel.textContent = "Correct Answer";

    answerInputSelect.name = "correct-answer";

    // * if true or false append to options for that
    if (
      addQuizQuestionType.value === "true_false" ||
      question?.question_type === "true_false"
    ) {
      const trueOption = document.createElement("option");
      trueOption.value = true;
      trueOption.innerText = "true";
      const falseOption = document.createElement("option");
      falseOption.value = false;
      falseOption.innerText = "false";
      answerInputSelect.append(trueOption);
      answerInputSelect.append(falseOption);
    }

    answerContainer.appendChild(answerLabel);

    answerContainer.appendChild(answerInputSelect);

    container.appendChild(answerContainer);

    if (
      addQuizQuestionType.value === "multiple_choice" ||
      question?.question_type === "multiple_choice"
    ) {
      updateAnswerOptions(container, answerInputSelect);
    }

    // * for updating
    if (choices) {
      answerInputSelect.value = choices.filter(
        (choice) => choice?.is_correct
      )[0]?.choice;

      if (
        addQuizQuestionType.value === "identification" ||
        question?.question_type === "identification"
      ) {
        answerInputSelect.id = choices.filter(
          (choice) => choice?.is_correct
        )[0]?.id;
      }
    }

    return container;
  }

  // * helper function for multiple choice correct answer
  function updateAnswerOptions(container, answerInputSelect) {
    // * Clear old options
    answerInputSelect.innerHTML = "";

    const allChoiceInputs = container.querySelectorAll(
      ".choices-container input[type='text']:not(:disabled)"
    );

    if (allChoiceInputs.length === 0) {
      const option = document.createElement("option");
      option.disabled = true;
      option.selected = true;
      option.textContent = null;
      answerInputSelect.appendChild(option);
      return;
    }

    allChoiceInputs.forEach((input) => {
      const option = document.createElement("option");
      option.value = input.value;
      option.textContent = input.value;
      answerInputSelect.appendChild(option);

      input.addEventListener("input", () => {
        option.value = input.value;
        option.textContent = input.value;
      });
    });
  }

  function showAddUpdateDiv(addUpdateUserDivDisplay, form) {
    let addUpdateUserDiv = document.getElementById("addUpdateDiv");
    addUpdateUserDiv.style.display = addUpdateUserDivDisplay;
    document.querySelector(`#${form}`).style.display = addUpdateUserDivDisplay;
  }

  function createTableRow(id, data) {
    let rowsContainer = document.querySelector(
      `#quizTable > div.custom-table-rows`
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
      document.getElementById("add-question-type-div").style.display = "none";
      await getAll(null, "", id);
      showAddUpdateDiv("flex", "addUpdateForm");
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
    defOption.textContent = "-- Subjects --";
    defOption.value = "";
    select.appendChild(defOption);

    data.forEach((forData) => {
      let option = document.createElement("option");
      console.log(forData);

      option.textContent = forData.subject_code;
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

    resetQuestionUI();
  }

  function resetQuestionUI() {
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

  // * API CALLS
  async function getAll(pageNumber = 1, search = "", id = "", subject = "") {
    try {
      if (id === "") {
        resetTable();
      }

      const response = await myAxios.get(
        `${API}/quiz?search=${search}&pageNumber=${pageNumber}&id=${id}&subject=${subject}`
      );

      console.log(response.data);
      if (response.data.success) {
        let allData = response.data.data;

        if (id === "") {
          allData.forEach((data) => {
            createTableRow(data.id, [
              data.title,
              data.instructions,
              data.subject.subject_code,
              `${data.subject.teacher.first_name} ${data.subject.teacher.last_name}`,
              data.quiz_start_date,
              data.quiz_end_date,
            ]);
          });
        } else {
          // * FOR UPDATING!
          // * populate quiz details first
          let inputs = document.querySelectorAll(
            `#addUpdateForm .quiz-details-div input:not([type='submit'])`
          );
          inputs[0].value = allData[0].title;
          inputs[1].value = allData[0].instructions;

          const isoStart = allData[0].quiz_start_date;
          const isoEnd = allData[0].quiz_end_date;

          const toDatetimeLocal = (iso) => {
            const date = new Date(iso);
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - offset * 60000); // * Adjust to local time
            return localDate.toISOString().slice(0, 16); // * Keep only YYYY-MM-DDTHH:mm
          };

          inputs[2].value = toDatetimeLocal(isoStart);
          inputs[3].value = toDatetimeLocal(isoEnd);

          await populateSelectElement(
            allData[0].subject.id,
            "quiz-subject",
            "subject"
          );

          // * get all the quiz questions from the database
          let questions = await otherData(
            `quiz-question?quiz=${allData[0].id}`
          );
          console.log("QUESTION FROM DB : ", questions);

          // * loop through the quiz questions from db
          questions.forEach(async (question) => {
            // * now get all the question choices from the database
            let choices = await otherData(
              `quiz-question-choice?question=${question.id}`
            );
            console.log("CHOICES FROM DB : ", choices);

            // * construct the ui now here
            let questionUI = createQuestionChoicesDiv(question, choices);

            document
              .getElementById("add-update-inputs-div")
              .insertBefore(
                questionUI,
                document.getElementById("add-question-type-div")
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
        await getAll(1, searchInput.value, "", filterSubject.value);
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
      const response = await myAxios.delete(`${API}/quiz/${id}`);

      console.log(response.data);
      if (response.data.success) {
        showToast(response.data.message);
        await getAll(1, searchInput.value, "", filterSubject.value);
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

  // * QUIZ GENERATION!!!!
  async function generateQuestion() {
    try {
      let promptInstructions = document.getElementById("prompt-instructions");
      let promptItems = document.getElementById("prompt-items");
      let promptSubject = document.getElementById("prompt-subject");
      let promptDifficultyLevel = document.getElementById(
        "prompt-difficulty-level"
      );

      let promptObject = {
        prompt: `${promptInstructions.value}. 
          The question types format should be multiple_choice, identification, and true_false. 
          It should be ${promptItems.value} questions. 
          The quiz subject is about ${promptSubject.value}. 
          The quiz difficulty is ${promptDifficultyLevel.value}.
          NOTE! : if question_type is identification STILL create choices array with one choice and is_correct = true.
          NOTE! : if question_type is true_false, set choice as "true" or "false" and not "True" or "False".
          NOTE! : if question_type is true_false STILL create choice for true or false even if it is not the correct answer just set is_correct = false.
          Return your response in a JSON in this specific format [{question:"", question_type:"", choices:[choice:"", is_correct:true/false]}]`,
      };

      const response = await myAxios.post(`${API}/generate`, promptObject);

      console.log(response.data);
      if (response.data.success) {
        // * after a successful  generation,
        // * create a question div before opening the window

        // * get all the quiz questions from the database
        let ai_generated_questions = response.data.generated_answer;
        console.log("QUESTION FROM AI : ", ai_generated_questions);

        // * loop through the quiz questions from ai
        ai_generated_questions.forEach(async (ai_generated_question) => {
          // * now get all the question choices from ai
          console.log("CHOICES FROM AI : ", ai_generated_question.choices);

          // * construct the ui now here
          let questionUI = createQuestionChoicesDiv(
            ai_generated_question,
            ai_generated_question.choices,
            true,
            true
          );

          document
            .getElementById("add-update-inputs-div")
            .insertBefore(
              questionUI,
              document.getElementById("add-question-type-div")
            );
        });

        showAddUpdateDiv("none", "generateQuizForm");
        showAddUpdateDiv("flex", "addUpdateForm");
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

  await populateSelectElement(null, "quiz-subject", "subject");
  await populateSelectElement(null, "filter-subject", "subject");
  await getAll();

  clear(window, () => {
    resetForms();
  });
});
