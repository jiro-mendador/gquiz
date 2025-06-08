import showToast from "./toast.js";

function navigate(file) {
  // window.location.href = url;
  window.location.replace(file);
}

function onSideNavButtonsClick() {
  // * CHECK THE ROLE OF CURRENT ACC FIRST
  const userRole = localStorage.getItem("gquizCurrentUserRole");

  const navButtons = document.querySelectorAll("nav > div");
  if (navButtons) {
    navButtons.forEach((button, index) => {
      if (userRole === "teacher" && index <= 2 && index >= 1) {
        button.style.display = "none";
      }
      button.addEventListener("click", (e) => sideNavClickFunction(e, index));
    });

    function sideNavClickFunction(e, index) {
      // * CHECK IF THE CLICKED NAV HAS CHILDREN INSIDE
      if (
        e.currentTarget.id &&
        e.currentTarget.id === "side-nav-has-children"
      ) {
        onInnerSideNavClick();
      } else {
        openNavPage(index, userRole);
      }
    }

    function openNavPage(index, userRole) {
      let page = userRole === "student" ? "dashboard" : "admin-dashboard";

      switch (index) {
        case 0:
          page = userRole === "student" ? "dashboard" : "admin-dashboard";
          break;
        case 1:
          page = userRole === "student" ? "upcoming-quiz" : "users";
          break;
        case 2:
          if (userRole === "student") {
            page = "student-response-history";
            break;
          }
        // if not student, fall through
        case 3:
          page = userRole === "student" ? "profile" : "quizzes";
          break;
        case 4:
          page = userRole === "student" ? "" : "submissions";
          break;
        case 5:
          page = userRole === "student" ? "../profile" : "admin-profile";
          break;
      }
      navigate(`./${page}.html`);
    }
  }
}

function onInnerSideNavClick() {
  // * REPLACE THE ARROW ICON
  let arrow = document.getElementById("arrow-span");
  arrow.innerHTML =
    arrow.innerHTML === "arrow_drop_down" ? "arrow_drop_up" : "arrow_drop_down";

  // * DISPLAY THE INNER CHILDREN
  let navInnerChildren = document.getElementById("inner-header-dropdown");

  navInnerChildren.style.display =
    navInnerChildren.style.display === "flex" ? "none" : "flex";

  // * ADD LISTENERS TO THE INNER NAVS
  const innerNavButtons = document.querySelectorAll(
    "#inner-header-dropdown > div"
  );

  innerNavButtons.forEach((innerNavButton, index) => {
    innerNavButton.addEventListener("click", () => {
      localStorage.setItem("gQuizInnerSideNavPageOpened", index);
      navigate("./school.html");
    });
  });

  // * CHECK IF THE INNER NAV PAGE ACTUALLY OPENED
  let innerNavPageOpened = localStorage.getItem("gQuizInnerSideNavPageOpened");
  document.querySelectorAll(`#inner-header-dropdown > div`)[
    innerNavPageOpened
  ].className = "selected";

  // * change labels based on which page was opened
  let pageName =
    innerNavPageOpened === "0"
      ? "Year & Section"
      : innerNavPageOpened === "1"
      ? "Courses"
      : innerNavPageOpened === "2"
      ? "Subjects"
      : "School";
  document.querySelector(".page-title-add-button-div > p").innerHTML = pageName;
}

function applyMainSectionMargin() {
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  if (header && main) {
    main.style.marginTop = header.offsetHeight + "px";
  }

  // * just putting this function here because this function was called on every page
  let logoutBtn = document.getElementById("header-login-button");
  if (logoutBtn) {
    logoutBtn.onclick = onLogout;
  }
}

function applyQuizQuestionMargin() {
  const header = document.querySelector(".quiz-header-instructions-container");
  const main = document.querySelector(".quiz-questions-container");
  if (header && main) {
    main.style.marginTop = header.offsetHeight + "px";
  }
}

function clear(window, clearFunction = null) {
  window.addEventListener("beforeunload", function () {
    // Just run cleanup code without triggering a prompt
    if (clearFunction) {
      clearFunction();
    } else {
      localStorage.removeItem("gQuizInnerSideNavPageOpened");
    }
  });
}

function onLogout() {
  showToast("Are you sure you want to logout?", () => {
    let currentRole = localStorage.getItem("gquizCurrentUserRole");

    localStorage.removeItem("gquizCurrentUserId");
    localStorage.removeItem("gquizCurrentUserRole");

    navigate((currentRole === "student" ? "./" : "../") + "index.html");
  });
}

function formatDateToReadableString(isoDateStr) {
  const date = new Date(isoDateStr);
  const options = { month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options).replace(",", "");
}

function getTimeSpan(startIso, endIso) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const diffMs = end - start;

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hourStr = hours > 0 ? `${hours}h` : "";
  const minuteStr = minutes > 0 ? `${minutes}m` : "";
  return `${hourStr} ${minuteStr}`.trim();
}

