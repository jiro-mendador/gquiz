function showToast(type, message, duration = 3000) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);

  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

export default showToast;

// * SAMPLE USAGE
// showToast("success", "Password reset link sent!");
// showToast("error", "Something went wrong. Please try again.");
// showToast("message", "This is a simple message.");
