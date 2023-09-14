// importing express
const express = require("express");
// calling express
const app = express();
// const path = require("path");
const http = require("http");
const cors = require("cors");
// importing socket
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");
const server = http.createServer(app);

// creating instance for server class
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// We are storing mapping here in memory, by restarting server everything will be lost, if production level app we have to store in db,file etc

// Whenever we get request to build then automatically it calls index.js in build/static it is built and displayed in browser
// app.use(express.static("build"));
// We are saying to the serverv that whatever request we get server them index.html
// app.use(express.static(path.resolve(__dirname, "./build")));
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./build", "index.html"));
// });

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
    // We are storing unique IDs with userNames in browser itself
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
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  // this is only called when the user closed browser or moved to another page
  socket.on("disconnecting", () => {
    // we are getting all rooms
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

// listening on 5000 port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
