import { createSlice } from "@reduxjs/toolkit";
const loadLoanApplications = () => {
  const stored = localStorage.getItem("loanApplications");  // Load Loan applications from LocalStorage
  return stored ? JSON.parse(stored) : [];
};
const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => Number(x.id) || 0)) + 1 : 1);

const loanSlice = createSlice({
  name: "loan",
  initialState: {
    list: loadLoanApplications(),
  },
  reducers: {
    addLoanApplication(state, action) {
      const app = {
        id: nextId(state.list),
        status: "Pending",
        reason: "",
        ...action.payload,
      };
      state.list.push(app);
      localStorage.setItem("loanApplications", JSON.stringify(state.list));
    },
    updateLoanApplication(state, action) {
      const { id, status, reason } = action.payload;
      const app = state.list.find((a) => a.id === id);
      if (app) {
        app.status = status;
        app.reason = reason;
        localStorage.setItem("loanApplications", JSON.stringify(state.list));
      }
    }
  }
});

export const { addLoanApplication, updateLoanApplication } = loanSlice.actions;
export default loanSlice.reducer;
