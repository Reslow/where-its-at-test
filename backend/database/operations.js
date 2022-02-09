// ***NEDB setup***
const nedb = require("nedb-promise");
const database = new nedb({ filename: "accounts.db", autoload: true });

// ***List of events***
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
      numberofTickets: 2,
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
      numberofTickets: 3,
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
      numberofTickets: 1,
      tickets: [],
    },
    {
      type: "event",
      title: "Klubben Untz",
      location: "Din favoritkällare",
      from: "22:00",
      to: "du tröttnar",
      date: "17 april",
      price: 150,
      numberofTickets: 3,
      tickets: [],
    },
  ],
};

// ***eventList operations***
// insert list of db is empty
async function saveEvents() {
  const db = await database.find({});
  if (db == 0) database.insert(eventList.events);
}
// returning eventitems in database
async function getEvents() {
  const eventItems = await database.find({ type: "event" });
  return eventItems;
}

// ***event operations***

// returning the event that matches with id
async function getEventById(idnr) {
  const event = await database.find({ _id: idnr });

  return event;
}

// // returning the event that matches with title
// async function getEventByTitle(title) {
//   const event = await database.find({ title: title });

//   return event;
// }

// *** ticket operations***

// saving order

async function saveTicketOrder(ticket, eventid) {
  // console.log(ticket);
  // getting the event based on id
  let event = await getEventById(eventid);
  // How many tickets is there?
  let tickets = event[0].tickets.length;
  // what is the ticket limit?
  let numbers = event[0].numberofTickets;

  // if I have less tickets than the limit, then I update  and  push  in ticketnr (saving ticket)
  if (tickets < numbers) {
    // console.log(eventid);
    await database.update(
      { _id: eventid },
      { $push: { tickets: { ticketid: ticket, verify: false } } }
    );
    // console.log(event[0].tickets);
  } else {
    console.log("no more tickets!");
  }
}

// verify ticketnr
// kolla om det finsn en biljett med biljettnummret, om det finns och ver = true så är den redan kollad och ogiltig,

async function verifyticketNr(ticket) {
  const ticketnr = ticket.ticket;
  // get the right eventobj
  const tickArr = await database.find({ "tickets.ticketid": ticketnr });
  console.log(`arr ${JSON.stringify(tickArr[0])}`);
  // create a responseobj
  const responsObject = {
    aldredyVerified: false,
    verifiednow: false,
    ticketnr: ticketnr,
  };
  console.log(tickArr[0].tickets[0]);
  // if verfied is true or false
  let verified = tickArr[0].tickets[0];
  console.log("CHECK STATION");
  console.log(verified);

  if (verified) {
    if (verified.verify == false) {
      // if false then update to true (true = verified)
      await database.update(
        { "tickets.ticketid": ticketnr },
        { $set: { tickets: [{ ticketid: ticketnr, verify: true }] } }
      );
      responsObject.verifiednow = true;
    } else if (verified.verify == true) {
      console.log("hopp");
      console.log("ticket has been verified");
      responsObject.aldredyVerified = true;
    }
  } else {
    console.log("no verified item");
  }
  return responsObject;
}

// account operations
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
  // getEventByTitle,
  getEventById,
  saveAccount,
  getAccountByUsername,
  saveTicketOrder,
  verifyticketNr,
};
