import { io } from "socket.io-client";

// frontend socket part
export const initSocket = async () => {
  const options = {
    //   These are the options to connect with socket
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  // we have to give url of port we are present at
  // Where as in express we have install seperate .env pkg
  return io("https://realtime-editor-ygu5.onrender.com", options);
};
