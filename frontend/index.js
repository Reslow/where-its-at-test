let eventCon = document.getElementById("eventCon");

// fetch eventlist-data from server
async function getEventList() {
  const res = await fetch("http://localhost:3000/api/eventlist");
  const data = await res.json();
  console.log(data);
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
  console.log("eventitem");
  console.log(eventItem);
}

function createElements(eventCard, eventItem) {
  const eventCardMiddleSection = document.createElement("div");
  eventCardMiddleSection.classList.add("eventCardMiddleSection");
  const eventCardMiddleAndRightSection = document.createElement("div");
  eventCardMiddleAndRightSection.classList.add(
    "eventCardMiddleAndRightSection"
  );
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

  setContent({
    eventItem,
    eventDate,
    eventTitle,
    eventLocation,
    eventFrom,
    eventTo,
    eventPrice,
  });
  eventCardMiddleAndRightSection.append(eventCardMiddleSection, eventPrice);
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
}) {
  eventDate.innerText = `${eventItem.date}`;
  eventTitle.innerText = `${eventItem.title}`;
  eventLocation.innerText = `${eventItem.location}`;
  eventFrom.innerText = `${eventItem.from} -  `;
  eventTo.innerText = ` ${eventItem.to}`;
  eventPrice.innerText = `${eventItem.price} SEK`;
}

function ShowEventList(eventList) {
  console.log("SHOW ARRAY");
  console.log(eventList);
  eventList.forEach((eventItem) => {
    console.log(eventItem);
    createEventCard(eventItem);
  });
}

getEventList();
