import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
  },
  reducers: {
    setUsers(state, action) {
      state.list = action.payload;
    },

    addUser(state, action) {
      state.list.push(action.payload);
    },

    deleteUser(state, action) {
      state.list = state.list.filter(
        (u) => u._id !== action.payload
      );
    },

    updateUser(state, action) {
      const index = state.list.findIndex(
        (u) => u._id === action.payload._id
      );

      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const {
  setUsers,
  addUser,
  deleteUser,
  updateUser,
} = usersSlice.actions;

export default usersSlice.reducer;