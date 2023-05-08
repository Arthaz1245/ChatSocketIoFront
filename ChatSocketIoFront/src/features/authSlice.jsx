import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

const USER_URL = "http://localhost:5500/users";
const initialState = {
  token: localStorage.getItem("token"),
  name: "",
  email: "",
  _id: "",
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
  users: [],
  onlineUsers: [],
  userById: {},
  status: "idle",
  error: null,
};
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, { rejectWithValue }) => {
    try {
      const token = await axios.post(`${USER_URL}/register`, {
        name: user.name,
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("token", token.data);

      return token.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const token = await axios.post(`${USER_URL}/login`, {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("token", token.data);
      return token.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const findUser = createAsyncThunk(
  "auth/findUser",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) return null;
      const response = await axios.get(`${USER_URL}/find/${userId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const findUsers = createAsyncThunk("auth/findUsers", async () => {
  try {
    const response = await axios.get(`${USER_URL}`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser(state, action) {
      const token = state.token;
      if (token) {
        const user = jwtDecode(token);
        return {
          ...state,
          token,
          name: user.name,
          email: user.email,
          _id: user._id,
          userLoaded: true,
        };
      }
    },
    logoutUser(state, action) {
      localStorage.removeItem("token");
      return {
        ...state,
        token: "",
        name: "",
        email: "",
        _id: "",
        registerStatus: "",
        registerError: "",
        loginStatus: "",
        loginError: "",
        userLoaded: false,
      };
    },
    usersOnline: (state, action) => {
      const newOnlineUsers = state.onlineUsers.filter(
        (ouser) => ouser?.userById !== action.payload?.userId
      );
      state.onlineUsers = newOnlineUsers;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        return { ...state, registerStatus: "pending" };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);

          return {
            ...state,
            token: action.payload,
            name: user.name,
            email: user.email,
            password: user.password,
            _id: user._id,
            registerStatus: "sucess",
          };
        } else {
          return state;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        return {
          ...state,
          registerStatus: "rejected",
          registerError: action.payload,
        };
      })
      .addCase(loginUser.pending, (state, action) => {
        return { ...state, loginStatus: "pending" };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          return {
            ...state,
            token: action.payload,
            name: user.name,
            email: user.email,
            password: user.password,
            _id: user._id,
            loginStatus: "sucess",
          };
        } else {
          return state;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        return {
          ...state,
          loginStatus: "rejected",
          loginError: action.payload,
        };
      })
      .addCase(findUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.status = "succeded";
        state.userById = action.payload;
      })
      .addCase(findUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(findUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(findUsers.fulfilled, (state, action) => {
        state.status = "succeded";
        state.users = action.payload;
      })
      .addCase(findUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { loadUser, logoutUser, usersOnline } = authSlice.actions;
export default authSlice.reducer;
