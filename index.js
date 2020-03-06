const express = require("express");
const Sse = require("json-sse");
const cors = require("cors");

const app = express();

const port = 4000;

const db = {};

db.messages = [];

const corsMiddleware = cors();
app.use(corsMiddleware);
// app.use(cors())

const parser = express.json();
app.use(parser);

const stream = new Sse();

app.get("/stream", (request, response) => {
  console.log("db.messages test", db.messages);

  const action = {
    type: "ALL_MESSAGES",
    payload: db.messages
  };

  stream.updateInit(action);
  stream.init(request, response);
});

app.post("/message", (request, response) => {
  const { text } = request.body;

  db.messages.push(text);

  response.send(text);

  const action = {
    type: "NEW_MESSAGE",
    payload: text
  };

  stream.send(action);
  console.log("db test:", db);
});

app.listen(port, () => console.log(`Listening on :${port}`));
