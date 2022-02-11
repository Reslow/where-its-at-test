let eventCon = document.getElementById("eventCon");

// fetch eventlist-data from server
async function getEventList() {
  const res = await fetch("http://localhost:3000/api/eventlist");
  const data = await res.json();
  // console.log(data);
  ShowEventList(data.event);
}

// fetch eventlist-data from server
function createEventCard(eventItem) {
  const eventCard = document.createElement("a");
  eventCard.classList.add("eventCard");
  eventCard.setAttribute(
    "href",
    `http://localhost:3000/myticket.html?id=${eventItem._id}`
  );

  eventCon.appendChild(eventCard);
  createElements(eventCard, eventItem);
  if (eventItem.numberofTickets - eventItem.tickets.length < 1) {
    eventCard.classList.add("disable");
  }
}

function createElements(eventCard, eventItem) {
  const eventCardMiddleSection = document.createElement("div");
  eventCardMiddleSection.classList.add("eventCardMiddleSection");
  const eventCardMiddleAndRightSection = document.createElement("div");
  eventCardMiddleAndRightSection.classList.add(
    "eventCardMiddleAndRightSection"
  );
  const eventCardRightSection = document.createElement("div");
  eventCardRightSection.classList.add("rightSection");
  const eventCardTimeSection = document.createElement("div");
  eventCardTimeSection.classList.add("eventCardTimeSection");
  const eventDate = document.createElement("p");
  eventDate.classList.add("eventDate");
  const eventTitle = document.createElement("p");
  eventTitle.classList.add("eventTitle");
  const eventLocation = document.createElement("p");
  eventLocation.classList.add("eventLocation");
  const eventFrom = document.createElement("p");
  eventFrom.classList.add("eventFrom");
  const eventTo = document.createElement("p");
  eventTo.classList.add("eventTo");
  const eventPrice = document.createElement("p");
  eventPrice.classList.add("eventPrice");
  const eventCount = document.createElement("p");
  eventCount.classList.add("count");

  setContent({
    eventItem,
    eventDate,
    eventTitle,
    eventLocation,
    eventFrom,
    eventTo,
    eventPrice,
    eventCount,
  });
  eventCardRightSection.append(eventCount, eventPrice);
  eventCardMiddleAndRightSection.append(
    eventCardMiddleSection,
    eventCardRightSection
  );
  eventCardTimeSection.append(eventFrom, eventTo);
  eventCardMiddleSection.append(
    eventTitle,
    eventLocation,
    eventCardTimeSection
  );
  eventCard.append(eventDate, eventCardMiddleAndRightSection);
}

function setContent({
  eventItem,
  eventTitle,
  eventLocation,
  eventFrom,
  eventTo,
  eventPrice,
  eventDate,
  eventCount,
}) {
  let count = eventItem.numberofTickets - eventItem.tickets.length;
  eventDate.innerText = `${eventItem.date}`;
  eventTitle.innerText = `${eventItem.title}`;
  eventLocation.innerText = `${eventItem.location}`;
  eventFrom.innerText = `${eventItem.from} -  `;
  eventTo.innerText = ` ${eventItem.to}`;
  eventPrice.innerText = `${eventItem.price}:-`;
  eventCount.innerText = `${count} st`;
}

function ShowEventList(eventList) {
  eventList.forEach((eventItem) => {
    createEventCard(eventItem);
  });
}

getEventList();
