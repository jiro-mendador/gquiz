import {
  applyMainSectionMargin,
  onSideNavButtonsClick,
} from "../scripts/utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // * styles
  applyMainSectionMargin();

  // * default funcs
  onSideNavButtonsClick();

  // * BAR CHART
  const labels = [
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
    labels: labels,
    datasets: [
      {
        label: "Quiz",
        data: [65, 59, 80, 81, 56, 55, 40, 32, 45, 60, 70, 90],
        backgroundColor: "rgba(112, 71, 253, 0.6)", // violet-acc1
        borderColor: "rgb(112, 71, 253)",
        borderWidth: 1,
      },
      {
        label: "Submission",
        data: [35, 49, 60, 71, 46, 45, 30, 22, 35, 50, 60, 80],
        backgroundColor: "rgba(112, 71, 253, 0.2)", // violet-acc1
        backgroundColor: "rgba(112, 71, 253, 0.2)", // violet-acc1
        borderWidth: 1,
      },
    ],
  };

  const config = {
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

  const ctxBar = document.getElementById("barChart").getContext("2d");
  new Chart(ctxBar, config);

  // * DOUGHNUT CHART
  const dataDough = {
    labels: ["BSCS", "BSIT", "BSIS"],
    datasets: [
      {
        label: "Students Per Course",
        data: [300, 50, 100],
        backgroundColor: [
          "rgba(112, 75, 213, 0.3)",
          "rgba(112, 75, 213, 0.6)",
          "rgba(112, 75, 213, 0.9)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const configDough = {
    type: "doughnut",
    data: dataDough,
  };

  const ctxDough = document.getElementById("doughnutChart").getContext("2d");
  new Chart(ctxDough, configDough);
});
