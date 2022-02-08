const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.static("../frontend"));
app.use(express.json());

// linking for db operations
const {
  getEvents,
  saveEvents,
  getInfoById,
  getAccountByUsername,
  saveAccount,
  saveTicketOrder,
  verifyticketNr,
} = require("./databse/operations");

// saving eventList, maybe should change thid so only save if we have not saved before
saveEvents();

// linking to bcrypt
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const { staff } = require("./middleware/auth");

// Generateing a number of letters and numbers
function genereateOrderNr() {
  const letters = ["Z", "Y", "A"];
  const randomLetters = letters[Math.floor(Math.random() * letters.length)];
  const randomNr = Math.floor(Math.random() * 10000);
  console.log(randomLetters);
  console.log(randomNr);
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
  let ticketId = req.query.id;

  const responseObject = {
    success: true,
    ticket: "",
    ordernr: "",
  };

  console.log(`ticketid ${ticketId}`);
  let ticket = await getInfoById(ticketId);

  responseObject.ticket = ticket;
  const ordernr = genereateOrderNr();

  responseObject.ordernr = ordernr;
  console.log(responseObject.ordernr);
  saveTicketOrder(ordernr, ticketId);
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

app.post("/api/verify", async (req, res) => {
  const ticket = req.body;
  console.log(ticket);
  const responseObject = {
    success: false,
    ticket: "",
  };

  verifyticketNr(ticket);

  console.log("----VERIFY----");

  res.json(responseObject);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
