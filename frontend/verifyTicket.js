let logoutBtn = document.querySelector("#logoutBtn");
let verifyInput = document.getElementById("verifyInput");
let verifyBtn = document.getElementById("verifyBtn");
let responseMessage = document.getElementById("message");
let responseTicket = document.getElementById("messageTicket");

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
    sessionStorage.clear();
    window.location.href = "http://localhost:3000/";
  }
}

async function verifyticketNr(ticket) {
  console.log(ticket);
  console.log(typeof ticket);
  const token = sessionStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/verify", {
    method: "POST",
    body: JSON.stringify({ ticket }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log(data);
  message(data);

  if (data.sessionHasExpired === false) {
    if (data.staffRole === false) {
      responseTicket.innerText = `not authorized!`;
    }
  } else if (data.sessionHasExpired === true) {
    console.log("session has expired, please log in again!");
    window.location.href = "http://localhost:3000/login.html";
  }
}

function message(ticketResponse) {
  if (ticketResponse.ticketIsValid == true) {
    responseTicket.innerText = ` ${ticketResponse.ticket}`;
    responseMessage.innerText = ` is V A L I D!`;
  } else if (ticketResponse.ticketAlreadyVerified === true) {
    responseTicket.innerText = ` ${ticketResponse.ticket}`;
    responseMessage.innerText = ` is N O T  V A L I D! `;
  } else if (ticketResponse.valueDoesNotExistInDB === true) {
    responseTicket.innerText = ` ${ticketResponse.ticket}`;
    responseMessage.innerText = ` is  N O T  V A L I D!`;
  } else if (ticketResponse.atleastFiveCharacters === true) {
    responseTicket.innerText = ``;
    responseMessage.innerText = `a ticket contains atleast 7 characters!`;
  } else {
    responseTicket.innerText = ``;
    responseMessage.innerText = ``;
  }
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
