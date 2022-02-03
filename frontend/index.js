let eventCon = document.getElementById("eventCon");

// fetch eventlist-data from server
async function getEventList() {
  const res = await fetch("http://localhost:3000/api/eventlist");
  const data = await res.json();
  ShowEventList(data.event.events);
}

// fetch eventlist-data from server
function createEventCard(eventItem) {
  const eventCard = document.createElement("div");
  eventCard.classList.add("eventCard");
  eventCon.appendChild(eventCard);
  console.log("C C");
  createElements(eventCard, eventItem);
  eventCard.addEventListener("click", () => {
    alert("hello");
  });
}

function createElements(eventCard, eventItem) {
  const eventCardMiddleSection = document.createElement("div");
  eventCardMiddleSection.classList.add("eventCardMiddleSection");
  const eventCardMiddleAndRightSection = document.createElement("div");
  eventCardMiddleAndRightSection.classList.add(
    "eventCardMiddleAndRightSection"
  );
  const eventDate = document.createElement("p");
  eventDate.classList.add("eventDate");
  const eventTitle = document.createElement("p");
  eventTitle.classList.add("eventTitle");
  const eventLocation = document.createElement("p");
  eventLocation.classList.add("eventLocation");
  const eventTime = document.createElement("p");
  eventTime.classList.add("eventTime");
  const eventPrice = document.createElement("p");
  eventPrice.classList.add("eventPrice");
  console.log("C E");
  setContent(
    eventItem,
    eventDate,
    eventTitle,
    eventLocation,
    eventTime,
    eventPrice
  );
  eventCardMiddleAndRightSection.append(eventCardMiddleSection, eventPrice);
  eventCardMiddleSection.append(eventTitle, eventLocation, eventTime);
  eventCard.append(eventDate, eventCardMiddleAndRightSection);
}

function setContent(
  eventItem,
  eventDate,
  eventTitle,
  eventLocation,
  eventTime,
  eventPrice
) {
  eventDate.innerText = `${eventItem.date}`;
  eventTitle.innerText = `${eventItem.title}`;
  eventLocation.innerText = `${eventItem.location}`;
  eventTime.innerText = `${eventItem.time}`;
  eventPrice.innerText = `${eventItem.price} :-`;
}

function ShowEventList(eventList) {
  eventList.forEach((eventItem) => {
    createEventCard(eventItem);
  });
}

getEventList();
