const express = require("express");
const app = express();
app.use(express.static("../frontend"));
app.use(express.json());

// linking for db operations
const { getEvents, saveEvents, getInfoById } = require("./databse/operations");

// saving eventList, maybe should change thid so only save if we have not saved before

saveEvents();

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
  console.log(ticketId);

  const responseObject = {
    success: true,
    ticket: "",
  };
  let ticket = await getInfoById(ticketId);
  responseObject.ticket = ticket;
  res.json(responseObject);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
