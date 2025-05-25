function showToast(
  message,
  proceedFunc = null,
  cancelFunc = null,
  duration = 4000
) {
  const container = document.getElementById("toast-container");
  const messageTag = document.getElementById("message");
  const oldCancelButton = document.getElementById("cancelButton");
  const oldProceedButton = document.getElementById("proceedButton");

  // * Clone buttons to remove previous event listeners
  const cancelButton = oldCancelButton.cloneNode(true);
  const proceedButton = oldProceedButton.cloneNode(true);
  oldCancelButton.replaceWith(cancelButton);
  oldProceedButton.replaceWith(proceedButton);

  // * Reset message and buttons
  messageTag.innerHTML = message;
  cancelButton.style.display = "block";
  proceedButton.style.display = "none";
  proceedButton.innerHTML = "Proceed";
  cancelButton.innerHTML = "Cancel";

  // * Show container
  container.style.display = "flex";

  // * Add close behavior with timeout handling
  const timeoutId = setTimeout(
    // * only auto close if both of the function are not set
    () => {
      if (!proceedFunc) {
        closeToast();
      }
    },
    typeof duration === "number" && duration > 0 ? duration : 4000
  );

  function closeToast() {
    container.style.display = "none";
    clearTimeout(timeoutId);
  }

  // * Show and bind cancel button if needed
  if (cancelFunc) {
    cancelButton.style.display = "block";
    cancelButton.addEventListener("click", () => {
      cancelFunc();
      closeToast();
    });
  }

  // * Show and bind proceed button if needed
  if (proceedFunc) {
    proceedButton.style.display = "block";
    proceedButton.addEventListener("click", () => {
      proceedFunc();
      closeToast();
    });
  }

  // * If no custom functions provided, show single "OK" button
  if (!cancelFunc && !proceedFunc) {
    cancelButton.innerHTML = "Okay";
  }
  cancelButton.addEventListener("click", closeToast);
}

export default showToast;

// * SAMPLE USAGE
// showToast("Password reset link sent!");
// showToast("Something went wrong. Please try again.");
// showToast("This is a simple message.");
