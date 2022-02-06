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
    },
    {
      type: "event",
      title: "Pelle trubadu",
      location: "pubelipuben",
      from: "22:00",
      to: "00:00",
      date: "29 mars",
      price: 110,
    },
    {
      type: "event",
      title: "Kajsas Kör",
      location: "Göta Platsen",
      from: "15:00",
      to: "16:00",
      date: "10 april",
      price: 99,
    },
    {
      type: "event",
      title: "Klubben Untz",
      location: "Din favoritkällare",
      from: "22:00",
      to: "du tröttnar",
      date: "17 april",
      price: 150,
    },
  ],
};

// event operations

function saveEvents() {
  database.insert(eventList.events);
}

async function getEvents() {
  const eventItems = await database.find({ type: "event" });
  console.log(eventItems);
  return eventItems;
}

async function getInfoById(idnr) {
  const eventItems = await database.find({ _id: idnr });
  console.log(eventItems);
  return eventItems;
}

async function getInfoByTitle(title) {
  const event = await database.find({ title: title });
  return event;
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
};
