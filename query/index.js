const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];

    post.comments.push({
      id,
      content,
      status,
    });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comments = post.comments
    
    const comment = comments.find(it => {
        return it.id === id 
    })
    comment.status = status
    comment.content = content
  }
}
app.get("/posts", async (request, response) => {
  response.send(posts);
});

app.post("/events", async (request, response) => {
  const { type, data } = request.body;

  handleEvent(type, data)
  
  response.send({});
});

app.listen(4002, async () => {
  console.log("Listening on port 4002");

  const res = await axios.get("http://event-bus-srv:4005/events")

  for (let event of res.data) {
    console.log("Processing event", event.type);
    handleEvent(event.type, event.data);
  }
});