let logoutBtn = document.querySelector("#logoutBtn");
let verifyInput = document.getElementById("verifyInput");
let verifyBtn = document.getElementById("verifyBtn");
let responseMessage = document.getElementById("message");
let responseTicket = document.getElementById("messageTicket");

// check if user is loggedin ifnot redirect

async function isUserLoggedIn() {
  const token = sessionStorage.getItem("token");

  const res = await fetch("http://localhost:3000/api/loggedin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (data.loggedIn == false) {
    window.location.href = "http://localhost:3000/";
  }
}

async function logOut() {
  let res = await fetch("http://localhost:3000/api/logout");

  let data = await res.json();

  if (data.success) {
    sessionStorage.clear();
    window.location.href = "http://localhost:3000/";
  }
}

async function verifyticketNr(ticket) {
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
  message(data);

  if (data.sessionHasExpired === false) {
    if (data.staffRole === false) {
      responseTicket.innerText = `not authorized!`;
    }
  } else if (data.sessionHasExpired === true) {
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
  verifyticketNr(ticketNr);
});

// eventlistner on logoutbtn
logoutBtn.addEventListener("click", () => {
  logOut();
});

isUserLoggedIn();
