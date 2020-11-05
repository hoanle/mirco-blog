const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (request, response) => {
  const event = request.body;
  
  events.push(event);

  axios.post("http://posts-clusterip-srv:4000/events", event);
  axios.post("http://comments-srv:4001/events", event);
  axios.post("http://query-srv:4002/events", event);
  axios.post("http://moderation-srv:4003/events", event);
  response.send("OK")
});

app.get("/events", (request, response) => {
  response.send(events);
});

app.listen(4005, () => {
  console.log("Listening on port 4005");
});
