function navigate(file) {
  // window.location.href = url;
  window.location.replace(file);
}

function onSideNavButtonsClick() {
  const navButtons = document.querySelectorAll("nav > div");
  if (navButtons) {
    navButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        let page = "dashboard";
        switch (index) {
          case 0:
            page = "dashboard";
            break;
          case 1:
            page = "upcoming-quiz";
            break;
          case 2:
            page = "student-response-history";
            break;
          case 3:
            page = "profile";
            break;
          default:
            page = "dashboard";
        }
        navigate(`./${page}.html`);
      });
    });
  }
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
