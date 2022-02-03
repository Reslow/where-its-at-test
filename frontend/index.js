let eventCon = document.getElementById("eventCon");

// fetch eventlist-data from server
async function getEventList() {
  const res = await fetch("http://localhost:3000/api/eventlist");
  const data = await res.json();

  console.log(data.event);
  ShowEventList(data.event.events);
}

// create elements for event List and set content to element
function ShowEventList(eventList) {
  eventList.forEach((eventItem) => {
    const eventCard = document.createElement("div");
    eventCard.classList.add("eventCard");

    const eventCardMiddleSection = document.createElement("div");

    eventCardMiddleSection.classList.add("eventCardMiddleSection");

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

    eventDate.innerText = `${eventItem.date}`;
    eventTitle.innerText = `${eventItem.title}`;
    eventLocation.innerText = `${eventItem.location}`;
    eventTime.innerText = `${eventItem.time}`;
    eventPrice.innerText = `${eventItem.price}`;

    eventCardMiddleSection.append(eventTitle, eventLocation, eventTime);
    eventCard.append(eventDate, eventCardMiddleSection, eventPrice);
    eventCon.appendChild(eventCard);
  });
}

getEventList();
