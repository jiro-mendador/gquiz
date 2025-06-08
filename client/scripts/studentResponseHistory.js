import {
  navigate,
  applyMainSectionMargin,
  onSideNavButtonsClick,
  clear,
  formatDateToReadableString,
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

  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  // * define
  let searchInput = document.getElementById("searchInput");
  let filterSubject = document.getElementById("filter-subject");

  // * events
  searchInput.addEventListener("change", async (e) => {
    await getStudentResponses(e.target.value, filterSubject.value);
  });

  filterSubject.addEventListener("change", async (e) => {
    await getStudentResponses(searchInput.value, e.target.value);
  });

  // * dom
  function createOtherQuizUI(quiz) {
    console.log("QUIZ : ", quiz);

    // * Container div
    const quizDiv = document.createElement("div");
    quizDiv.className = "other-quiz";

    // * Icon span
    const iconSpan = document.createElement("span");
    iconSpan.className = "material-symbols-outlined";
    iconSpan.textContent = "quiz";
    quizDiv.appendChild(iconSpan);

    // * Quiz info container
    const infoDiv = document.createElement("div");

    const titleP = document.createElement("p");
    titleP.textContent = quiz.title || "Untitled Quiz";

    const dateP = document.createElement("p");
    dateP.textContent = formatDateToReadableString(quiz.quiz_start_date);

    const timeSpanP = document.createElement("p");
    timeSpanP.textContent = getTimeSpan(
      quiz.quiz_start_date,
      quiz.quiz_end_date
    );

    infoDiv.appendChild(titleP);
    infoDiv.appendChild(dateP);
    infoDiv.appendChild(timeSpanP);

    quizDiv.appendChild(infoDiv);

    // * Take Quiz button
    const takeQuizBtn = document.createElement("button");
    takeQuizBtn.className = "review-quiz-button";
    takeQuizBtn.textContent = "Review";

    // * events
    takeQuizBtn.onclick = () => {
      localStorage.setItem("reviewingQuizId", quiz.id);
      openQuiz();
    };

    quizDiv.appendChild(takeQuizBtn);

    return quizDiv;
  }

  function resetContainers() {
    let otherQuizContainer = document.getElementById("otherQuizzedDiv");
    if (otherQuizContainer) {
      otherQuizContainer.innerHTML = "";
    }
  }

  function openQuiz() {
    navigate("./student-answer.html");
  }

  // * API CALLS
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

  async function getStudentResponses(search = "", subject = "") {
    // * TO GET THE STUDENT'S QUIZZES
    try {
      resetContainers();

      let studentQuizzes = await otherData(
        `quiz-submission?search=${search}&student=${CURRENT_USER_ID}&subject=${subject}`
      );

      if (studentQuizzes) {
        console.log(studentQuizzes);
        for (let i = 0; i < studentQuizzes.length; i++) {
          let containerName = "otherQuizzedDiv";
          let UI = createOtherQuizUI(studentQuizzes[i].quiz);
          document.getElementById(containerName).appendChild(UI);
        }
      }
    } catch (error) {
      console.error("Error fetching student quizzes:", error);
    }
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
    let option = document.createElement("option");
    option.textContent = "-- Subjects --";
    option.value = "";
    select.appendChild(option);

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

  await getStudentResponses("", "");

  // * to get subjects
  let studentCourse = await otherData(
    `student-course-year-section?student=${CURRENT_USER_ID}`
  );
  if (studentCourse) {
    console.log(studentCourse);
    let studentYearSection = await otherData(
      `year-section?id=${studentCourse[0].year_section}&`
    );
    if (studentYearSection) {
      console.log(studentYearSection);
      await populateSelectElement(
        null,
        "filter-subject",
        `subject?course=${studentCourse[0].course}&year=${studentYearSection[0].year}`
      );
    }
  }
});
