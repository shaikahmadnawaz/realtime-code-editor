import React, { useEffect } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
const Editor = () => {
  useEffect(() => {
    async function init() {
      //   These are methods present in code mirror package
      Codemirror.fromTextArea(document.getElementById("realtimeEditor"), {
        //   To enable this we have to import some css properties
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });
    }
    init();
  }, []);
  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
