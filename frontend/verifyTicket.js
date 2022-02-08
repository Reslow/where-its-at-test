let logoutBtn = document.querySelector("#logoutBtn");
let verifyInput = document.getElementById("verifyInput");
let verifyBtn = document.getElementById("verifyBtn");

// check if user is loggedin ifnot redirect

async function isUserLoggedIn() {
  console.log("--IS USER LOGGEDIN--");
  const token = sessionStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/loggedin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log("DATA from LOGGEDIN");
  console.log(data);

  if (data.loggedIn == false) {
    window.location.href = "http://localhost:3000/";
  }
}

async function logOut() {
  let res = await fetch("http://localhost:3000/api/logout");

  let data = await res.json();
  console.log(data);

  if (data.success) {
    window.location.href = "http://localhost:3000/";
  }
}

async function verifyticketNr(ticket) {
  console.log(ticket);
  console.log(typeof ticket);

  const res = await fetch("http://localhost:3000/api/verify", {
    method: "POST",
    body: JSON.stringify({ ticket }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data.ticket);
  console.log(data);
}

verifyBtn.addEventListener("click", () => {
  const ticketNr = verifyInput.value;
  console.log(ticketNr);
  verifyticketNr(ticketNr);
});

// eventlistner on logoutbtn
logoutBtn.addEventListener("click", () => {
  logOut();
});

isUserLoggedIn();
