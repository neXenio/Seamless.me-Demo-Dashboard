const websocket = require("./server/websocket.js");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/status", (req, res) => {
  console.log("status requested");
  res.sendStatus(200);
});

websocket.init(io);

server.listen(9999, () => console.log("Listening on port 9999"));
