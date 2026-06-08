import { configureStore } from "@reduxjs/toolkit";  
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/userSlice";
import atmReducer from "./slices/atmSlice";
import loanReducer from "./slices/loanSlice";
export const store = configureStore({
    reducer: {
    auth: authReducer,
    users: usersReducer,
    atm: atmReducer,
    loan: loanReducer,
  },
});             