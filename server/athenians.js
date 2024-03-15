const express = require("express");
const http = require("http");
const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const AfricasTalking = require("africastalking");
const location = [
  {
    events: "Kuku fest",
    location: "Thika",
    date: "12-3-2024",
  },
  {
    events: "Nyama Fests",
    location: "Juja",
    date: "5-6-2024",
  },
  {
    events: "Pork fest",
    location: "Ruiru",
    date: "8-3-2024",
  },
  {
    events: "Pizza fest",
    location: "Kroad",
    date: "2-5-2024",
  },
  {
    events: "Pool Party",
    location: "Thika",
    date: "6-3-2024",
  },
  {
    events: "Fashion show",
    location: "Ruiru",
    date: "2-3-2024",
  },
  {
    events: "Soul Fest",
    location: "Thika",
    date: "2-10-2024",
  },
  {
    events: "Subaru Fest",
    location: "Juja",
    date: "8-8-2024",
  },
  {
    events: "Meet and greet",
    location: "Ruiru",
    date: "1-12-2024",
  },
  {
    events: "Drinks and Link",
    location: "Kroad",
    date: "2-3-2024",
  },
  {
    events: "Africas talking hackathon",
    location: "Thika",
    date: "2-8-2024",
  },
  {
    events: "Burudani fest",
    location: "Ruiru",
    date: "12-12-2024",
  },
];

// const api = "52239c6ce3fdd8f46102821a5476e3ad9d752e6fbd09eec32eb5c40775221801";

const africastalking = AfricasTalking({
  apiKey: "acfa4414e9556bcb746a27e8c753e54c67c2ae8e7e90d3414649739fdea6de76",
  username: "sandbox",
});

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/ussd", (req, res) => {
  const { text, phoneNumber } = req.body;

  let response = "";

  if (text === "") {
    response = `CON Welcome to Mafichoni Baze.
        Your gateway to descovering the best events and restaurants in your area!

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
        response += `${idx + 1}. ${event.events} on ${event.date}\n`; // Add 1 to idx for 1-based index
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
      async function RSVP() {
        try {
          await africastalking.SMS.send({
            to: phoneNumber,
            message: `RSVP successful for ${selectedEvent.events} at ${selectedLocation} on ${selectedEvent.date}.`,
            from: "54323",
          });
        } catch (err) {
          console.log(err);
        }
      }
      RSVP();
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
