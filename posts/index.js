const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post("/events", (request, response) => {
    console.log("Receive event", request.body)
    response.send("Ok")
})

app.post("/posts/create", async (request, response) => {
    const id = randomBytes(4).toString("hex");
    const { title } = request.body;
    posts[id] = {
        id, title
    };

    await axios.post("http://event-bus-srv:4005/events", {
        type: "PostCreated",
        data: { id, title}
    })
    response.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log("v22");
    console.log("Listening on port 4000");
})