// importing express
const express = require("express");
// calling express
const app = express();
const http = require("http");
// importing socket
const { Server } = require("socket.io");

const server = http.createServer(app);
// creating instance for server class
const io = new Server(server);
// This event is triggred when any socket is Connected
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
});

// listening on 5000 port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
