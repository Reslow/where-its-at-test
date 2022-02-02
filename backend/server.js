const express = require("express");
const app = express();

app.use(express.static("../frontend"));
app.use(express.json());

const { getEvent, saveEvent } = require("./operations/operations");

saveEvent();

app.get("/api/eventlist", async (req, res) => {
  const responseObject = {
    success: true,
    event: "",
  };
  let event = await getEvent();
  console.log(event);

  responseObject.event = event[0];
  console.log(responseObject);

  res.json(responseObject);
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
