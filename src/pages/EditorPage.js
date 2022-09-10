import React, { useState, useRef, useEffect } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { useLocation } from "react-router-dom";
import ACTIONS from "../Actions";
const EditorPage = () => {
  // initialisation of sockets
  /* useRef is used to store data that is used for multiple rendering 
  so that data will not change by re - rendering, even re-rendering also will not happen */
  const socketRef = useRef(null);
  const location = useLocation();
  // whenever the page re-renders the use rffect is called
  useEffect(() => {
    const init = async () => {
      // By calling this client/browser will connect with server
      socketRef.current = await initSocket();
      // We have to send message to the sever that join me
      // socketRef.current.emit(ACTIONS.JOIN, {
      //   roomId,
      //   // location is used to get username from state
      //   //  ? this will not give error if we did username
      //   username: location.state?.username,
      // });
    };
    init();
  }, []);
  const [clients, setClients] = useState([{ socketId: 1, username: "nawaz" }]);
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
