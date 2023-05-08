import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("new-message", (message) => {
  // handle the new message event, for example dispatching an action
});

export default socket;
