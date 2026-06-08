import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  userType: "",
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.username = action.payload.username;
      state.userType = action.payload.userType;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.username = "";
      state.userType = "";
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
