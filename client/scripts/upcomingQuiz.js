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

  searchInput.addEventListener("change", async (e) => {
    await getStudentQuizzes(e.target.value, filterSubject.value);
  });

  filterSubject.addEventListener("change", async (e) => {
    await getStudentQuizzes(searchInput.value, e.target.value);
  });

  // * events

  // * DOM
  function resetContainers() {
    let upcomingQuizzesDiv = document.getElementById("upcoming-quizzes-div");
    if (upcomingQuizzesDiv) {
      upcomingQuizzesDiv.innerHTML = "";
    }
  }

  function createStartingSoonQuizIU(quiz) {
    let individualQuizDiv = document.createElement("div");
    individualQuizDiv.className = "quiz";

    // * header
    let quizHeaderDiv = document.createElement("div");
    quizHeaderDiv.className = "quiz-header";

    let iconCircleDiv = document.createElement("div");
    iconCircleDiv.className = "icon-circle";

    let quizSpanIcon = document.createElement("span");
    quizSpanIcon.className = "material-symbols-outlined";
    quizSpanIcon.textContent = "quiz";

    let quizDateDiv = document.createElement("div");
    quizDateDiv.className = "quiz-date";
    quizDateDiv.textContent = formatDateToReadableString(quiz.quiz_start_date);

    iconCircleDiv.appendChild(quizSpanIcon);
    quizHeaderDiv.appendChild(iconCircleDiv);
    quizHeaderDiv.appendChild(quizDateDiv);

    // * add header
    individualQuizDiv.appendChild(quizHeaderDiv);

    // * title
    let quizTitleHeading = document.createElement("h2");
    quizTitleHeading.textContent = quiz.title;

    // * subject
    let quizSubjectParag = document.createElement("p");
    quizSubjectParag.className = "quiz-subject";
    quizSubjectParag.textContent = quiz.subject.subject_code;

    // * add title and subject
    individualQuizDiv.appendChild(quizTitleHeading);
    individualQuizDiv.appendChild(quizSubjectParag);

    let dividerLineDiv = document.createElement("h2");
    dividerLineDiv.className = "divider-line";

    // * add divider line
    individualQuizDiv.appendChild(dividerLineDiv);

    let quizFooterDiv = document.createElement("div");
    quizFooterDiv.className = "quiz-footer";

    let takeQuizButton = document.createElement("button");
    takeQuizButton.className = "take-quiz-button";
    takeQuizButton.textContent = "Take Quiz";

    // * event
    takeQuizButton.onclick = openQuiz;

    let quizTimeLimitDiv = document.createElement("div");
    quizTimeLimitDiv.className = "quiz-time-limit";

    let historySpanIcon = document.createElement("span");
    historySpanIcon.className = "material-symbols-outlined";
    historySpanIcon.textContent = "history";

    let quizTimeLimitParag = document.createElement("p");
    quizTimeLimitParag.textContent =
      getTimeSpan(quiz.quiz_start_date, quiz.quiz_end_date) || "0m";

    // * add time limit parag and span icon
    quizTimeLimitDiv.appendChild(historySpanIcon);
    quizTimeLimitDiv.appendChild(quizTimeLimitParag);

    quizFooterDiv.appendChild(takeQuizButton);
    quizFooterDiv.appendChild(quizTimeLimitDiv);

    // * add footer
    individualQuizDiv.appendChild(quizFooterDiv);

    return individualQuizDiv;
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

  function openQuiz() {
    showToast("This quiz is not available yet for answering!");
  }

  // * API
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

  async function getStudentQuizzes(search = "", subject = "") {
    // * TO GET THE STUDENT'S QUIZZES
    try {
      resetContainers();

      let studentQuizzes = await otherData(
        `quiz?search=${search}&student_id=${CURRENT_USER_ID}&&subject=${subject}&&upcoming=true`
      );

      if (studentQuizzes) {
        console.log(studentQuizzes);
        for (let i = 0; i < studentQuizzes.length; i++) {
          let containerName = "upcoming-quizzes-div";
          let UI = createStartingSoonQuizIU(studentQuizzes[i]);
          document.getElementById(containerName).appendChild(UI);
        }
      }
    } catch (error) {
      console.error("Error fetching student quizzes:", error);
    }
  }

  await getStudentQuizzes("", "");

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
