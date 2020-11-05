const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (request, response) => {
  const { type, data } = request.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "aprroved";

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status: status,
        content: data.content,
      },
    });
  }

  response.send({});
});

app.listen(4003, () => {
  console.log("Listening on port 4003");
});
