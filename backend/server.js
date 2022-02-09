const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.static("../frontend"));
app.use(express.json());

// linking for db operations
const {
  getEvents,
  saveEvents,
  getEventById,
  getAccountByUsername,
  saveAccount,
  saveTicketOrder,
  verifyticketNr,
} = require("./database/operations");

// saving eventList when starting the server!
saveEvents();

// linking to bcrypt and middleware for checking role
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const { staff } = require("./middleware/auth");

// Generateing a number of letters and numbers
function genereateTicketNr() {
  const letters = ["Z", "Y", "A"];
  const randomLetters = letters[Math.floor(Math.random() * letters.length)];
  const randomNr = Math.floor(Math.random() * 10000);
  return `WIA${randomNr}${randomLetters}`;
}

//  looking for events thats is saved
app.get("/api/eventlist", async (req, res) => {
  const responseObject = {
    success: true,
    event: "",
  };

  let event = await getEvents();
  responseObject.event = event;
  res.json(responseObject);
});

// get the ticketinformation taht matches the info
app.get("/api/getticket", async (req, res) => {
  console.log("API/getTicket");
  // hämta id
  let ticketId = req.query.id;

  const responseObject = {
    success: true,
    ticket: "",
    ticketnr: "",
  };

  console.log(`ticketid ${ticketId}`);
  // hämta eventet som matchar id:et
  let ticket = await getEventById(ticketId);

  responseObject.ticket = ticket;
  // kalla på generateTicket som ger mig ett order/ticketnr
  const ticketnr = genereateTicketNr();

  responseObject.ticketnr = ticketnr;
  // console.log(responseObject.ticketnr);
  // spara ner ordern med ticketnr och id på eventet
  saveTicketOrder(ticketnr, ticketId);

  res.json(responseObject);
});

// get signupCredentials, check db ,  add to db and send response
app.post("/api/createaccount", async (req, res) => {
  const credentials = req.body;

  const responseObject = {
    success: true,
    usernameExist: false,
  };
  //  finns username?
  const usernameExist = await getAccountByUsername(credentials.username);

  if (usernameExist.length > 0) {
    responseObject.success = false;
    responseObject.usernameExist = true;
  }
  //  om användaren inte finns tilldelas roll, vi hashar lösenordet och sparar
  if (responseObject.usernameExist == false) {
    if (credentials.username == "user") {
      credentials.role = "user";
    } else {
      credentials.role = "staff";
    }
    const hashedPassword = await hashPassword(credentials.password);
    credentials.password = hashedPassword;
    saveAccount(credentials);
  }
  res.json(responseObject);
});

app.post("/api/login", async (req, res) => {
  const credentials = req.body;

  const responseObject = {
    success: false,
    token: "",
    msg: "",
  };
  const account = await getAccountByUsername(credentials.username);
  // console.log(account);
  if (account.length > 0) {
    const isCorrectPassword = await comparePassword(
      credentials.password,
      account[0].password
    );
    if (isCorrectPassword) {
      responseObject.success = true;
      // token krypterad med användarnamn (kopplat till användaren)
      const token = jwt.sign({ username: account[0].username }, "a1b2c3", {
        expiresIn: 60,
      });

      responseObject.token = token;
    }
  }
  res.json(responseObject);
});

app.get("/api/loggedin", async (req, res) => {
  console.log("--LOGGEDIN SEVRER");
  const token = req.headers.authorization.replace("Bearer ", "");

  const responseObject = {
    loggedIn: false,
  };

  try {
    const data = jwt.verify(token, "a1b2c3");

    if (data) {
      responseObject.loggedIn = true;
    }
  } catch (error) {
    responseObject.message = "token has expired";
  }
  res.json(responseObject);
});

app.get("/api/logout", (req, res) => {
  console.log("--/API/LOGOUT--");
  res.clearCookie("loggedIn");

  let responseObject = {
    success: "true",
  };
  res.json(responseObject);
});

app.post("/api/verify", staff, async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log(`token ${token}`);

  const ticket = req.body;
  console.log(ticket);
  const responseObject = {
    ticket: "",
    ticketIsVAlid: "",
    ticketAlreadyVerified: "",
    loggedIn: false,
    nothingToVerify: false,
  };

  try {
    const data = jwt.verify(token, "a1b2c3");
    console.log(`data ${JSON.stringify(data)}`);

    if (data) {
      responseObject.loggedIn = true;
    }
  } catch (error) {
    responseObject.message = "token has expired";
  }

  const answer = await verifyticketNr(ticket);
  responseObject.nothingToVerify = answer.nothingToVerify;
  responseObject.ticketIsVAlid = answer.verifiednow;
  responseObject.ticketAlreadyVerified = answer.aldredyVerified;
  responseObject.ticket = answer.ticketnr;

  res.json(responseObject);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
