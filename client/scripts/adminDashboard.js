import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
  clear,
  chartBgColors,
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

  // * check the role first
  let CURRENT_USER_ID = localStorage.getItem("gquizCurrentUserId");
  let CURRENT_USER_ROLE = localStorage.getItem("gquizCurrentUserRole");

  let barChart;
  let doughnutChart;

  let filterQuiz = document.getElementById("filter-quiz");

  filterQuiz.addEventListener("change", async (e) => {
    // * time spent
    let aveDiv = document.querySelector(
      ".average-mistake-time-div > div:nth-child(1)"
    );
    if (aveDiv) {
      aveDiv.style.display = filterQuiz.value === "" ? "none" : "block";
    }

    await getReportsForTeachers(e.target.value);
  });

  // * DOM MANIPULATIONS
  function generateChart(config, id) {
    const context = document.getElementById(id).getContext("2d");
    return new Chart(context, config);
  }

  function createTableRow(id, data) {
    let rowsContainer = document.querySelector(
      `#commonMistakesTable > div.custom-table-rows`
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

    rowsContainer.appendChild(tableDataDiv);
  }

  function resetContainers() {
    if (barChart) {
      barChart.destroy();
    }
    if (doughnutChart) {
      doughnutChart.destroy();
    }

    let aveDiv = document.querySelector(
      ".average-mistake-time-div > div:nth-child(1)"
    );
    if (aveDiv) {
      aveDiv.style.display = filterQuiz.value === "" ? "none" : "block";
    }

    document.getElementById("barChart").innerHTML = "";
    document.getElementById("doughnutChart").innerHTML = "";
    document.querySelector(
      "#commonMistakesTable > div.custom-table-rows"
    ).innerHTML = "";
  }

  async function checkUserRole() {
    let overall = document.getElementById("overall-count");
    let doughtOther = document.getElementById("dough-other-chart");
    let teacher = document.getElementById("teachers-div");
    let searchQuizDiv = document.getElementById("searchQuizDiv");
    if (CURRENT_USER_ROLE === "admin") {
      overall.style.display = "flex";
      doughtOther.style.display = "flex";
      teacher.style.display = "none";
      searchQuizDiv.style.display = "none";
      await getAll("", "", "admin");
    } else {
      overall.style.display = "none";
      doughtOther.style.display = "none";
      teacher.style.display = "flex";
      searchQuizDiv.style.display = "flex";
      await populateSelectElement(
        null,
        "filter-quiz",
        `quiz?teacher=${CURRENT_USER_ID}`
      );

      await getReportsForTeachers(filterQuiz.value);
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

    let defOption = document.createElement("option");
    defOption.textContent = "-- Quizzes --";
    defOption.value = "";
    select.appendChild(defOption);

    data.data.forEach((forData) => {
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

  // * API CALLS
  async function getAll(id = "", role = "", reports = "") {
    try {
      resetContainers();
      const response = await myAxios.get(
        `${API}/user?id=${id}&role=${role}&reports=${reports}`
      );

      console.log(response.data);
      if (response.data.success) {
        let userReports = response.data.reports;

        // * get the over all count divs
        let overAllCountDivs = document.querySelectorAll(".overall-count");

        // * get the other over all count divs
        let otherOverallCount = document.querySelectorAll(".other-count");

        overAllCountDivs[0].querySelector("p:nth-child(2)").textContent =
          userReports.role_counts.totalUsers;

        overAllCountDivs[1].querySelector("p:nth-child(2)").textContent =
          userReports.role_counts.totalAdmins;

        overAllCountDivs[2].querySelector("p:nth-child(2)").textContent =
          userReports.role_counts.totalTeachers;

        overAllCountDivs[3].querySelector("p:nth-child(2)").textContent =
          userReports.role_counts.totalStudents;

        // * get total course
        let courseReports = await otherData(`course?reports=${reports}`);
        let subjectReports = await otherData(`subject?reports=${reports}`);
        let quizReports = await otherData(`quiz?reports=${reports}`);
        let quizSubmissionReports = await otherData(
          `quiz-submission?reports=${reports}`
        );

        otherOverallCount[0].querySelector("p:nth-child(2)").textContent =
          courseReports.reports.total_courses;

        otherOverallCount[1].querySelector("p:nth-child(2)").textContent =
          subjectReports.reports.total_subjects;

        otherOverallCount[2].querySelector("p:nth-child(2)").textContent =
          quizReports.reports.total_quizzes;

        otherOverallCount[3].querySelector("p:nth-child(2)").textContent =
          quizSubmissionReports.reports.total_submissions;

        // * FOR CHARTS
        let courseSummary = await otherData("student-course-year-section");
        let labels = [];
        let dataHolder = [];

        courseSummary.summary.totalStudentsPerCourse.forEach((data) => {
          labels.push(data.courseName);
          dataHolder.push(data.totalStudents);
        });

        // * doughnut chart
        if (doughnutChart) {
          doughnutChart.destroy();
        }
        doughnutChart = generateChart(
          {
            type: "doughnut",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Students Per Course",
                  data: dataHolder,
                  backgroundColor: chartBgColors,
                  hoverOffset: 4,
                },
              ],
            },
          },
          "doughnutChart"
        );

        // * BAR CHART
        const selectedYear = new Date().getFullYear();
        console.log(selectedYear);

        document.querySelector("#currentYearSpan").textContent = selectedYear;

        // * construct monthly pass data
        let monthlyResults = quizSubmissionReports.reports.monthly_results;
        console.log("PASS FAIL", monthlyResults);
        let passedStudents = [];
        let failedStudents = [];

        for (let i = 1; i <= 12; i++) {
          let month = i <= 9 ? "0" + i : i.toString();
          passedStudents.push(monthlyResults[`${selectedYear}-${month}`].pass);
          failedStudents.push(monthlyResults[`${selectedYear}-${month}`].fail);
        }

        console.log("passed : ", passedStudents);
        console.log("failed : ", failedStudents);

        const labelMonths = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const data = {
          labels: labelMonths,
          datasets: [
            {
              label: "Pass",
              data: passedStudents,
              backgroundColor: "rgba(112, 71, 253, 0.6)",
              borderColor: "rgb(112, 71, 253)",
              borderWidth: 1,
            },
            {
              label: "Fail",
              data: failedStudents,
              backgroundColor: "rgba(112, 71, 253, 0.2)", // violet-acc1
              borderWidth: 1,
            },
          ],
        };

        let config = {
          type: "bar",
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };

        if (barChart) {
          barChart.destroy();
        }
        barChart = generateChart(config, "barChart");
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
        return response.data;
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

  // * for teacher
  async function getReportsForTeachers(quiz = "") {
    try {
      resetContainers();
      const response = await myAxios.get(
        `${API}/quiz-report?reports=teacher&quiz=${quiz}&user=${CURRENT_USER_ID}`
      );
      console.log(response.data);

      if (response.data.success) {
        let teacherReports = response.data;

        // * time spent
        document.getElementById("average-time-spent").textContent =
          teacherReports?.average_time_minutes[quiz]?.average_minutes +
          " minutes";

        // * common mistakes
        const commonMistakes = teacherReports?.common_mistakes;

        for (const question in commonMistakes) {
          if (Object.hasOwnProperty.call(commonMistakes, question)) {
            const mistake = commonMistakes[question];
            createTableRow(question, [
              mistake["question_text"],
              mistake["correct_answer"],
              mistake["common_wrong_answer"],
              mistake["%wrong"],
              mistake["misconception"],
            ]);
          }
        }

        // * BAR CHART
        const selectedYear = new Date().getFullYear();
        console.log(selectedYear);

        document.querySelector("#currentYearSpan").textContent = selectedYear;

        // * construct monthly pass data
        let monthlyResults = teacherReports.monthly_results_summary;
        console.log("PASS FAIL", monthlyResults);
        let passedStudents = [];
        let failedStudents = [];

        for (let i = 1; i <= 12; i++) {
          let month = i <= 9 ? "0" + i : i.toString();
          passedStudents.push(monthlyResults[`${selectedYear}-${month}`].pass);
          failedStudents.push(monthlyResults[`${selectedYear}-${month}`].fail);
        }

        console.log("passed : ", passedStudents);
        console.log("failed : ", failedStudents);

        const labelMonths = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const data = {
          labels: labelMonths,
          datasets: [
            {
              label: "Pass",
              data: passedStudents,
              backgroundColor: "rgba(112, 71, 253, 0.6)",
              borderColor: "rgb(112, 71, 253)",
              borderWidth: 1,
            },
            {
              label: "Fail",
              data: failedStudents,
              backgroundColor: "rgba(112, 71, 253, 0.2)", // violet-acc1
              borderWidth: 1,
            },
          ],
        };

        let config = {
          type: "bar",
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };

        if (barChart) {
          barChart.destroy();
        }
        barChart = generateChart(config, "barChart");
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

  await checkUserRole();
});
