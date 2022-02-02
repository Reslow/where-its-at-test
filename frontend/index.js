let section = document.getElementById("eventSection");

async function getEventList() {
  const res = await fetch("http://localhost:3000/api/eventlist");
  const data = await res.json();

  ShowEventList(data.event.eventItems);
  console.log(data.event.eventItems);
}

function ShowEventList(eventList) {
  console.log(eventList);
  eventList.forEach((eventItem) => {
    const date = document.createElement("p");
    const title = document.createElement("p");
    const locationE = document.createElement("p");
    const time = document.createElement("p");
    const price = document.createElement("p");
    date.innerText = `${eventItem.date}`;
    title.innerText = `${eventItem.title}`;
    locationE.innerText = `${eventItem.location}`;
    time.innerText = `${eventItem.time}`;
    price.innerText = `${eventItem.price}`;
    section.append(date, title, locationE, time, price);
  });
}

getEventList();