const chartBgColors = [
  "rgba(111, 75, 213, 0.7)",
  "rgba(128, 75, 213, 0.7)",
  "rgba(145, 75, 213, 0.7)",
  "rgba(161, 75, 213, 0.7)",
  "rgba(178, 75, 213, 0.7)",
  "rgba(194, 75, 213, 0.7)",
  "rgba(211, 75, 213, 0.7)",
  "rgba(213, 75, 198, 0.7)",
  "rgba(213, 75, 181, 0.7)",
  "rgba(213, 75, 164, 0.7)",
  "rgba(213, 75, 148, 0.7)",
  "rgba(213, 75, 131, 0.7)",
  "rgba(213, 75, 115, 0.7)",
  "rgba(213, 75, 98, 0.7)",
  "rgba(213, 75, 82, 0.7)",
  "rgba(213, 84, 75, 0.7)",
  "rgba(213, 100, 75, 0.7)",
  "rgba(213, 117, 75, 0.7)",
  "rgba(213, 134, 75, 0.7)",
  "rgba(213, 150, 75, 0.7)",
  "rgba(213, 167, 75, 0.7)",
  "rgba(213, 183, 75, 0.7)",
  "rgba(213, 200, 75, 0.7)",
  "rgba(209, 213, 75, 0.7)",
  "rgba(192, 213, 75, 0.7)",
  "rgba(176, 213, 75, 0.7)",
  "rgba(159, 213, 75, 0.7)",
  "rgba(142, 213, 75, 0.7)",
  "rgba(126, 213, 75, 0.7)",
  "rgba(109, 213, 75, 0.7)",
  "rgba(93, 213, 75, 0.7)",
  "rgba(76, 213, 75, 0.7)",
  "rgba(75, 213, 89, 0.7)",
  "rgba(75, 213, 106, 0.7)",
  "rgba(75, 213, 123, 0.7)",
  "rgba(75, 213, 139, 0.7)",
  "rgba(75, 213, 156, 0.7)",
  "rgba(75, 213, 172, 0.7)",
  "rgba(75, 213, 189, 0.7)",
  "rgba(75, 213, 205, 0.7)",
  "rgba(75, 203, 213, 0.7)",
  "rgba(75, 187, 213, 0.7)",
  "rgba(75, 170, 213, 0.7)",
  "rgba(75, 153, 213, 0.7)",
  "rgba(75, 137, 213, 0.7)",
  "rgba(75, 120, 213, 0.7)",
  "rgba(75, 104, 213, 0.7)",
  "rgba(75, 87, 213, 0.7)",
  "rgba(78, 75, 213, 0.7)",
  "rgba(95, 75, 213, 0.7)",
];
// // * var for pagination!
// let currentPage = 1;

// function generatePagination(
//   totalPages,
//   defaultPage,
//   getFunction,
//   reset = false,
//   resetFunc = null
// ) {
//   if (reset) {
//     currentPage = 1;
//   }

//   if (defaultPage !== null) {
//     currentPage = defaultPage;
//   }

//   const paginationNumbersDiv = document.querySelector(".pagination-numbers");
//   paginationNumbersDiv.innerHTML = ""; // * Clear previous buttons

//   let start = Math.max(1, currentPage - 1);
//   let end = Math.min(totalPages, start + 2);

//   // * Adjust start again if we're at the end
//   if (end - start < 2) {
//     start = Math.max(1, end - 2);
//   }

//   for (let i = start; i <= end; i++) {
//     const paginationButton = document.createElement("button");
//     paginationButton.textContent = i;

//     if (i === currentPage) {
//       paginationButton.classList.add("selected-page");
//     }

//     paginationButton.addEventListener("click", () => {
//       currentPage = i;
//       if (resetFunc) {
//         resetFunc();
//       }
//       getFunction(i);
//       generatePagination(totalPages, currentPage); // * Rerender with new currentPage
//     });

//     paginationNumbersDiv.appendChild(paginationButton);
//   }
// }

// function setupPaginationControls(
//   totalPages,
//   currentPage = 1,
//   generatePagination
// ) {
//   document
//     .querySelectorAll(".pagination-container > .pagination-icons-div")[0]
//     .addEventListener("click", () => {
//       if (currentPage > 1) {
//         currentPage--;
//         generatePagination(totalPages, currentPage);
//       }
//     });

//   document
//     .querySelectorAll(".pagination-container > .pagination-icons-div")[1]
//     .addEventListener("click", () => {
//       if (currentPage < totalPages) {
//         currentPage++;
//         generatePagination(totalPages, currentPage);
//       }
//     });
// }

export {
  navigate,
  applyMainSectionMargin,
  applyQuizQuestionMargin,
  onSideNavButtonsClick,
  onInnerSideNavClick,
  clear,
  chartBgColors,
  formatDateToReadableString,
  getTimeSpan,
  // generatePagination,
  // setupPaginationControls,
};
