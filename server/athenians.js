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
      events.forEach((event) => {
        response += `${event.events} - ${event.date}\n`;
      });
    }
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

server.listen(3001, () => {
  console.log("Its alive");
});


