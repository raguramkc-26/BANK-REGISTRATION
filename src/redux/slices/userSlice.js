import { createSlice } from "@reduxjs/toolkit";
const loadUsers = () => {
  const stored = localStorage.getItem("users");
  return stored ? JSON.parse(stored) : [];
};
const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => Number(x.id) || 0)) + 1 : 1);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: loadUsers(),  // Redux state loads existing users
  },
  reducers: {
    addUser(state, action) {
      const newUser = { id: nextId(state.list), ...action.payload };
      state.list.push(newUser);
      localStorage.setItem("users", JSON.stringify(state.list)); 
    },
    deleteUser(state, action) {
      state.list = state.list.filter((u) => u.id !== action.payload);
      localStorage.setItem("users", JSON.stringify(state.list)); 
    },
    updateUser(state, action) {
      const { id, username, userType } = action.payload;
      const user = state.list.find((u) => u.id === id);
      if (user) {
        user.username = username;
        user.userType = userType;
        localStorage.setItem("users", JSON.stringify(state.list)); 
      }
    }
  }
});

export const { addUser, deleteUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
