import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

//TODO:: websocket impl
const socket = new WebSocket("ws://localhost:3001");

// Connection opened
socket.addEventListener("open", function(event) {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", function(event) {
  let msg = JSON.parse(event.data);
  if (msg.type === "ERROR") console.log("Error:\n", msg.content);
  console.log("Message from server:\ntype:", msg.subtype, "\n", msg.content);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
