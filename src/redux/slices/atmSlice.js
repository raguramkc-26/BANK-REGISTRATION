import { createSlice } from "@reduxjs/toolkit";
const loadAtmApplications = () => {
  const stored = localStorage.getItem("atmApplications");
  return stored ? JSON.parse(stored) : [];
};
const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => Number(x.id) || 0)) + 1 : 1);

const atmSlice = createSlice({
  name: "atm",
  initialState: {
    list: loadAtmApplications(),
  },
  reducers: {
    addAtmApplication(state, action) { 
      const app = {
        id: nextId(state.list),
        status: "Pending",
        reason: "",
        ...action.payload,
      };
      state.list.push(app);
      localStorage.setItem("atmApplications", JSON.stringify(state.list)); 
    },
    updateAtmApplication(state, action) {
      const { id, status, reason } = action.payload;
      const app = state.list.find((a) => a.id === id);
      if (app) {
        app.status = status;
        app.reason = reason;
        localStorage.setItem("atmApplications", JSON.stringify(state.list));
      }
    }
  }
});

export const { addAtmApplication, updateAtmApplication } = atmSlice.actions;
export default atmSlice.reducer;
