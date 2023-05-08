import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const CHAT_URL = "http://localhost:5500";
const initialState = {
  // chats: localStorage.getItem("chats")
  //   ? JSON.parse(localStorage.getItem("chats"))
  //   : [],
  chats: [],
  chat: [],
  onlineUsers: [],
  messages: [],
  status: "idle",
  error: null,
};
export const createChat = createAsyncThunk(
  "chat/createChat",
  async (initialUsers, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${CHAT_URL}/chats`, initialUsers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${CHAT_URL}/chats/${chatId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMessage = createAsyncThunk(
  "message/createMessage",
  async (initialUsers, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${CHAT_URL}/messages`, initialUsers);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getMessages = createAsyncThunk(
  "message/getMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CHAT_URL}/messages/${chatId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getChat = createAsyncThunk(
  "chat/getChat",
  async ({ firstId, secondId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${CHAT_URL}/chat/${firstId}/${secondId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUserChats = createAsyncThunk(
  "chat/getuserChats ",
  async (userId) => {
    try {
      const response = await axios.get(`${CHAT_URL}/chats/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createChat.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats.push(action.payload);
        //localStorage.setItem("chats", JSON.stringify(state.chats));
      })
      .addCase(createChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteChat.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload;

        const allChats = state.chats;
        const deleteChat = allChats.filter((c) => c.id !== id);
        state.chats = deleteChat;
        // localStorage.setItem("chats", JSON.stringify(state.chats));
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserChats.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUserChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload;
      })
      .addCase(getUserChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getChat.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chat = action.payload;
      })
      .addCase(getChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createMessage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages.push(action.payload);
        console.log(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
