// importing express
const express = require("express");
// calling express
const app = express();
const http = require("http");
// importing socket
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");
const server = http.createServer(app);
// creating instance for server class
const io = new Server(server);
const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  // this will return the rooId in all rooms
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}
// This event is triggred when any socket is Connected
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  // server listening that is emitted by client
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    // if already user present and getting new ids also
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
});

// listening on 5000 port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
