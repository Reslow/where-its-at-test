const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.static("../frontend"));
app.use(express.json());

// links for db operations
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

// links to bcrypt and middleware for checking role
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const { staff } = require("./middleware/auth");

// Generating a ticketnumber of letters and numbers
function genereateTicketNr() {
  const letters = ["Z", "Y", "A"];
  const randomLetters = letters[Math.floor(Math.random() * letters.length)];
  const randomNr = Math.floor(Math.random() * 10000);
  return `WIA${randomNr}${randomLetters}`;
}

//  looking for events in db and send it back to frontend
app.get("/api/eventlist", async (req, res) => {
  const responseObject = {
    success: true,
    event: "",
  };
  let event = await getEvents();
  responseObject.event = event;
  res.json(responseObject);
});

// get the ticketinformation that matches the id
app.get("/api/getticket", async (req, res) => {
  // hämta id
  let ticketId = req.query.id;

  const responseObject = {
    success: true,
    ticket: "",
    ticketnr: "",
    count: "",
  };

  let ticket = await getEventById(ticketId);

  responseObject.ticket = ticket;

  const ticketnr = genereateTicketNr();

  responseObject.ticketnr = ticketnr;
  // save order with nr and eventid, and get back response that says if event is full (empty === true)
  let ticketsLeft = await saveTicketOrder(ticketnr, ticketId);
  responseObject.count = ticketsLeft;
  res.json(responseObject);
});

// get signupCredentials, check db ,  add to db and send response
app.post("/api/createaccount", async (req, res) => {
  const credentials = req.body;

  const responseObject = {
    success: true,
    usernameExist: false,
  };

  const usernameExist = await getAccountByUsername(credentials.username);

  if (usernameExist.length > 0) {
    responseObject.success = false;
    responseObject.usernameExist = true;
  }

  // if user does not exist, we give it a role, hash pwd and save to db
  //  for testing I only give users with username 'users' the role : user
  if (responseObject.usernameExist == false) {
    if (credentials.username == "user") {
      credentials.role = "user";
    } else {
      credentials.role = "staff";
    }
    // hash password
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
  };
  const account = await getAccountByUsername(credentials.username);

  if (account.length > 0) {
    const isCorrectPassword = await comparePassword(
      credentials.password,
      account[0].password
    );
    if (isCorrectPassword) {
      responseObject.success = true;
      //  token is signed with username and expires in 10 min
      const token = jwt.sign({ username: account[0].username }, "a1b2c3", {
        expiresIn: 600,
      });

      responseObject.token = token;
    }
  }
  res.json(responseObject);
});

app.get("/api/loggedin", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  const responseObject = {
    loggedIn: false,
  };
  // verify token and if true  = assign loggedin => true

  try {
    const data = jwt.verify(token, "a1b2c3");

    if (data) {
      responseObject.loggedIn = true;
    }
  } catch (error) {
    responseObject.message = "token is invalid";
  }
  res.json(responseObject);
});

app.get("/api/logout", (req, res) => {
  let responseObject = {
    success: "true",
  };

  res.json(responseObject);
});

app.post("/api/verify", staff, async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  const ticket = req.body;
  const responseObject = {
    ticket: "",
    ticketIsValid: "",
    ticketAlreadyVerified: "",
    valueDoesNotExistInDB: false,
    atleastFiveCharacters: false,
  };

  if (ticket.ticket.length < 7) {
    responseObject.atleastFiveCharacters = true;
  } else {
    const ticketResponse = await verifyticketNr(ticket);

    responseObject.valueDoesNotExistInDB =
      ticketResponse.valueDoesNotExistInTheDB;
    responseObject.ticketIsValid = ticketResponse.verifiednow;
    responseObject.ticketAlreadyVerified = ticketResponse.alreadyVerified;
    responseObject.ticket = ticketResponse.ticketnr;
  }
  res.json(responseObject);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
