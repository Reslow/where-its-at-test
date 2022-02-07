// get dom-elements
const what = document.getElementById("whatElement");
const where = document.getElementById("whereElement");
const when = document.getElementById("whenElement");
const from = document.getElementById("fromElement");
const to = document.getElementById("toElement");
const ticketId = document.getElementById("ticketId");

function setContentToElements(info) {
  what.innerText = info[0].title;
  where.innerText = info[0].location;
  when.innerText = info[0].date;
  from.innerText = info[0].from;
  to.innerText = info[0].to;
  ticketId.innerText = info[0]._id;
}
// ticket Id sent through url. This we can check with database to get the right object with content.

function getTicketIdFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const ticketId = urlParams.get("id");
  console.log(`id =: ` + ticketId);
  console.log(ticketId);
  getEventInfo(ticketId);
}

// send get request to server to get the whole object of ticketinfo
async function getEventInfo(ticketId) {
  console.log(ticketId);
  const res = await fetch(`http://localhost:3000/api/getticket?id=${ticketId}`);
  let data = await res.json();
  console.log(data.ticket);
  setContentToElements(data.ticket);
}

getTicketIdFromUrl();
