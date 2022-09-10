import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
const EditorPage = () => {
  // initialisation of sockets
  /* useRef is used to store data that is used for multiple rendering 
  so that data will not change by re - rendering, even re-rendering also will not happen */
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([]);
  // whenever the page re-renders the use rffect is called
  useEffect(() => {
    const init = async () => {
      // By calling this client/browser will connect with server
      socketRef.current = await initSocket();
      // We have to send error message to client if there is problem in connection
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        // if we get error we redirect to home page
        reactNavigator("/");
      }

      // We have to send message to the sever that join me
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        // location is used to get username from state
        //  ? this will not give error if we did username
        username: location.state?.username,
      });
      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
        }
      );
    };
    init();
  }, []);
  // if we didnt get any state then navigate to home
  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code-sync.png" alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  );
};

export default EditorPage;
