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
  return io(process.env.REACT_APP_BACKEND_URL, options);
};
