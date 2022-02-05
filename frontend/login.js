// toggle login and create account
const ToCreateAccountBtn = document.getElementById("TocreateAccount");
const signupCon = document.getElementById("signup");
const loginCon = document.getElementById("login");

ToCreateAccountBtn.addEventListener("click", () => {
  loginCon.classList.toggle("hide");
  signupCon.classList.toggle("show");

  if (ToCreateAccountBtn.value == "Login") {
    console.log(ToCreateAccountBtn.value);
    ToCreateAccountBtn.value = "Create Account";
  } else {
    ToCreateAccountBtn.value = "Login";
  }
});
