// * CHECK IF THE USER IS STILL LOGGED IN
const CURRENT_USER = localStorage.getItem("gquizCurrentUserId");
if (CURRENT_USER === null && CURRENT_USER === undefined) {
  navigate("./index.html");
}