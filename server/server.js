const express = require("express");
const http = require("http");
const app = express();
const bodyParser = require("body-parser");
const server = http.createServer(app);
const AfricasTalking = require("africastalking");
const location = require("./data");


const africastalking = AfricasTalking({
  apiKey: "Enter your Api Key",
  username: "Enter your africastalking username",
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

server.listen(3003, () => {
  console.log("Its alive");
});
