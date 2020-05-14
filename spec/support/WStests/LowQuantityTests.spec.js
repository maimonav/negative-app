/*

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
});*/
