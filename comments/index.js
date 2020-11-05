const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsbyPostId = {};

app.post("/events", async (request, response) => {
  const { type, data } = request.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    console.log(data)
    console.log(commentsbyPostId)
    const comments = commentsbyPostId[postId];
    console.log(comments)
    const comment = comments.find(it => {
      console.log(it)
      return it.id === id;
    });
    console.log(comment)
    comment.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  response.send("Ok");
});

app.get("/posts/:id/comments", (request, response) => {
  const id = request.params.id;
  response.send(commentsbyPostId[id] || []);
});

app.post("/posts/:id/comments", async (request, response) => {
  const id = request.params.id;
  const commentId = randomBytes(4).toString("hex");
  const { content, status } = request.body;
  const comments = commentsbyPostId[id] || [];

  comments.push({
    id: commentId,
    content,
    status: "pending"
  });

  commentsbyPostId[id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: id,
      status: "pending",
    },
  });

  response.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
