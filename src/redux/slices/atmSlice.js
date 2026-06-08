import { createSlice } from "@reduxjs/toolkit";

const atmSlice = createSlice({
  name: "atm",
  initialState: {
    list: [],
  },
  reducers: {
    setAtmApplications(state, action) {
      state.list = action.payload;
    },

    addAtmApplication(state, action) {
      state.list.push(action.payload);
    },

    updateAtmApplication(state, action) {
      const index = state.list.findIndex(
        (a) => a._id === action.payload._id
      );

      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const {
  setAtmApplications,
  addAtmApplication,
  updateAtmApplication,
} = atmSlice.actions;

export default atmSlice.reducer;