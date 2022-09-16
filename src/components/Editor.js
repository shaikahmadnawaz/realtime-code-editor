import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
/* To enable theme we have import this css file
which is present in node modules */
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
/* To enable mode we have import this javascript file
which is present in node modules */
import ACTIONS from "../Actions";
const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  // initializing code editor
  useEffect(() => {
    async function init() {
      //   These are methods present in code mirror package
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          // To enable this we have to import some css properties
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      // event of code mirror
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
  }, [socketRef.current]);
  /* we connect code mirror with our text area so that it will convert ta in fully featured editor */
  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
