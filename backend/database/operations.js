const nedb = require("nedb-promise");
// ***NEDB setup***
const database = new nedb({ filename: "accounts.db", autoload: true });

// ***List of events with info***
const eventList = {
  type: "event",
  events: [
    {
      type: "event",
      title: "Lasse-Stefanz",
      location: "Kjell Härnqvistsalen",
      from: "19:00 ",
      to: "21:00",
      date: "21 mars",
      price: 350,
      numberofTickets: 5,
      tickets: [],
    },
    {
      type: "event",
      title: "Pelle trubadu",
      location: "pubelipuben",
      from: "22:00",
      to: "00:00",
      date: "29 mars",
      price: 110,
      numberofTickets: 10,
      tickets: [],
    },
    {
      type: "event",
      title: "Kajsas Kör",
      location: "Göta Platsen",
      from: "15:00",
      to: "16:00",
      date: "10 april",
      price: 99,
      numberofTickets: 8,
      tickets: [],
    },
    {
      type: "event",
      title: "Klubben Untz",
      location: "Din favoritkällare",
      from: "22:00",
      to: "sent",
      date: "17 april",
      price: 150,
      numberofTickets: 10,
      tickets: [],
    },
  ],
};

// ***eventList operations***

// insert list if db is empty when starting server
async function saveEvents() {
  const db = await database.find({});
  if (db == 0) database.insert(eventList.events);
}

// returning eventitems from database
async function getEvents() {
  const eventItems = await database.find({ type: "event" });
  return eventItems;
}

// ***event operations***

// returning the event that matches id
async function getEventById(idnr) {
  const event = await database.find({ _id: idnr });

  return event;
}

// ***ticket operations***

// saving ticket when order is made(clicked on event)
async function saveTicketOrder(ticketnr, eventid) {
  // getting the event based on id
  let event = await getEventById(eventid);
  // How many tickets is there?
  let tickets = event[0].tickets.length;
  // what is the ticket limit?
  let numbers = event[0].numberofTickets;
  const responsObject = {
    count: numbers - tickets,
    empty: false,
  };

  // if there is less tickets than the limit, I update  and  push  in ticketnr (saving ticket)
  if (tickets < numbers) {
    await database.update(
      { _id: eventid },
      { $push: { tickets: { ticketnr: ticketnr, verify: false } } }
    );
  } else {
    responsObject.empty = true;
  }
  return responsObject;
}

// check if there is a ticket with nr and if so then update verify to true, if true the ticket is already checked & verified
async function verifyticketNr(ticket) {
  // ticketnr => input the staff has written
  const ticketnr = ticket.ticket;
  const tickObj = await database.find({ "tickets.ticketnr": ticketnr });

  const responsObject = {
    alreadyVerified: false,
    verifiednow: false,
    ticketnr: ticketnr,
    valueDoesNotExistInTheDB: false,
  };

  if (tickObj[0] == null) {
    responsObject.valueDoesNotExistInTheDB = true;
  } else {
    let verifiedAsArr = tickObj[0].tickets;
    verifiedAsArr.forEach((element) => {
      if (element.ticketnr === ticketnr) {
        if (element.verify === false) {
          updateTickets(ticketnr);
          responsObject.verifiednow = true;
        } else {
          responsObject.alreadyVerified = true;
        }
      } else {
        responsObject.valueDoesNotExistInTheDB = true;
      }
    });
  }
  return responsObject;
}

async function updateTickets(ticketnr) {
  await database.update(
    { "tickets.ticketnr": ticketnr },
    { $set: { tickets: [{ ticketnr: ticketnr, verify: true }] } }
  );
}

//***account operations**
function saveAccount(account) {
  database.insert(account);
}

async function getAccountByUsername(username) {
  const account = await database.find({ username: username });
  return account;
}

module.exports = {
  saveEvents,
  getEvents,
  getEventById,
  saveAccount,
  getAccountByUsername,
  saveTicketOrder,
  verifyticketNr,
};
