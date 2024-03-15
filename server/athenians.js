const express = require("express");
const http = require("http");
const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const location = [
  {
    events: "Kuku fest",
    location: "Thika",
    date: "12-3-2024",
  },
  {
    events: "Nyama Fests",
    location: "Juja",
    date: "1-2-2024",
  },
  {
    events: "Kuku fest",
    location: "Ruiru",
    date: "12-3-2022",
  },
  {
    events: "Kuku fest",
    location: "Kroad",
    date: "12-3-2022",
  },
  {
    events: "Kuku fest",
    location: "Thika",
    date: "12-3-2022",
  },
  {
    events: "Kuku fest",
    location: "Ruiru",
    date: "12-3-2022",
  },
  {
    events: "Kuku fest",
    location: "Thika",
    date: "12-3-2024",
  },
  {
    events: "Nyama Fests",
    location: "Juja",
    date: "1-2-2024",
  },
  {
    events: "Kuku fest",
    location: "Ruiru",
    date: "12-3-2022",
  },
  {
    events: "Drinks and Link",
    location: "Kroad",
    date: "12-3-2022",
  },
  {
    events: "Nyama choma",
    location: "Thika",
    date: "12-3-2022",
  },
  {
    events: "Pool Party",
    location: "Ruiru",
    date: "12-3-2022",
  },
];

// const api = "52239c6ce3fdd8f46102821a5476e3ad9d752e6fbd09eec32eb5c40775221801";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let locs = [];

location.forEach((loc) => {
  locs.push(loc.location.toLocaleLowerCase());
  return locs;
});

function returnEvents(locationName) {
  const eventsInLocation = location.filter(
    (loc) => loc.location.toLowerCase() === locationName.toLowerCase()
  );
  return eventsInLocation;
}

const events = location.map((event) => {
  return event.event;
});

const eventsCount = events.length;
let eventsList = "";

// Iterate over the events array to create a list
events.forEach((event, index) => {
  // eventsList += `${index + 1}. ${event.name}: ${event.details}\n`;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/ussd", (req, res) => {
  const { text } = req.body;

  let response = "";

  if (text === "") {
    response = `CON Welcome to Mafichoni Baze.
        Where ..............
        Where are You?
        1. Juja
        2. Kroad
        3. Thika
        4. Ruiru
        `;
  } else if (text === "1" || text === "2" || text === "3" || text === "4") {
    const locationIndex = parseInt(text) - 1;
    const locationNames = ["Juja", "Kroad", "Thika", "Ruiru"];
    const selectedLocation = locationNames[locationIndex];
    const events = returnEvents(selectedLocation);
    if (events.length > 0) {
      response = `CON Events in ${selectedLocation}:\n`;
      events.forEach((event, idx) => {
        response += `${idx + 1}. ${event.events} - ${event.date}\n`; // Add 1 to idx for 1-based index
      });
      response += "Reply with the number of the event you want to RSVP to:";
    }
  } else if (
    text.startsWith("1*") ||
    text.startsWith("2*") ||
    text.startsWith("3*") ||
    text.startsWith("4*")
  ) {
    const locationIndex = parseInt(text.charAt(0)) - 1;
    const locationNames = ["Juja", "Kroad", "Thika", "Ruiru"];
    const selectedLocation = locationNames[locationIndex];
    const events = returnEvents(selectedLocation);
    const eventIndex = parseInt(text.slice(2)) - 1; // Extract the event index from user input
    const selectedEvent = events[eventIndex];
    if (selectedEvent) {
      // Handle RSVP logic for the selected event
      response = `END RSVP successful for ${selectedEvent.events} at ${selectedLocation} on ${selectedEvent.date}.`;
    } else {
      response = "END Event not found. Please try again.";
    }
  }


  res.set("Content-Type", "text/plain");
  res.send(response);
});

server.listen(3001, () => {
  console.log("Its alive");
});


