import { createSlice } from "@reduxjs/toolkit";

const loanSlice = createSlice({
  name: "loan",
  initialState: {
    list: [],
  },
  reducers: {
    setLoanApplications(state, action) {
      state.list = action.payload;
    },

    addLoanApplication(state, action) {
      state.list.push(action.payload);
    },

    updateLoanApplication(state, action) {
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
  setLoanApplications,
  addLoanApplication,
  updateLoanApplication,
} = loanSlice.actions;

export default loanSlice.reducer;