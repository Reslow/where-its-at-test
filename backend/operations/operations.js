const nedb = require("nedb-promise");
const database = new nedb({ filename: "accounts.db", autoload: true });

const eventList = {
  type: "events",
  events: [
    {
      title: "Lasse-Stefanz",
      location: "Kjell Härnqvistsalen",
      time: "19:00 - 21:00",
      date: "21032022",
      price: 350,
    },
    {
      id: 2,
      title: "Pelle trubadu",
      location: "pubelipuben",
      time: "22:00 - 00:00",
      date: "29032022",
      price: 110,
    },
    {
      id: 3,
      title: "Kajsas Kör",
      location: "Göta Platsen",
      time: "15:00 - 16:00",
      date: "10042022",
      price: 99,
    },
    {
      id: 4,
      title: "Klubben Untz",
      location: "Din favoritkällare",
      time: "22:00 - du tröttnar",
      date: "17042022",
      price: 150,
    },
  ],
};

function saveEvent() {
  database.insert(eventList);
}

async function getEvent() {
  const eventItems = await database.find({ type: "events" });
  return eventItems;
}

module.exports = { saveEvent, getEvent };
