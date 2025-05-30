function navigate(file) {
  // window.location.href = url;
  window.location.replace(file);
}

function onSideNavButtonsClick() {
  const navButtons = document.querySelectorAll("nav > div");
  if (navButtons) {
    navButtons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        // * CHECK IF THE CLICKED NAV HAS CHILDREN INSIDE
        console.log(e.currentTarget.id);
        if (
          e.currentTarget.id &&
          e.currentTarget.id === "side-nav-has-children"
        ) {
          onInnerSideNavClick();
        } else {
          // let page = "dashboard";  // students
          let page = "admin-dashboard"; //admin
          switch (index) {
            case 0:
              // page = "dashboard"; // students
              page = "admin-dashboard"; // admins
              break;
            case 1:
              // page = "upcoming-quiz"; // for students
              page = "users"; // for admins
              break;
            case 2:
              page = "student-response-history"; // students
              // page = "student-response-history"; // admins
              break;
            case 3:
              page = "profile";
              break;
            default:
              // page = "dashboard"; // students
              page = "admin-dashboard"; // admins
          }
          navigate(`./${page}.html`);
        }
      });
    });
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
  innerNavButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      switch (index) {
        case 0:
          page = "year-section";
          navigate(`./${page}.html`);
          break;
        case 1:
          break;
        case 2:
          break;
      }
    });
  });
}

function applyMainSectionMargin() {
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  if (header && main) {
    main.style.marginTop = header.offsetHeight + "px";
  }
}

function applyQuizQuestionMargin() {
  const header = document.querySelector(".quiz-header-instructions-container");
  const main = document.querySelector(".quiz-questions-container");
  if (header && main) {
    main.style.marginTop = header.offsetHeight + "px";
  }
}

export {
  navigate,
  applyMainSectionMargin,
  applyQuizQuestionMargin,
  onSideNavButtonsClick,
};
