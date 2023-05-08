import { configureStore } from "@reduxjs/toolkit";
// import { createMessage } from "../features/chatSlice";
import chatReducer from "../features/chatSlice";
import { io } from "socket.io-client";
import authReducer, { findUsers, loadUser } from "../features/authSlice";
const socket = io("http://localhost:3000");
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});
store.dispatch(loadUser(null));
store.dispatch(findUsers());

// socket.on("getMessage", (message) => {
//   console.log(message);
//   store.dispatch(createMessage(message));
// });
