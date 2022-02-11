// conencting to login/signup elements
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const signupUsername = document.getElementById("signupUsername");
const signupPassword = document.getElementById("signupPassword");
const ToCreateAccountBtn = document.getElementById("TocreateAccount");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const signupCon = document.getElementById("signup");
const loginCon = document.getElementById("login");
const displayMsg = document.getElementById("message");

// saveToken in sessionstorage
function saveToken(token) {
  sessionStorage.setItem("token", token);
}

// post credentials to server  to check account in db and redirect  to verify/ticket
async function login(credentials) {
  const res = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.success) {
    saveToken(data.token);
    window.location.href = "http://localhost:3000/verifyticket.html";
  }
}

// post credentials to server  to save account
async function signup(credentials) {
  const res = await fetch("http://localhost:3000/api/createaccount", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
}

// toggle login and create account
ToCreateAccountBtn.addEventListener("click", () => {
  loginCon.classList.toggle("hide");
  signupCon.classList.toggle("show");

  if (ToCreateAccountBtn.value == "Login") {
    ToCreateAccountBtn.value = "Create Account";
  } else {
    ToCreateAccountBtn.value = "Login";
  }
});

signupBtn.addEventListener("click", () => {
  const credentials = {
    username: "",
    password: "",
  };
  credentials.username = signupUsername.value;
  credentials.password = signupPassword.value;
  signup(credentials);
});

loginBtn.addEventListener("click", () => {
  const credentials = {
    username: "",
    password: "",
  };
  credentials.username = loginUsername.value;
  credentials.password = loginPassword.value;
  login(credentials);
});
