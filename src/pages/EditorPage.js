import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  //  It helps to go to the specific URL, forward or backward pages.
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
const EditorPage = () => {
  // initialisation of sockets
  /* useRef is used to store data that is used for multiple rendering 
  so that data will not change by re - rendering, even re-rendering also will not happen */
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

  const [clients, setClients] = useState([]);
  // whenever the page re-renders the use rffect is called
  useEffect(() => {
    const init = async () => {
      /* The keyword await makes JavaScript wait until 
      that promise settles and returns its result. */
      /** Whenever you use ref use current */
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
      // by calling this user is coonected with sever
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        // this is new js syntax it will not throw error if uNmae not found
        // this is like a state that always returns your current URL.
        // If the URL is changed, the useLocation will be updated as well.
        // location is used to get username from state
        //  ? this will not give error if we did username
        username: location.state?.username,
      });
      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          // This toast is other users who joined after me
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        // This is acutally doing that it is removing sockedId from the previous list
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }
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
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
