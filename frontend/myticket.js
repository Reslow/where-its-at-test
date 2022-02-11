// get dom-elements
const what = document.getElementById("whatElement");
const where = document.getElementById("whereElement");
const when = document.getElementById("whenElement");
const from = document.getElementById("fromElement");
const to = document.getElementById("toElement");
const ticket = document.getElementById("ticketId");

function setContentToElements(info) {
  what.innerText = info[0].title;
  where.innerText = info[0].location;
  when.innerText = info[0].date;
  from.innerText = info[0].from;
  to.innerText = info[0].to;
}
// ticket Id sent through url. This we can check with database to get the right object with content.

function getTicketIdFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const ticketId = urlParams.get("id");
  getEventInfo(ticketId);
}

// send get request to server to get the whole object of ticketinfo
async function getEventInfo(ticketId) {
  const res = await fetch(`http://localhost:3000/api/getticket?id=${ticketId}`);
  let data = await res.json();
  setContentToElements(data.ticket);
  ticket.innerText = data.ticketnr;
}

getTicketIdFromUrl();
