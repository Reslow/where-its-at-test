const nedb = require("nedb-promise");
const database = new nedb({ filename: "accounts.db", autoload: true });

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

// ***event operations***
async function saveEvents() {
  const db = await database.find({});
  if (db == 0) database.insert(eventList.events);
}

async function getEvents() {
  const eventItems = await database.find({ type: "event" });
  return eventItems;
}

async function getInfoById(idnr) {
  const eventItems = await database.find({ _id: idnr });

  return eventItems;
}

async function getInfoByTitle(title) {
  const event = await database.find({ title: title });

  return event;
}

async function saveTicketOrder(ticket, eventid) {
  console.log(ticket);
  let event = await getInfoById(eventid);
  let tickets = event[0].tickets.length;
  let numbers = event[0].numberofTickets;

  if (tickets < numbers) {
    console.log(eventid);
    let a = await database.update(
      { _id: eventid },
      { $push: { tickets: { ticketid: ticket, verify: false } } }
    );
    console.log(event[0].tickets);
    console.log(a);
  } else {
    console.log("no more tickets!");
  }
}

// kolla om det finsn en biljett med biljettnummret, om det finns och ver = true så är den redan kollad och ogiltig,

async function verifyticketNr(ticket) {
  const num = ticket.ticket;
  const tickArr = await database.find({ "tickets.ticketid": num });
  console.log(`arr ${JSON.stringify(tickArr[0])}`);
  // console.log(tickArr[0].tickets.verify);

  if (tickArr[0].tickets.verify === false) {
    await database.update(
      { "tickets.ticketid": num },
      { $set: { tickets: { ticketid: num, verify: true } } }
    );
  } else if (tickArr[0].tickets.verify === true) {
    console.log("ticket has been verified");
  }
  return tickArr;
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
  getInfoByTitle,
  getInfoById,
  saveAccount,
  getAccountByUsername,
  saveTicketOrder,
  verifyticketNr,
};
