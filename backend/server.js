const express = require("express");
const app = express();

app.use(express.static("../frontend"));
app.use(express.json());

const {
  getEvent,
  saveEvent,
  getAccountByTitle,
} = require("./operations/operations");

saveEvent();

app.get("/api/eventlist", async (req, res) => {
  const responseObject = {
    success: true,
    event: "",
  };
  let event = await getEvent();

  responseObject.event = event[0];

  res.json(responseObject);
});

app.post("/api/getTicket", async (req, res) => {
  console.log("API/getTicket");
  // kolla i databasen om biljett finns kvar
  let ticketInformation = req.body;
  const responseObject = {
    success: false,
    ticket: "",
  };
  console.log(ticketInformation.title);
  let ticket = await getAccountByTitle(ticketInformation.title);
  console.log(ticket);

  responseObject.ticket = ticket;

  res.json(responseObject);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
